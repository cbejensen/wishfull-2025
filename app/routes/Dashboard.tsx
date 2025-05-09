import { Wishes } from "~/components/wishes/Wishes";
import { useAuth } from "../context/AuthContext";
import { useWishlist, WishlistProvider } from "../context/WishlistContext";
import { Loading } from "~/components/ui/Loading";
import Button from "~/components/ui/Button";
import { Gift, TagIcon } from "lucide-react";
import { AddEditWishModal } from "~/components/wishes/AddEditWishModal";
import { useState } from "react";
import Modal from "~/components/ui/Modal";
import TagManagementForm from "~/components/wishes/TagManagementForm";

export function DashboardHeader({}: {}) {
  const { addTag, updateTag, deleteTag, tags } = useWishlist();
  const [showManageTagsModal, setShowManageTagsModal] = useState(false);
  
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
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
          onClick={() => setShowManageTagsModal(true)}
        >
          Manage Tags
        </Button>
        <Button
          variant="primary"
          leftIcon={<Gift size={16} />}
          onClick={() => setIsWishModalOpen(true)}
        >
          Add Wish
        </Button>
      </div>
      <AddEditWishModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
      />
      {/* Manage Tags Modal */}
      {addTag && updateTag && deleteTag ? (
        <Modal
          isOpen={showManageTagsModal}
          onClose={() => setShowManageTagsModal(false)}
          title="Manage Tags"
          size="lg"
        >
          <TagManagementForm
            tags={tags}
            onAddTag={addTag}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
            onClose={() => setShowManageTagsModal(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  return currentUser ? (
    <WishlistProvider userId={currentUser?.id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader />
        <Wishes />
      </div>
    </WishlistProvider>
  ) : (
    <Loading />
  );
}
