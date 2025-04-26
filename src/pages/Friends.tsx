import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FriendsList } from '../components/friends/FriendsList';
import { FindFriends } from '../components/friends/FindFriends';

const Friends: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadFriendsAndUsers = async () => {
      try {
        setLoading(true);

        const { data: friendsData, error: friendsError } = await supabase
          .from('friends')
          .select(`
            *,
            profile:profiles!friend_id (
              id,
              display_name,
              avatar_url
            )
          `)
          .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });

        if (friendsError) throw friendsError;

        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser.id)
          .order('display_name');

        if (usersError) throw usersError;

        setFriends(friendsData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error loading friends and users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFriendsAndUsers();
  }, [currentUser]);

  const filteredUsers = users.filter(user =>
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !friends.some(f => 
      (f.user_id === user.id && f.friend_id === currentUser?.id) ||
      (f.friend_id === user.id && f.user_id === currentUser?.id)
    )
  );

  const handleAddFriend = async (userId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: currentUser.id,
          friend_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      const { data: newFriend, error: fetchError } = await supabase
        .from('friends')
        .select(`
          *,
          profile:profiles!friend_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('user_id', currentUser.id)
        .eq('friend_id', userId)
        .single();

      if (fetchError) throw fetchError;

      setFriends([...friends, newFriend]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleRespondToRequest = async (friendId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', friendId);

      if (error) throw error;

      setFriends(friends.map(friend => 
        friend.id === friendId 
          ? { ...friend, status: accept ? 'accepted' : 'rejected' }
          : friend
      ));
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendId);

      if (error) throw error;

      setFriends(friends.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FriendsList
        friends={friends}
        currentUser={currentUser}
        handleRespondToRequest={handleRespondToRequest}
        handleRemoveFriend={handleRemoveFriend}
      />
      <FindFriends
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredUsers={filteredUsers}
        handleAddFriend={handleAddFriend}
      />
    </div>
  );
};

export default Friends;