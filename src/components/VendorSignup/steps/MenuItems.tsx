import React, { useState } from 'react';
import { SignupFormData, MenuItem } from '../VendorSignupForm';
import { Plus, X, Upload, Globe, FileText } from 'lucide-react';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

const categories = [
  'Appetizers',
  'Main Courses',
  'Sides',
  'Desserts',
  'Beverages',
  'Specials'
];

const dietaryTags = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Spicy',
  'Contains Nuts'
];

function MenuItems({ formData, updateFormData }: Props) {
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    dietaryTags: []
  });

  const addMenuItem = () => {
    if (newItem.name && newItem.price !== undefined && newItem.price >= 0 && newItem.category) {
      updateFormData({
        menuItems: [...formData.menuItems, newItem as MenuItem]
      });
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: '',
        dietaryTags: []
      });
    }
  };

  const removeMenuItem = (index: number) => {
    const updatedItems = formData.menuItems.filter((_, i) => i !== index);
    updateFormData({ menuItems: updatedItems });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if the value is a valid number or empty
    if (value === '' || !isNaN(parseFloat(value))) {
      setNewItem({
        ...newItem,
        price: value === '' ? 0 : parseFloat(value)
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData({ menuFile: file });
    }
  };

  const handleWebsiteUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ websiteMenuUrl: event.target.value });
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          You can add menu items manually, upload a file (PDF/CSV), or provide your website menu URL.
        </p>
      </div>

      {/* Manual Item Entry */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add Menu Items Manually</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItem.price || ''}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryTags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.dietaryTags?.includes(tag)}
                    onChange={(e) => {
                      const updatedTags = e.target.checked
                        ? [...(newItem.dietaryTags || []), tag]
                        : (newItem.dietaryTags || []).filter(t => t !== tag);
                      setNewItem({ ...newItem, dietaryTags: updatedTags });
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={addMenuItem}
            className="flex items-center text-primary hover:text-secondary transition"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Item
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Upload Menu File</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="menu-file"
            />
            <label
              htmlFor="menu-file"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload PDF or CSV file
              </span>
            </label>
          </div>
          {formData.menuFile && (
            <p className="text-sm text-green-600 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {formData.menuFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Website Menu URL */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Menu URL</h3>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            placeholder="https://your-website.com/menu"
            value={formData.websiteMenuUrl || ''}
            onChange={handleWebsiteUrl}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Added Items List */}
      {formData.menuItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Added Menu Items</h3>
          <div className="space-y-2">
            {formData.menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
              >
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-primary">${item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </div>
                  {item.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeMenuItem(index)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuItems;
