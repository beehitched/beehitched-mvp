'use client';

import React from 'react';

interface RegistryEditorProps {
  content: {
    message?: string;
    links?: { name?: string; url?: string }[];
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function RegistryEditor({ content, onChange, onTitleChange, title }: RegistryEditorProps) {
  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...(content.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ links: newLinks });
  };
  const handleAddLink = () => {
    onChange({ links: [...(content.links || []), { name: '', url: '' }] });
  };
  const handleRemoveLink = (index: number) => {
    const newLinks = [...(content.links || [])];
    newLinks.splice(index, 1);
    onChange({ links: newLinks });
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
          placeholder="Registry"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registry Message</label>
        <input
          type="text"
          value={content.message || ''}
          onChange={e => onChange({ message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your presence is our present, but if you'd like to give a gift..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registry Links</label>
        <div className="space-y-2">
          {(content.links || []).map((link, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={link.name || ''}
                onChange={e => handleLinkChange(idx, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Store Name"
              />
              <input
                type="text"
                value={link.url || ''}
                onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://..."
              />
              <button
                onClick={() => handleRemoveLink(idx)}
                className="text-red-500 hover:text-red-700 px-2"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddLink}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-md mt-2"
            type="button"
          >
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
} 