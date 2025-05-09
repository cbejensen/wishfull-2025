import { useNavigate, useParams } from "react-router";
import { Wishes } from "~/components/wishes/Wishes";
import { useAuth } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { useEffect } from "react";

export default function User() {
  const navigate = useNavigate();
  const params = useParams();
  const viewingUserId = params.id;
  const { currentUser: authenticatedUser } = useAuth();
  const authenticatedUserIsViewedUser = authenticatedUser?.id === viewingUserId;
  
  // If the authenticated user is the one being viewed, redirect to their own profile
  useEffect(() => {
    // Check if the userId is valid (e.g., a valid UUID)j
    if (authenticatedUserIsViewedUser) {
      navigate("/dashboard");
      return;
    }
  }, [authenticatedUserIsViewedUser]);


  return (
    <WishlistProvider userId={viewingUserId}>
      <Wishes />
    </WishlistProvider>
  );
}
