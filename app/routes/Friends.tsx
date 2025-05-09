import { useEffect, useState } from "react";
import { FindFriends } from "../components/friends/FindFriends";
import { FriendsList } from "../components/friends/FriendsList";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type { Tables } from "~/types";
import { Loading } from "~/components/ui/Loading";

export type FriendWithProfiles = Tables<"friends"> & {
  source: Pick<Tables<"profiles">, "id" | "display_name" | "avatar_url">;
  target: Pick<Tables<"profiles">, "id" | "display_name" | "avatar_url">;
};

export default function Friends() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Tables<"profiles">[]>([]);
  const [friends, setFriends] = useState<FriendWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const loadFriends = async () => {
      try {
        setLoading(true);
        const { data: friendsData, error: friendsError } = await supabase
          .from("friends")
          .select(
            `
            *,
            source:profiles!user_id (
              id,
              display_name,
              avatar_url
            ),
            target:profiles!friend_id (
              id,
              display_name,
              avatar_url
            )
          `
          )
          .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
          .order("created_at", { ascending: false });

        if (friendsError) throw friendsError;

        setFriends(friendsData || []);
      } catch (error) {
        console.error("Error loading friends and users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery.length < 3 || !currentUser) {
      setProfiles([])
      return;
    }
    const loadProfiles = async () => { 
      const { data: profileData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", currentUser.id)
      .order("display_name")
      .textSearch(
        "display_name",
        searchQuery,
      );
      if (profilesError) {
        console.error("Error loading users:", profilesError);
        return;
      }
      setProfiles(profileData || []);
    }
    loadProfiles()
  }, [currentUser, searchQuery])

  const nonFriends = profiles.filter(
    (profile) =>
      !friends.some(
        (f) =>
          (f.user_id === profile.id && f.friend_id === currentUser?.id) ||
          (f.friend_id === profile.id && f.user_id === currentUser?.id)
      )
  );

  const handleAddFriend = async (userId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from("friends").insert({
        user_id: currentUser.id,
        friend_id: userId,
        status: "pending",
      });

      if (error) throw error;

      const { data: newFriend, error: fetchError } = await supabase
        .from("friends")
        .select(
          `
          *,
          source:profiles!user_id (
            id,
            display_name,
            avatar_url
          ),
          target:profiles!friend_id (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq("user_id", currentUser.id)
        .eq("friend_id", userId)
        .single();

      if (fetchError) throw fetchError;

      setFriends([...friends, newFriend]);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRespondToRequest = async (friendId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from("friends")
        .update({ status: accept ? "accepted" : "rejected" })
        .eq("id", friendId);

      if (error) throw error;

      setFriends(
        friends.map((friend) =>
          friend.id === friendId
            ? { ...friend, status: accept ? "accepted" : "rejected" }
            : friend
        )
      );
    } catch (error) {
      console.error("Error responding to friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .delete()
        .eq("id", friendId);

      if (error) throw error;

      setFriends(friends.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (loading) {
    return <Loading />;
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
        filteredUsers={nonFriends}
        handleAddFriend={handleAddFriend}
      />
    </div>
  );
}
