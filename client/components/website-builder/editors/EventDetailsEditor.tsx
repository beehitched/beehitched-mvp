'use client';

import React from 'react';

interface EventDetailsEditorProps {
  content: {
    ceremony?: {
      time?: string;
      location?: string;
      address?: string;
      description?: string;
    };
    reception?: {
      time?: string;
      location?: string;
      address?: string;
      description?: string;
    };
  };
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export default function EventDetailsEditor({ content, onChange, onTitleChange, title }: EventDetailsEditorProps) {
  const handleCeremonyChange = (field: string, value: string) => {
    onChange({ ceremony: { ...content.ceremony, [field]: value } });
  };
  const handleReceptionChange = (field: string, value: string) => {
    onChange({ reception: { ...content.reception, [field]: value } });
  };
  return (
    <div className="p-6 space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Event Details"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-2">Ceremony</h3>
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Time" value={content.ceremony?.time || ''} onChange={e => handleCeremonyChange('time', e.target.value)} />
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Location" value={content.ceremony?.location || ''} onChange={e => handleCeremonyChange('location', e.target.value)} />
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Address" value={content.ceremony?.address || ''} onChange={e => handleCeremonyChange('address', e.target.value)} />
          <textarea className="w-full px-3 py-2 border rounded min-h-[60px]" placeholder="Description" value={content.ceremony?.description || ''} onChange={e => handleCeremonyChange('description', e.target.value)} />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Reception</h3>
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Time" value={content.reception?.time || ''} onChange={e => handleReceptionChange('time', e.target.value)} />
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Location" value={content.reception?.location || ''} onChange={e => handleReceptionChange('location', e.target.value)} />
          <input type="text" className="mb-2 w-full px-3 py-2 border rounded" placeholder="Address" value={content.reception?.address || ''} onChange={e => handleReceptionChange('address', e.target.value)} />
          <textarea className="w-full px-3 py-2 border rounded min-h-[60px]" placeholder="Description" value={content.reception?.description || ''} onChange={e => handleReceptionChange('description', e.target.value)} />
        </div>
      </div>
    </div>
  );
} 