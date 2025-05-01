import { Filter, Gift, Grid, List, TagIcon } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import AddEditWishForm from "../wishes/AddEditWishForm";
import PurchaseWishForm from "../wishes/PurchaseWishForm";
import TagManagementForm from "../wishes/TagManagementForm";
import WishCard from "../wishes/WishCard";
import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { useWishlist } from "~/context/WishlistContext";
import { WishStatus, type Wish } from "~/types";

export function Wishes() {
  const { currentUser } = useAuth();
  const {
    wishes,
    tags,
    addWish,
    updateWish,
    deleteWish,
    markAsPurchased,
    addTag,
    updateTag,
    deleteTag,
    isAuthUser,
  } = useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddWishModal, setShowAddWishModal] = useState(false);
  const [showManageTagsModal, setShowManageTagsModal] = useState(false);

  // UI state
  const [wishBeingEdited, setWishBeingEdited] = useState<Wish | null>(null);
  const [wishBeingPurchased, setWishBeingPurchased] = useState<Wish | null>(
    null
  );

  // Filtering
  const [activeFilter, setActiveFilter] = useState<WishStatus | "all">("all");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Handle adding a new wish
  const handleAddWish = addWish
    ? async (wishData: Partial<Wish>) => {
        if (!currentUser) return;

        try {
          await addWish({
            ...wishData,
            userId: currentUser.id,
            status: WishStatus.OPEN,
          } as Omit<Wish, "id" | "createdAt" | "updatedAt">);
          setShowAddWishModal(false);
        } catch (error) {
          console.error("Failed to add wish:", error);
        }
      }
    : null;

  // Handle updating a wish
  const handleUpdateWish = updateWish
    ? async (wishData: Partial<Wish>) => {
        if (wishBeingEdited?.id) {
          try {
            await updateWish(wishBeingEdited.id, wishData);
            setWishBeingEdited(null);
          } catch (error) {
            console.error("Failed to update wish:", error);
          }
        }
      }
    : null;

  // Handle wish purchase
  const handlePurchase = async (
    wishId: string,
    purchasedBy: string,
    purchaseDate: string
  ) => {
    try {
      await markAsPurchased(wishId, purchasedBy, purchaseDate);
      setWishBeingPurchased(null);
    } catch (error) {
      console.error("Failed to mark wish as purchased:", error);
    }
  };

  // Filter wishes based on selected filters
  const filteredWishes = wishes.filter((wish) => {
    // Filter by status
    if (activeFilter !== "all" && wish.status !== activeFilter) {
      return false;
    }

    // Filter by tag
    if (activeTagFilter && !wish.tagIds.includes(activeTagFilter)) {
      return false;
    }

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setActiveFilter("all");
    setActiveTagFilter(null);
  };

  // Handle wish deletion with confirmation
  const handleDeleteWish = deleteWish
    ? async (wishId: string) => {
        if (confirm("Are you sure you want to delete this wish?")) {
          try {
            await deleteWish(wishId);
          } catch (error) {
            console.error("Failed to delete wish:", error);
          }
        }
      }
    : null;

  return (
    <>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="font-medium text-gray-700 flex items-center">
            <Filter size={18} className="mr-2" />
            Filters
          </h2>

          {/* View mode toggle */}
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status filters */}
          <div className="mr-4">
            <span className="text-sm text-gray-500 mr-2">Status:</span>
            <div className="inline-flex rounded-md shadow-sm mt-1" role="group">
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                  activeFilter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium ${
                  activeFilter === WishStatus.OPEN
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
                onClick={() => setActiveFilter(WishStatus.OPEN)}
              >
                Open
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium ${
                  activeFilter === WishStatus.PURCHASED
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
                onClick={() => setActiveFilter(WishStatus.PURCHASED)}
              >
                Purchased
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                  activeFilter === WishStatus.FULFILLED
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
                onClick={() => setActiveFilter(WishStatus.FULFILLED)}
              >
                Fulfilled
              </button>
            </div>
          </div>

          {/* Tag filters */}
          {tags.length > 0 && (
            <div>
              <span className="text-sm text-gray-500 mr-2">Tags:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      activeTagFilter === tag.id
                        ? "ring-2 ring-offset-1 ring-purple-500"
                        : ""
                    }`}
                    style={{
                      backgroundColor: tag.color,
                      color: "white",
                    }}
                    onClick={() =>
                      setActiveTagFilter(
                        activeTagFilter === tag.id ? null : tag.id
                      )
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset filters button */}
          {(activeFilter !== "all" || activeTagFilter !== null) && (
            <button
              className="text-sm text-purple-600 hover:text-purple-800 mt-1 ml-auto"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Wishes grid/list */}
      {filteredWishes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Gift size={48} className="mx-auto text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No wishes found
          </h3>
          <p className="mt-1 text-gray-500">
            {wishes.length === 0
              ? "No wishes have been added yet."
              : "No wishes match your current filters."}
          </p>
          <div className="mt-6">
            {wishes.length === 0 ? (
              isAuthUser ? (
                <Button
                  variant="primary"
                  onClick={() => setShowAddWishModal(true)}
                >
                  Add Your First Wish
                </Button>
              ) : null
            ) : (
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredWishes.map((wish) => (
            <WishCard
              key={wish.id}
              wish={wish}
              tags={tags}
              onEdit={(id) =>
                setWishBeingEdited(wishes.find((w) => w.id === id) || null)
              }
              onDelete={handleDeleteWish}
              onPurchase={(id) =>
                setWishBeingPurchased(wishes.find((w) => w.id === id) || null)
              }
            />
          ))}
        </div>
      )}

      {/* Add/Edit Wish Modal */}
      {handleAddWish ? (
        <Modal
          isOpen={showAddWishModal}
          onClose={() => setShowAddWishModal(false)}
          title="Add New Wish"
          size="lg"
        >
          <AddEditWishForm
            tags={tags}
            onSubmit={handleAddWish}
            onCancel={() => setShowAddWishModal(false)}
          />
        </Modal>
      ) : null}

      {/* Edit Wish Modal */}
      {handleUpdateWish ? (
        <Modal
          isOpen={!!wishBeingEdited}
          onClose={() => setWishBeingEdited(null)}
          title="Edit Wish"
          size="lg"
        >
          {wishBeingEdited && (
            <AddEditWishForm
              initialData={wishBeingEdited}
              tags={tags}
              onSubmit={handleUpdateWish}
              onCancel={() => setWishBeingEdited(null)}
            />
          )}
        </Modal>
      ) : null}

      {/* Purchase Wish Modal */}
      <Modal
        isOpen={!!wishBeingPurchased}
        onClose={() => setWishBeingPurchased(null)}
        title="Mark as Purchased"
      >
        {wishBeingPurchased && (
          <PurchaseWishForm
            wish={wishBeingPurchased}
            onPurchase={handlePurchase}
            onCancel={() => setWishBeingPurchased(null)}
          />
        )}
      </Modal>

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
    </>
  );
}
