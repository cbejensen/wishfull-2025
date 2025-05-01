import { useNavigate, useParams } from "react-router";
import { Wishes } from "~/components/wishes/Wishes";
import { useAuth } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";

export default function User() {
  const navigate = useNavigate();
  const params = useParams();
  const viewingUserId = params.id;
  if (!viewingUserId) {
    navigate("/dashboard");
    return;
  }

  const { currentUser: authenticatedUser } = useAuth();
  const authenticatedUserIsViewedUser = authenticatedUser?.id === viewingUserId;
  if (authenticatedUserIsViewedUser) {
    // If the authenticated user is the one being viewed, redirect to their own profile
    navigate("/dashboard");
    return;
  }

  return (
    <WishlistProvider userId={viewingUserId}>
      <Wishes />
    </WishlistProvider>
  );
}
