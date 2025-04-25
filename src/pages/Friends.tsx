import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, UserX, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  profile?: Profile;
}

const Friends: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load friends and other users
  useEffect(() => {
    if (!currentUser) return;

    const loadFriendsAndUsers = async () => {
      try {
        setLoading(true);
        
        // Load friends
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
        
        // Load all users except current user
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser.id)
          .order('display_name');
        console.log({ usersData, usersError })

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

  // Filter users based on search query
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

      // Refresh friends list
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
      {/* Current Friends Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Friends</h2>

        {friends.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {friends.map((friend) => (
              <li key={friend.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  {friend.profile?.avatar_url ? (
                    <img
                      src={friend.profile.avatar_url}
                      alt={friend.profile.display_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                      {friend.profile?.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {friend.profile?.display_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {friend.status === 'pending' && friend.user_id === currentUser?.id
                        ? 'Request sent'
                        : friend.status === 'pending'
                        ? 'Request received'
                        : friend.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {friend.status === 'pending' && friend.friend_id === currentUser?.id && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Check size={16} />}
                        onClick={() => handleRespondToRequest(friend.id, true)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<X size={16} />}
                        onClick={() => handleRespondToRequest(friend.id, false)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {friend.status === 'accepted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<UserX size={16} />}
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
            <p className="text-gray-500">
              Find and add friends from the list below
            </p>
          </div>
        )}
      </div>

      {/* Find Friends Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Find Friends</h2>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
            fullWidth
          />
        </div>

        <div className="divide-y divide-gray-200">
          {filteredUsers.map(user => (
            <div key={user.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.display_name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus size={16} />}
                onClick={() => handleAddFriend(user.id)}
              >
                Add Friend
              </Button>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No users found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;