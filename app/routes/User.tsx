import { useNavigate, useParams } from "react-router";
import { Wishes } from "~/components/wishes/Wishes";
import { useAuth } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Tables } from "~/types";

export default function User() {
  const navigate = useNavigate();
  const params = useParams();
  const viewingUserId = params.id;
  const { currentUser: authenticatedUser } = useAuth();
  const authenticatedUserIsViewedUser = authenticatedUser?.id === viewingUserId;
  const [viewingUser, setViewingUser] = useState<Tables<"profiles"> | null>(null);

  // If the authenticated user is the one being viewed, redirect to their own profile
  useEffect(() => {
    // Check if the userId is valid (e.g., a valid UUID)j
    if (authenticatedUserIsViewedUser) {
      navigate("/dashboard");
      return;
    }
  }, [authenticatedUserIsViewedUser]);

  useEffect(() => {
    const fetchViewingUser = async () => {
      if (!viewingUserId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", viewingUserId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      setViewingUser(data);
    };

    fetchViewingUser();
  }, [viewingUserId]);

  return (
    <WishlistProvider userId={viewingUserId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewingUser && <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{viewingUser.display_name}</h1>}
        <Wishes />
      </div>
    </WishlistProvider>
  );
}
