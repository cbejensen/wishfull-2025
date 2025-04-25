import React, { useState } from 'react';
import { Save, XCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Tag } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import TagBadge from '../ui/TagBadge';

interface TagManagementFormProps {
  tags: Tag[];
  onAddTag: (name: string, color: string) => void;
  onUpdateTag: (tagId: string, updates: Partial<Tag>) => void;
  onDeleteTag: (tagId: string) => void;
  onClose: () => void;
}

const TagManagementForm: React.FC<TagManagementFormProps> = ({
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
  onClose,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#8B5CF6'); // Default to purple
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [errors, setErrors] = useState<{
    newTag?: string;
    editTag?: string;
  }>({});

  // Predefined colors
  const colorOptions = [
    '#8B5CF6', // Purple
    '#14B8A6', // Teal
    '#0c822d', // Green
    '#F59E0B', // Amber
    '#F97316', // Orange
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#EC4899', // Pink
  ];

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      setErrors({ ...errors, newTag: 'Tag name is required' });
      return;
    }
    
    onAddTag(newTagName, newTagColor);
    setNewTagName('');
    setErrors({ ...errors, newTag: undefined });
  };

  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleUpdateTag = () => {
    if (!editName.trim()) {
      setErrors({ ...errors, editTag: 'Tag name is required' });
      return;
    }
    
    if (editingTagId) {
      onUpdateTag(editingTagId, { name: editName, color: editColor });
      setEditingTagId(null);
      setErrors({ ...errors, editTag: undefined });
    }
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setErrors({ ...errors, editTag: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Existing tags */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Your Tags</h4>
        
        {tags.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tags created yet.</p>
        ) : (
          <ul className="space-y-4">
            {tags.map(tag => (
              <li 
                key={tag.id} 
                className={`
                  flex flex-col sm:flex-row sm:items-center justify-between
                  p-3 rounded-lg border border-gray-200 hover:border-gray-300
                  transition-colors duration-200
                `}
              >
                {editingTagId === tag.id ? (
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Tag name"
                        error={errors.editTag}
                        className="flex-grow"
                      />
                      
                      <div className="sm:w-auto">
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-6 h-6 rounded-full ${
                                color === editColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setEditColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="primary"
                        leftIcon={<Save size={16} />}
                        onClick={handleUpdateTag}
                      >
                        Save
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-2 sm:mb-0">
                      <TagBadge tag={tag} />
                    </div>
                    
                    <div className="flex space-x-2 sm:ml-4">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => startEditing(tag)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        onClick={() => onDeleteTag(tag.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new tag section */}
      <div className="border-t border-gray-200 pt-4">
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                label="New Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Electronics, Books, Clothing..."
                error={errors.newTag}
                className="flex-grow"
              />
              
              <div className="sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full ${
                        color === newTagColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleAddTag}
                leftIcon={<Plus size={16} />}
                variant='outline'
              >
                Add Tag
              </Button>
            </div>
          </div>
      </div>
      
      <div className="flex justify-end border-t pt-4">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};

export default TagManagementForm;