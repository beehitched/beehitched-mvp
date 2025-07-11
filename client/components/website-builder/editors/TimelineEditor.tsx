'use client';

import React from 'react';

interface TimelineEditorProps {
  content: any;
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function TimelineEditor({ content, onChange, onTitleChange, title }: TimelineEditorProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Timeline"
        />
      </div>
      <div className="text-gray-500">Timeline editor coming soon!</div>
    </div>
  );
} 