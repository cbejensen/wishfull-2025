import React, { createContext, useState, useEffect, useContext } from 'react';
import { Wish, Tag, WishlistContextType, WishStatus } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const WishlistContext = createContext<WishlistContextType>({
  wishes: [],
  tags: [],
  addWish: () => {},
  updateWish: () => {},
  deleteWish: () => {},
  markAsPurchased: () => {},
  markAsReceived: () => {},
  addTag: () => {},
  updateTag: () => {},
  deleteTag: () => {},
  loading: false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishes and tags when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadWishesAndTags();
      
      // Subscribe to real-time updates
      const wishesSubscription = supabase
        .channel('wishes_channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'wishes',
          // delete events are not filterable!
          // https://supabase.com/docs/guides/realtime/postgres-changes#delete-events-are-not-filterable
          filter: `user_id=eq.${currentUser.id}`
        }, payload => {
          console.log(payload)
          if (payload.eventType === 'INSERT') {
            setWishes(prev => [...prev, transformWishFromDB(payload.new)]);
          } else if (payload.eventType === 'UPDATE') {
            setWishes(prev => prev.map(wish => 
              wish.id === payload.new.id ? transformWishFromDB(payload.new) : wish
            ));
          } else if (payload.eventType === 'DELETE') {
            setWishes(prev => prev.filter(wish => wish.id !== payload.old.id));
          }
        })
          // separate listener for delete events since they are not filterable
          // https://supabase.com/docs/guides/realtime/postgres-changes#delete-events-are-not-filterable
        .on('postgres_changes', { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'wishes',
        }, payload => {
          setWishes(prev => prev.filter(wish => wish.id !== payload.old.id));
        })
        .subscribe();

      const tagsSubscription = supabase
        .channel('tags_channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'tags',
          filter: `user_id=eq.${currentUser.id}`
        }, payload => {
          if (payload.eventType === 'INSERT') {
            setTags(prev => [...prev, transformTagFromDB(payload.new)]);
          } else if (payload.eventType === 'UPDATE') {
            setTags(prev => prev.map(tag => 
              tag.id === payload.new.id ? transformTagFromDB(payload.new) : tag
            ));
          } else if (payload.eventType === 'DELETE') {
            setTags(prev => prev.filter(tag => tag.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        wishesSubscription.unsubscribe();
        tagsSubscription.unsubscribe();
      };
    } else {
      setWishes([]);
      setTags([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadWishesAndTags = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Load wishes
      const { data: wishesData, error: wishesError } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (wishesError) throw wishesError;

      // Load tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('name');

      if (tagsError) throw tagsError;

      setWishes(wishesData.map(transformWishFromDB));
      setTags(tagsData.map(transformTagFromDB));
    } catch (error) {
      console.error('Error loading wishes and tags:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform database wish to frontend wish
  const transformWishFromDB = (dbWish: any): Wish => ({
    id: dbWish.id,
    userId: dbWish.user_id,
    name: dbWish.name,
    price: dbWish.price,
    priorityLevel: dbWish.priority_level,
    links: dbWish.links || [],
    imageUrl: dbWish.image_url,
    description: dbWish.description,
    quantity: dbWish.quantity,
    privacyLevel: dbWish.privacy_level,
    status: dbWish.status,
    tagIds: dbWish.tag_ids || [],
    purchasedBy: dbWish.purchased_by,
    purchaseDate: dbWish.purchase_date,
    createdAt: dbWish.created_at,
    updatedAt: dbWish.updated_at,
  });

  // Transform frontend wish to database wish
  const transformWishToDB = (wish: Partial<Wish>) => ({
    user_id: currentUser?.id,
    name: wish.name,
    price: wish.price,
    priority_level: wish.priorityLevel,
    links: wish.links,
    image_url: wish.imageUrl,
    description: wish.description,
    quantity: wish.quantity,
    privacy_level: wish.privacyLevel,
    status: wish.status,
    tag_ids: wish.tagIds,
    purchased_by: wish.purchasedBy,
    purchase_date: wish.purchaseDate,
  });

  // Transform database tag to frontend tag
  const transformTagFromDB = (dbTag: any): Tag => ({
    id: dbTag.id,
    userId: dbTag.user_id,
    name: dbTag.name,
    color: dbTag.color,
  });

  // Transform frontend tag to database tag
  const transformTagToDB = (tag: Partial<Tag>) => ({
    user_id: currentUser?.id,
    name: tag.name,
    color: tag.color,
  });

  // Add a new wish
  const addWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert([transformWishToDB(wishData)])
        .select()
        .single();

      if (error) throw error;
      
      return transformWishFromDB(data);
    } catch (error) {
      console.error('Error adding wish:', error);
      throw error;
    }
  };

  // Update an existing wish
  const updateWish = async (wishId: string, updates: Partial<Wish>) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .update(transformWishToDB(updates))
        .eq('id', wishId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  };

  // Delete a wish
  const deleteWish = async (wishId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  };

  // Mark a wish as purchased
  const markAsPurchased = async (wishId: string, purchasedBy: string, purchaseDate: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .update({
          status: WishStatus.PURCHASED,
          purchased_by: purchasedBy,
          purchase_date: purchaseDate,
        })
        .eq('id', wishId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking wish as purchased:', error);
      throw error;
    }
  };

  // Mark a wish as received or not received
  const markAsReceived = async (wishId: string, received: boolean) => {
    if (!currentUser) return;

    try {
      const updates = received
        ? { status: WishStatus.FULFILLED }
        : { 
            status: WishStatus.OPEN,
            purchased_by: null,
            purchase_date: null,
          };

      const { error } = await supabase
        .from('wishes')
        .update(updates)
        .eq('id', wishId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking wish as received:', error);
      throw error;
    }
  };

  // Add a new tag
  const addTag = async (name: string, color: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([transformTagToDB({ name, color })])
        .select()
        .single();

      if (error) throw error;
      
      return transformTagFromDB(data);
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  };

  // Update an existing tag
  const updateTag = async (tagId: string, updates: Partial<Tag>) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('tags')
        .update(transformTagToDB(updates))
        .eq('id', tagId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  };

  // Delete a tag
  const deleteTag = async (tagId: string) => {
    if (!currentUser) return;

    try {
      // First, remove the tag from all wishes that have it
      const { data: wishes, error: wishesError } = await supabase
        .from('wishes')
        .select('id, tag_ids')
        .eq('user_id', currentUser.id)
        .contains('tag_ids', [tagId]);

      if (wishesError) throw wishesError;

      // Update wishes that contain this tag
      for (const wish of wishes) {
        const updatedTagIds = wish.tag_ids.filter((id: string) => id !== tagId);
        const { error } = await supabase
          .from('wishes')
          .update({ tag_ids: updatedTagIds })
          .eq('id', wish.id)
          .eq('user_id', currentUser.id);

        if (error) throw error;
      }

      // Then delete the tag
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', currentUser.id);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  };

  const value = {
    wishes,
    tags,
    addWish,
    updateWish,
    deleteWish,
    markAsPurchased,
    markAsReceived,
    addTag,
    updateTag,
    deleteTag,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);