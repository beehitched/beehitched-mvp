'use client';

import React from 'react';
import { Calendar, MapPin, Image as ImageIcon, Upload } from 'lucide-react';

interface HeroEditorProps {
  content: {
    headline?: string;
    subtitle?: string;
    date?: string;
    venue?: string;
    backgroundImage?: string;
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function HeroEditor({ content, onChange, onTitleChange, title }: HeroEditorProps) {
  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just store the file name
      // In a real implementation, you'd upload to a server and get a URL
      onChange({ backgroundImage: file.name });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Welcome to Our Wedding"
        />
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Headline
        </label>
        <input
          type="text"
          value={content.headline || ''}
          onChange={(e) => handleInputChange('headline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Emily & Jack's Wedding"
        />
        <p className="text-sm text-gray-500 mt-1">This will be the main title displayed prominently</p>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="We're getting married!"
        />
        <p className="text-sm text-gray-500 mt-1">A brief subtitle or tagline</p>
      </div>

      {/* Wedding Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Wedding Date
        </label>
        <input
          type="date"
          value={content.date || ''}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Venue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Venue
        </label>
        <input
          type="text"
          value={content.venue || ''}
          onChange={(e) => handleInputChange('venue', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Beautiful Wedding Venue"
        />
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ImageIcon className="inline w-4 h-4 mr-1" />
          Background Image
        </label>
        <div className="space-y-3">
          {content.backgroundImage && (
            <div className="relative">
              <img
                src={content.backgroundImage}
                alt="Background preview"
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                onClick={() => handleInputChange('backgroundImage', '')}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-sm text-gray-600">
                {content.backgroundImage ? 'Change image' : 'Upload background image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080 or larger</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.headline || 'Emily & Jack\'s Wedding'}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {content.subtitle || 'We\'re getting married!'}
          </p>
          {content.date && (
            <div className="flex items-center justify-center gap-2 text-lg text-gray-700 mb-2">
              <Calendar size={20} />
              <span>{new Date(content.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          )}
          {content.venue && (
            <div className="flex items-center justify-center gap-2 text-lg text-gray-700">
              <MapPin size={20} />
              <span>{content.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 