import React, { useState, useRef } from 'react';
import { Camera, Loader, X } from 'lucide-react';
import { uploadUserPhoto, deleteUserPhoto } from '../lib/storage';

interface Props {
  userId: string;
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
  className?: string;
}

function UserPhotoUpload({ userId, currentPhotoUrl, onPhotoUpdate, className = '' }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const photoUrl = await uploadUserPhoto(file, userId);
      onPhotoUpdate(photoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPhotoUrl) return;
    
    setIsUploading(true);
    setError(null);

    try {
      await deleteUserPhoto(userId, currentPhotoUrl);
      onPhotoUpdate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-32 h-32 mx-auto">
        {currentPhotoUrl ? (
          <>
            <img
              src={currentPhotoUrl}
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
            <button
              onClick={handleDelete}
              className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition"
              title="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 text-center mt-2">{error}</p>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="mt-4 w-full text-center text-sm text-primary hover:text-secondary transition disabled:opacity-50"
      >
        {currentPhotoUrl ? 'Change Photo' : 'Upload Photo'}
      </button>
    </div>
  );
}

export default UserPhotoUpload;
