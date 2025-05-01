import React, { createContext, useState, useEffect, useContext } from 'react';
import { type Wish, type Tag, type WishlistContextType, WishStatus, type Tables, type PriorityLevel, type WishPrivacy } from '~/types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext<WishlistContextType>({
  wishes: [],
  tags: [],
  addWish: null,
  updateWish: null,
  deleteWish: null,
  markAsPurchased: () => {},
  markAsReceived: null,
  addTag: null,
  updateTag: null,
  deleteTag: null,
  loading: false,
  isAuthUser: false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const { currentUser } = useAuth();
  const isAuthUser = currentUser?.id === userId;
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishes and tags when userId changes
  useEffect(() => {
    if (userId) {
      loadWishesAndTags();

      // Subscribe to real-time updates
      const wishesSubscription = supabase
        .channel('wishes_channel')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'wishes',
          filter: `user_id=eq.${userId}`,
        }, payload => {
          if (payload.eventType === 'INSERT') {
            setWishes(prev => [...prev, transformWishFromDB(payload.new as Tables<'wishes'>)]);
          } else if (payload.eventType === 'UPDATE') {
            setWishes(prev => prev.map(wish =>
              wish.id === payload.new.id ? transformWishFromDB(payload.new as Tables<'wishes'>) : wish
            ));
          } else if (payload.eventType === 'DELETE') {
            setWishes(prev => prev.filter(wish => wish.id !== payload.old.id));
          }
        })
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
          filter: `user_id=eq.${userId}`,
        }, payload => {
          if (payload.eventType === 'INSERT') {
            setTags(prev => [...prev, transformTagFromDB(payload.new as Tables<'tags'>)]);
          } else if (payload.eventType === 'UPDATE') {
            setTags(prev => prev.map(tag =>
              tag.id === payload.new.id ? transformTagFromDB(payload.new as Tables<'tags'>) : tag
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
  }, [userId]);

  const loadWishesAndTags = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Load wishes
      const { data: wishesData, error: wishesError } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (wishesError) throw wishesError;

      // Load tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
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
  const transformWishFromDB = (dbWish: Tables<'wishes'>): Wish => ({
    id: dbWish.id,
    userId: dbWish.user_id,
    name: dbWish.name,
    price: dbWish.price,
    priorityLevel: dbWish.priority_level as PriorityLevel,
    links: dbWish.links || [],
    imageUrl: dbWish.image_url,
    description: dbWish.description,
    quantity: dbWish.quantity === 'infinity' ? Infinity : parseInt(dbWish.quantity, 10),
    privacyLevel: dbWish.privacy_level as WishPrivacy,
    status: dbWish.status as WishStatus,
    tagIds: dbWish.tag_ids || [],
    purchasedBy: dbWish.purchased_by,
    purchaseDate: dbWish.purchase_date,
    createdAt: dbWish.created_at,
    updatedAt: dbWish.updated_at,
  });

  // Transform frontend wish to database wish
  const transformWishToDB = (wish: Partial<Wish>): Tables<'wishes'> => ({
    user_id: userId,
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
  const transformTagFromDB = (dbTag: Tables<'tags'>): Tag => ({
    id: dbTag.id,
    userId: dbTag.user_id,
    name: dbTag.name,
    color: dbTag.color,
  });

  // Transform frontend tag to database tag
  const transformTagToDB = (tag: Partial<Tag>): Tables<'tags'> => ({
    user_id: userId,
    name: tag.name,
    color: tag.color,
  });

  // Add a new wish
  const addWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;

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
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .update(transformWishToDB(updates))
        .eq('id', wishId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wish:', error);
      throw error;
    }
  };

  // Delete a wish
  const deleteWish = async (wishId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting wish:', error);
      throw error;
    }
  };

  // Mark a wish as purchased
  const markAsPurchased = async (wishId: string, purchasedBy: string, purchaseDate: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .update({
          status: WishStatus.PURCHASED,
          purchased_by: purchasedBy,
          purchase_date: purchaseDate,
        })
        .eq('id', wishId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking wish as purchased:', error);
      throw error;
    }
  };

  // Mark a wish as received or not received
  const markAsReceived = async (wishId: string, received: boolean) => {
    if (!userId) return;

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
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking wish as received:', error);
      throw error;
    }
  };

  // Add a new tag
  const addTag = async (name: string, color: string) => {
    if (!userId) return;

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
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tags')
        .update(transformTagToDB(updates))
        .eq('id', tagId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  };

  // Delete a tag
  const deleteTag = async (tagId: string) => {
    if (!userId) return;

    try {
      // First, remove the tag from all wishes that have it
      const { data: wishes, error: wishesError } = await supabase
        .from('wishes')
        .select('id, tag_ids')
        .eq('user_id', userId)
        .contains('tag_ids', [tagId]);

      if (wishesError) throw wishesError;

      // Update wishes that contain this tag
      for (const wish of wishes) {
        const updatedTagIds = wish.tag_ids?.filter((id: string) => id !== tagId);
        const { error } = await supabase
          .from('wishes')
          .update({ tag_ids: updatedTagIds })
          .eq('id', wish.id)
          .eq('user_id', userId);

        if (error) throw error;
      }

      // Then delete the tag
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  };

  const value = {
    wishes,
    tags,
    addWish: isAuthUser ? addWish : null,
    updateWish: isAuthUser ? updateWish : null,
    deleteWish: isAuthUser ? deleteWish : null,
    markAsPurchased,
    markAsReceived: isAuthUser ? markAsReceived : null,
    addTag: isAuthUser ? addTag : null,
    updateTag: isAuthUser ? updateTag : null,
    deleteTag: isAuthUser ? deleteTag : null,
    loading,
    isAuthUser,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);