import React, { useState, useEffect } from 'react';
import { Plus, Minus, Link as LinkIcon, Image, Save } from 'lucide-react';
import { Wish, WishPrivacy, PriorityLevel, Tag } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import TagBadge from '../ui/TagBadge';

interface AddEditWishFormProps {
  initialData?: Partial<Wish>;
  tags: Tag[];
  onSubmit: (data: Partial<Wish>) => void;
  onCancel: () => void;
}

const AddEditWishForm: React.FC<AddEditWishFormProps> = ({
  initialData,
  tags,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Wish>>({
    name: '',
    price: 0,
    priorityLevel: 2,
    links: [''],
    description: '',
    quantity: 1,
    privacyLevel: WishPrivacy.FRIENDS,
    tagIds: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: value === 'infinity' ? 'infinity' : parseInt(value) || 1,
      });
    } else if (name === 'priorityLevel') {
      setFormData({
        ...formData,
        [name]: parseInt(value) as PriorityLevel,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...(formData.links || [''])];
    updatedLinks[index] = value;
    setFormData({ ...formData, links: updatedLinks });
  };
  
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...(formData.links || []), ''],
    });
  };
  
  const removeLink = (index: number) => {
    const updatedLinks = [...(formData.links || [])];
    updatedLinks.splice(index, 1);
    setFormData({ ...formData, links: updatedLinks });
  };
  
  const toggleTag = (tagId: string) => {
    const currentTagIds = formData.tagIds || [];
    
    if (currentTagIds.includes(tagId)) {
      setFormData({
        ...formData,
        tagIds: currentTagIds.filter(id => id !== tagId),
      });
    } else {
      setFormData({
        ...formData,
        tagIds: [...currentTagIds, tagId],
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    // Validate links
    if (formData.links && formData.links.length > 0) {
      formData.links.forEach((link, index) => {
        if (link && link.trim() !== '') {
          try {
            new URL(link);
          } catch (e) {
            newErrors[`link-${index}`] = 'Please enter a valid URL';
          }
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Clean up empty links
      const cleanLinks = (formData.links || []).filter(link => link.trim() !== '');
      
      onSubmit({
        ...formData,
        links: cleanLinks.length ? cleanLinks : [],
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <Input
            label="Wish Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            error={errors.name}
            placeholder="MacBook Pro 16-inch"
            fullWidth
          />
        </div>
        
        {/* Price */}
        <div>
          <Input
            label="Price"
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price?.toString() || ''}
            onChange={handleChange}
            error={errors.price}
            placeholder="0.00"
            fullWidth
          />
        </div>
        
        {/* Priority */}
        <div>
          <Select
            label="Priority"
            name="priorityLevel"
            value={formData.priorityLevel?.toString() || '2'}
            onChange={handleChange}
            options={[
              { value: '1', label: 'Low' },
              { value: '2', label: 'Medium' },
              { value: '3', label: 'High' },
            ]}
            fullWidth
          />
        </div>
        
        {/* Quantity */}
        <div>
          <Select
            label="Quantity"
            name="quantity"
            value={formData.quantity?.toString() || '1'}
            onChange={handleChange}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
              { value: 'infinity', label: 'Infinity (No limit)' },
            ]}
            fullWidth
          />
        </div>
        
        {/* Privacy */}
        <div>
          <Select
            label="Privacy"
            name="privacyLevel"
            value={formData.privacyLevel || WishPrivacy.FRIENDS}
            onChange={handleChange}
            options={[
              { value: WishPrivacy.PRIVATE, label: 'Private (Only me)' },
              { value: WishPrivacy.FRIENDS, label: 'Friends' },
              { value: WishPrivacy.LINK, label: 'Anyone with link' },
            ]}
            fullWidth
          />
        </div>
        
        {/* Image URL */}
        <div className="md:col-span-2">
          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            icon={<Image size={18} />}
            fullWidth
          />
        </div>
        
        {/* Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Links to Purchase
          </label>
          
          {(formData.links || ['']).map((link, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="https://example.com/product"
                error={errors[`link-${index}`]}
                icon={<LinkIcon size={18} />}
                className="flex-grow"
              />
              <div className="flex-shrink-0 ml-2">
                {index === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    leftIcon={<Plus size={16} />}
                  />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLink(index)}
                    leftIcon={<Minus size={16} />}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-200"
            placeholder="Describe your wish (color, size, model, etc.)"
          />
        </div>
        
        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="focus:outline-none"
              >
                <TagBadge
                  tag={tag}
                  className={formData.tagIds?.includes(tag.id) ? 'ring-2 ring-offset-2 ring-purple-500' : ''}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          leftIcon={<Save size={18} />}
        >
          {initialData?.id ? 'Update Wish' : 'Add Wish'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditWishForm;