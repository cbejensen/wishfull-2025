import React from "react";
import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { Dispatch, SetStateAction } from "react";
import type { Tables } from "~/types";

interface FindFriendsProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  filteredUsers: Pick<
    Tables<"profiles">,
    "id" | "display_name" | "avatar_url"
  >[];
  handleAddFriend: (userId: string) => void;
}

export const FindFriends: React.FC<FindFriendsProps> = ({
  searchQuery,
  setSearchQuery,
  filteredUsers,
  handleAddFriend,
}) => {
  return (
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
        {filteredUsers.map((user) => (
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
                <p className="text-sm font-medium text-gray-900">
                  <Link
                    to={`/users/${user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {user.display_name}
                  </Link>
                </p>
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
            {searchQuery?.length > 2
              ? "No users found matching your search"
              : "Search for friends by name"}
          </div>
        )}
      </div>
    </div>
  );
};
