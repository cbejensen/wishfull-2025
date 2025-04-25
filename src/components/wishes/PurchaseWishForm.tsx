import React, { useState } from 'react';
import { Calendar, ShoppingBag } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Wish } from '../../types';
import { formatPrice } from '../../utils/helpers';

interface PurchaseWishFormProps {
  wish: Wish;
  onPurchase: (wishId: string, purchasedBy: string, purchaseDate: string) => void;
  onCancel: () => void;
}

const PurchaseWishForm: React.FC<PurchaseWishFormProps> = ({
  wish,
  onPurchase,
  onCancel,
}) => {
  const [purchaserName, setPurchaserName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [errors, setErrors] = useState<{
    purchaserName?: string;
    deliveryDate?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      purchaserName?: string;
      deliveryDate?: string;
    } = {};
    
    if (!purchaserName.trim()) {
      newErrors.purchaserName = 'Please enter your name';
    }
    
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Please select a delivery date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPurchase(wish.id, purchaserName, deliveryDate);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          {wish.imageUrl ? (
            <img
              src={wish.imageUrl}
              alt={wish.name}
              className="h-32 w-32 object-cover rounded-md"
            />
          ) : (
            <div className="h-32 w-32 bg-purple-100 flex items-center justify-center rounded-md">
              <ShoppingBag size={48} className="text-purple-500" />
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-center mb-1">{wish.name}</h3>
        <p className="text-purple-600 font-bold text-center">{formatPrice(wish.price)}</p>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-800 text-sm">
          <p>
            <strong>Important:</strong> By marking this item as purchased, other users will be prevented from buying the same item. 
            You'll need to provide a delivery date so we can verify the gift was received.
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          value={purchaserName}
          onChange={(e) => setPurchaserName(e.target.value)}
          placeholder="Enter your name"
          error={errors.purchaserName}
          fullWidth
        />
        
        <Input
          label="Expected Delivery Date"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          error={errors.deliveryDate}
          icon={<Calendar size={18} />}
          fullWidth
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<ShoppingBag size={18} />}
          >
            Mark as Purchased
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseWishForm;