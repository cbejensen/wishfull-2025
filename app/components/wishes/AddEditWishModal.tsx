import React, { useState } from 'react';
import Modal from '../ui/Modal';
import AddEditWishForm from './AddEditWishForm';
import { useWishlist } from '~/context/WishlistContext';
import { type Wish, WishStatus } from '~/types';
import { useAuth } from '~/context/AuthContext';

interface AddEditWishModalProps {
  initialData?: Partial<Wish> | null;
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

export const AddEditWishModal: React.FC<AddEditWishModalProps> = ({
  initialData,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { addWish, updateWish, tags } = useWishlist();

  const handleAddWish = addWish
    ? async (wishData: Partial<Wish>) => {
        if (!currentUser) return;

        try {
          await addWish({
            ...wishData,
            userId: currentUser.id,
            status: WishStatus.OPEN,
          } as Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>);
          onClose(false);
        } catch (error) {
          console.error('Failed to add wish:', error);
        }
      }
    : null;

  const handleUpdateWish = updateWish
    ? async (wishData: Partial<Wish>) => {
        if (currentUser && wishData?.id) {
          try {
            await updateWish(wishData.id, wishData);
            onClose(false);
          } catch (error) {
            console.error('Failed to update wish:', error);
          }
        }
      }
    : null;

  const handleSubmit = initialData ? handleUpdateWish : handleAddWish;

  return handleSubmit ? (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? 'Edit Wish' : 'Add New Wish'}
      size="lg"
    >
      <AddEditWishForm
        tags={tags}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => onClose(false)}
      />
    </Modal>
  ) : null;
};