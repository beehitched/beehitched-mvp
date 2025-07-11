'use client';

import React from 'react';

interface GalleryEditorProps {
  content: {
    photos?: string[];
    layout?: string;
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function GalleryEditor({ content, onChange, onTitleChange, title }: GalleryEditorProps) {
  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...(content.photos || [])];
    newPhotos[index] = value;
    onChange({ photos: newPhotos });
  };
  const handleAddPhoto = () => {
    onChange({ photos: [...(content.photos || []), ''] });
  };
  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...(content.photos || [])];
    newPhotos.splice(index, 1);
    onChange({ photos: newPhotos });
  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Photo Gallery"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (URLs)</label>
        <div className="space-y-2">
          {(content.photos || []).map((photo, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={photo}
                onChange={e => handlePhotoChange(idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/photo.jpg"
              />
              <button
                onClick={() => handleRemovePhoto(idx)}
                className="text-red-500 hover:text-red-700 px-2"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddPhoto}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-md mt-2"
            type="button"
          >
            Add Image
          </button>
        </div>
      </div>
    </div>
  );
} 