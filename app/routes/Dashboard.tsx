import { Wishes } from "~/components/wishes/Wishes";
import { useAuth } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { Loading } from "~/components/ui/Loading";
import Button from "~/components/ui/Button";
import { Gift, TagIcon } from "lucide-react";
import { useState } from "react";

export function DashboardHeader({
  onManageTags,
  onAddWish,
}: {
  onManageTags: () => void;
  onAddWish: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Wishes
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all your wishes in one place
        </p>
      </div>

      <div className="flex space-x-3 mt-4 sm:mt-0">
        <Button
          variant="outline"
          leftIcon={<TagIcon size={16} />}
          onClick={onManageTags}
        >
          Manage Tags
        </Button>
        <Button
          variant="primary"
          leftIcon={<Gift size={16} />}
          onClick={onAddWish}
        >
          Add Wish
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();

  return currentUser ? (
    <WishlistProvider userId={currentUser?.id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader onManageTags={() => {}} onAddWish={() => {}} />
        <Wishes />
      </div>
    </WishlistProvider>
  ) : (
    <Loading />
  );
}
