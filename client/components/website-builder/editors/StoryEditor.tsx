'use client';

import React from 'react';

interface StoryEditorProps {
  content: {
    story?: string;
    photos?: string[];
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function StoryEditor({ content, onChange, onTitleChange, title }: StoryEditorProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Our Story"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Story</label>
        <textarea
          value={content.story || ''}
          onChange={e => onChange({ story: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[120px]"
          placeholder="Share your love story..."
        />
      </div>
    </div>
  );
} 