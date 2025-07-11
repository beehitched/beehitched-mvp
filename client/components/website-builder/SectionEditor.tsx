'use client';

import React, { useState, useRef } from 'react';
import { Save, Upload, Image as ImageIcon, Video, FileText, Palette, Zap, X } from 'lucide-react';
import HeroEditor from './editors/HeroEditor';
import StoryEditor from './editors/StoryEditor';
import EventDetailsEditor from './editors/EventDetailsEditor';
import RSVPEditor from './editors/RSVPEditor';
import GalleryEditor from './editors/GalleryEditor';
import RegistryEditor from './editors/RegistryEditor';
import ContactEditor from './editors/ContactEditor';
import TimelineEditor from './editors/TimelineEditor';
import BridalPartyEditor from './editors/BridalPartyEditor';
import AccommodationsEditor from './editors/AccommodationsEditor';
import TravelEditor from './editors/TravelEditor';
import FAQEditor from './editors/FAQEditor';

interface Section {
  type: string;
  title: string;
  content: any;
  isEnabled: boolean;
  order: number;
  settings?: any;
}

interface SectionEditorProps {
  section: Section;
  onSave: (updatedSection: Section) => void;
  onClose: () => void;
}

const sectionTypes = {
  'hero': { title: 'Hero Section', icon: '💒' },
  'story': { title: 'Our Story', icon: '💕' },
  'event-details': { title: 'Event Details', icon: '📅' },
  'rsvp': { title: 'RSVP', icon: '✉️' },
  'gallery': { title: 'Photo Gallery', icon: '📸' },
  'registry': { title: 'Registry', icon: '🎁' },
  'bridal-party': { title: 'Bridal Party', icon: '👰' },
  'accommodations': { title: 'Accommodations', icon: '🏨' },
  'travel': { title: 'Travel', icon: '✈️' },
  'faq': { title: 'FAQ', icon: '❓' },
  'contact': { title: 'Contact', icon: '📞' },
  'timeline': { title: 'Timeline', icon: '⏰' }
};

export default function SectionEditor({ section, onSave, onClose }: SectionEditorProps) {
  const [editedSection, setEditedSection] = useState<Section>({ ...section });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'style' | 'settings'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editedSection);
      onClose();
    } catch (error) {
      console.error('Failed to save section:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    setEditedSection(prev => ({
      ...prev,
      content: { ...prev.content, ...newContent }
    }));
  };

  const handleTitleChange = (newTitle: string) => {
    setEditedSection(prev => ({
      ...prev,
      title: newTitle
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log('Image uploaded:', file);
      // You would typically upload to a server and get back a URL
      const imageUrl = URL.createObjectURL(file);
      handleContentChange({ backgroundImage: imageUrl });
    }
  };

  const handleAnimationToggle = (enabled: boolean) => {
    setEditedSection(prev => ({
      ...prev,
      settings: { ...prev.settings, animation: enabled }
    }));
  };

  const renderContentTab = () => {
    const commonProps = {
      content: editedSection.content,
      onChange: handleContentChange,
      onTitleChange: handleTitleChange,
      title: editedSection.title
    };

    switch (section.type) {
      case 'hero':
        return <HeroEditor {...commonProps} />;
      case 'story':
        return <StoryEditor {...commonProps} />;
      case 'event-details':
        return <EventDetailsEditor {...commonProps} />;
      case 'rsvp':
        return <RSVPEditor {...commonProps} />;
      case 'gallery':
        return <GalleryEditor {...commonProps} />;
      case 'registry':
        return <RegistryEditor {...commonProps} />;
      case 'contact':
        return <ContactEditor {...commonProps} />;
      case 'timeline':
        return <TimelineEditor {...commonProps} />;
      case 'bridal-party':
        return <BridalPartyEditor {...commonProps} />;
      case 'accommodations':
        return <AccommodationsEditor {...commonProps} />;
      case 'travel':
        return <TravelEditor {...commonProps} />;
      case 'faq':
        return <FAQEditor {...commonProps} />;
      default:
        return <div className="p-6 text-center text-gray-500">Editor not available for this section type.</div>;
    }
  };

  const renderMediaTab = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Images & Media</h3>
        
        {/* Background Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-300 transition-colors">
            {editedSection.content.backgroundImage ? (
              <div className="space-y-2">
                <img 
                  src={editedSection.content.backgroundImage} 
                  alt="Background" 
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => handleContentChange({ backgroundImage: '' })}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Choose Image
            </button>
          </div>
        </div>

        {/* Gallery Images */}
        {section.type === 'gallery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
            <button className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium">
              Add More Images
            </button>
          </div>
        )}
      </div>

      {/* Video Embed */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Video</h3>
        <div className="space-y-2">
          <input
            type="url"
            placeholder="YouTube or Vimeo URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
            Embed Video
          </button>
        </div>
      </div>
    </div>
  );

  const renderStyleTab = () => (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Colors</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={editedSection.content.backgroundColor || '#ffffff'}
              onChange={(e) => handleContentChange({ backgroundColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={editedSection.content.textColor || '#000000'}
              onChange={(e) => handleContentChange({ textColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <input
              type="color"
              value={editedSection.content.accentColor || '#E6397E'}
              onChange={(e) => handleContentChange({ accentColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Typography</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              value={editedSection.content.fontFamily || 'sans-serif'}
              onChange={(e) => handleContentChange({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="cursive">Cursive</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <select
              value={editedSection.content.fontSize || 'medium'}
              onChange={(e) => handleContentChange({ fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Layout</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => handleContentChange({ textAlign: align })}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                    editedSection.content.textAlign === align
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
            <input
              type="range"
              min="0"
              max="100"
              value={editedSection.content.padding || 20}
              onChange={(e) => handleContentChange({ padding: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0px</span>
              <span>{editedSection.content.padding || 20}px</span>
              <span>100px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Animation */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Animation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Enable Animations</span>
            <button
              onClick={() => handleAnimationToggle(!editedSection.settings?.animation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                editedSection.settings?.animation ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  editedSection.settings?.animation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {editedSection.settings?.animation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animation Type</label>
              <select
                value={editedSection.content.animationType || 'fade-in'}
                onChange={(e) => handleContentChange({ animationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                <option value="fade-in">Fade In</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-down">Slide Down</option>
                <option value="zoom-in">Zoom In</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Visibility</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show on Mobile</span>
            <button
              onClick={() => setEditedSection(prev => ({
                ...prev,
                settings: { ...prev.settings, showOnMobile: !prev.settings?.showOnMobile }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                editedSection.settings?.showOnMobile !== false ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  editedSection.settings?.showOnMobile !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show on Desktop</span>
            <button
              onClick={() => setEditedSection(prev => ({
                ...prev,
                settings: { ...prev.settings, showOnDesktop: !prev.settings?.showOnDesktop }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                editedSection.settings?.showOnDesktop !== false ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  editedSection.settings?.showOnDesktop !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS Class</label>
            <input
              type="text"
              value={editedSection.content.customClass || ''}
              onChange={(e) => handleContentChange({ customClass: e.target.value })}
              placeholder="my-custom-class"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom ID</label>
            <input
              type="text"
              value={editedSection.content.customId || ''}
              onChange={(e) => handleContentChange({ customId: e.target.value })}
              placeholder="my-custom-id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Zap }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'media' && renderMediaTab()}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 