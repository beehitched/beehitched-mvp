'use client';

import React from 'react';

interface RSVPEditorProps {
  content: {
    message?: string;
    deadline?: string;
    allowPlusOne?: boolean;
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function RSVPEditor({ content, onChange, onTitleChange, title }: RSVPEditorProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="RSVP"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Message</label>
        <input
          type="text"
          value={content.message || ''}
          onChange={e => onChange({ message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Please RSVP by [date]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Deadline</label>
        <input
          type="date"
          value={content.deadline || ''}
          onChange={e => onChange({ deadline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!content.allowPlusOne}
          onChange={e => onChange({ allowPlusOne: e.target.checked })}
          id="allowPlusOne"
        />
        <label htmlFor="allowPlusOne" className="text-sm text-gray-700">Allow Plus One</label>
      </div>
    </div>
  );
} 