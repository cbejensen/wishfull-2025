import React from 'react';
import { Users, UserX, Check, X } from 'lucide-react';
import Button from '../ui/Button';
import type { FriendWithProfile } from '../../pages/Friends';

interface FriendsListProps {
  friends: FriendWithProfile[];
  currentUser: { id: string } | null;
  handleRespondToRequest: (friendId: string, accept: boolean) => void;
  handleRemoveFriend: (friendId: string) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  currentUser,
  handleRespondToRequest,
  handleRemoveFriend,
}) => {
  // Sort friends: pending requests for the current user appear first
  const sortedFriends = [...friends].sort((a, b) => {
    if (a.status === 'pending' && a.friend_id === currentUser?.id) return -1;
    if (b.status === 'pending' && b.friend_id === currentUser?.id) return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Friends</h2>

      {sortedFriends.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {sortedFriends.map((friend) => (
            <li key={friend.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                {friend.profile?.avatar_url ? (
                  <img
                    src={friend.profile.avatar_url}
                    alt={friend.profile.display_name || ''}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                    {friend.profile?.display_name?.charAt(0).toUpperCase()}
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
  );
};