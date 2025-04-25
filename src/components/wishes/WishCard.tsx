import React, { useState } from 'react';
import { Link, ShoppingCart, Trash2, ExternalLink, Edit3 } from 'lucide-react';
import { Wish, WishStatus, Tag } from '../../types';
import Button from '../ui/Button';
import TagBadge from '../ui/TagBadge';
import { formatPrice, getPriorityText, getPriorityColorClass, truncateText, extractDomain } from '../../utils/helpers';

interface WishCardProps {
  wish: Wish;
  tags: Tag[];
  onEdit: (wishId: string) => void;
  onDelete: (wishId: string) => void;
  onPurchase: (wishId: string) => void;
}

const WishCard: React.FC<WishCardProps> = ({
  wish,
  tags,
  onEdit,
  onDelete,
  onPurchase,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get tags for this wish
  const wishTags = tags.filter(tag => wish.tagIds.includes(tag.id));

  // Function to render purchase status badge
  const renderStatusBadge = () => {
    switch (wish.status) {
      case WishStatus.PURCHASED:
        return (
          <div className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            Purchased
          </div>
        );
      case WishStatus.FULFILLED:
        return (
          <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Fulfilled
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with priority badge */}
      <div className="relative h-48 bg-gray-200">
        {wish.imageUrl ? (
          <img
            src={wish.imageUrl}
            alt={wish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100">
            {/* <Gift size={48} className="text-purple-300" /> */}
          </div>
        )}
        
        {/* Priority badge */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className={`flex items-center ${getPriorityColorClass(wish.priorityLevel)} text-white text-xs font-bold px-2 py-1 rounded`}>
            Priority: {getPriorityText(wish.priorityLevel)}
          </div>
          {renderStatusBadge()}
        </div>
        
        {/* Action buttons on hover */}
        <div 
          className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            className="bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-purple-600"
            onClick={() => onEdit(wish.id)}
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-600"
            onClick={() => onDelete(wish.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{wish.name}</h3>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-bold text-purple-600">
            {formatPrice(wish.price)}
          </div>
          <div className="text-sm text-gray-600">
            Qty: {wish.quantity === 'infinity' ? '∞' : wish.quantity}
          </div>
        </div>
        
        {/* Description */}
        {wish.description && (
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(wish.description, 120)}
          </p>
        )}
        
        {/* Tags */}
        {wishTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {wishTags.map(tag => (
              <TagBadge key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
        )}
        
        {/* Links */}
        {wish.links.length > 0 && (
          <div className="mb-4">
            {wish.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1"
              >
                <ExternalLink size={14} className="mr-1" />
                {extractDomain(link)}
              </a>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex space-x-2 mt-3">
          {wish.status === WishStatus.OPEN && (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              leftIcon={<ShoppingCart size={16} />}
              onClick={() => onPurchase(wish.id)}
            >
              Purchase
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Link size={16} />}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishCard;