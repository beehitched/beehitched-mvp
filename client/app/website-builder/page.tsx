'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Settings, 
  Palette, 
  Globe, 
  Save, 
  Play,
  Pause,
  Copy,
  Share2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import Link from 'next/link';
import SectionEditor from '../../components/website-builder/SectionEditor';

interface Section {
  type: string;
  title: string;
  content: any;
  isEnabled: boolean;
  order: number;
  settings?: any;
}

interface WeddingWebsite {
  _id: string;
  weddingId: string;
  slug: string;
  customDomain?: string;
  isPublished: boolean;
  theme: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    style: string;
  };
  sections: Section[];
  settings: {
    showCountdown: boolean;
    showGuestBook: boolean;
    allowPublicRSVP: boolean;
    requireRSVPCode: boolean;
    showGuestList: boolean;
    enableSharing: boolean;
    analytics: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

const sectionTypes = [
  { type: 'hero', title: 'Hero Section', icon: '💒', description: 'Welcome your guests' },
  { type: 'story', title: 'Our Story', icon: '💕', description: 'Share your love story' },
  { type: 'event-details', title: 'Event Details', icon: '📅', description: 'Ceremony & reception info' },
  { type: 'rsvp', title: 'RSVP', icon: '✉️', description: 'Let guests respond' },
  { type: 'gallery', title: 'Photo Gallery', icon: '📸', description: 'Share your photos' },
  { type: 'registry', title: 'Registry', icon: '🎁', description: 'Gift information' },
  { type: 'bridal-party', title: 'Bridal Party', icon: '👰', description: 'Meet the wedding party' },
  { type: 'accommodations', title: 'Accommodations', icon: '🏨', description: 'Hotel information' },
  { type: 'travel', title: 'Travel', icon: '✈️', description: 'Getting there' },
  { type: 'faq', title: 'FAQ', icon: '❓', description: 'Common questions' },
  { type: 'contact', title: 'Contact', icon: '📞', description: 'Get in touch' },
  { type: 'timeline', title: 'Timeline', icon: '⏰', description: 'Wedding day schedule' }
];

// Sortable Section Component
function SortableSection({ 
  section, 
  onToggle, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast,
  isSelected
}: { 
  section: Section;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: section.type + '-' + section.order
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const sectionInfo = sectionTypes.find(st => st.type === section.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        section.isEnabled 
          ? 'border-green-200 shadow-md' 
          : 'border-gray-200 opacity-60'
      } ${isDragging ? 'shadow-lg scale-105' : ''} ${isSelected ? 'border-pink-200 bg-pink-50' : ''}`}
    >
      <div className="p-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sectionInfo?.icon}</span>
            <h3 className="font-medium text-gray-900 text-sm">{section.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                section.isEnabled 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {section.isEnabled ? '✓' : '○'}
            </button>
            <button
              onClick={onEdit}
              className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-200"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs hover:bg-red-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs text-gray-500">Drag to reorder</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs hover:bg-gray-300 disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs hover:bg-gray-300 disabled:opacity-50"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Inline Editor (when selected) */}
        {isSelected && (
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-3">Quick Edit</h4>
            
            {/* Section Title */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  // Update the section title in the website state
                  const updatedSection = { ...section, title: e.target.value };
                  // This would need to be handled by the parent component
                  // For now, we'll just show the input
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            {/* Section-specific quick edit fields */}
            {section.type === 'hero' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={section.content.headline || ''}
                    placeholder="Your Headline"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={section.content.subtitle || ''}
                    placeholder="Your Subtitle"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={section.content.date ? section.content.date.split('T')[0] : ''}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={section.content.venue || ''}
                    placeholder="Your Venue"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>
            )}

            {section.type === 'story' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Story</label>
                <textarea
                  value={section.content.story || ''}
                  placeholder="Tell your story..."
                  rows={3}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                />
              </div>
            )}

            {section.type === 'event-details' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ceremony Time</label>
                  <input
                    type="time"
                    value={section.content.ceremonyTime || ''}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ceremony Location</label>
                  <input
                    type="text"
                    value={section.content.ceremonyLocation || ''}
                    placeholder="Ceremony location"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reception Time</label>
                  <input
                    type="time"
                    value={section.content.receptionTime || ''}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reception Location</label>
                  <input
                    type="text"
                    value={section.content.receptionLocation || ''}
                    placeholder="Reception location"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>
            )}

            {section.type === 'rsvp' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">RSVP Deadline</label>
                <input
                  type="date"
                  value={section.content.deadline || ''}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            )}

            {section.type === 'contact' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={section.content.email || ''}
                    placeholder="your-email@example.com"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={section.content.phone || ''}
                    placeholder="Your phone number"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>
            )}

            {/* Generic content editor for other sections */}
            {!['hero', 'story', 'event-details', 'rsvp', 'contact'].includes(section.type) && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={section.content.text || ''}
                  placeholder={`Add your ${section.type} content...`}
                  rows={2}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                />
              </div>
            )}

            {/* Save button for inline changes */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  // Save the inline changes
                  // This would need to be implemented to update the website state
                }}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={onEdit}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
              >
                Full Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WebsiteBuilderPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch user's wedding first
  const fetchUserWedding = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collaboration/user/weddings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.weddings && data.weddings.length > 0) {
          setWeddingId(data.weddings[0].id);
        } else {
          setError('No wedding found. Please create a wedding first.');
        }
      } else {
        setError('Failed to fetch wedding data');
      }
    } catch (err) {
      setError('Failed to fetch wedding data');
    }
  }, [token]);

  // Fetch website data
  const fetchWebsite = useCallback(async () => {
    if (!weddingId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedding-website/wedding/${weddingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch website data');
      
      const data = await response.json();
      console.log('Website data loaded:', data);
      setWebsite(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch website data');
    } finally {
      setLoading(false);
    }
  }, [weddingId, token]);

  // Debug selectedSection changes
  useEffect(() => {
    console.log('selectedSection changed:', selectedSection);
    if (selectedSection) {
      console.log('Modal should be visible now!');
      // Force a re-render to ensure modal appears
      setTimeout(() => {
        console.log('Modal should definitely be visible after timeout');
      }, 100);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (token) {
      fetchUserWedding();
    }
  }, [fetchUserWedding, token]);

  useEffect(() => {
    if (weddingId) {
      fetchWebsite();
    }
  }, [fetchWebsite, weddingId]);

  // Handle drag and drop reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !website) {
      return;
    }
    
    const oldIndex = website.sections.findIndex(section => section.type + '-' + section.order === active.id);
    const newIndex = website.sections.findIndex(section => section.type + '-' + section.order === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    
    const newSections = arrayMove(website.sections, oldIndex, newIndex);
    
    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setWebsite(prev => prev ? { ...prev, sections: updatedSections } : null);
  };

  // Save website changes
  const handleSave = async () => {
    if (!website || !weddingId) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedding-website/wedding/${weddingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(website)
      });
      
      if (!response.ok) throw new Error('Failed to save website');
      
      const updatedWebsite = await response.json();
      setWebsite(updatedWebsite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save website');
    } finally {
      setSaving(false);
    }
  };

  // Toggle section enable/disable
  const toggleSection = (sectionIndex: number) => {
    if (!website) return;
    
    const updatedSections = [...website.sections];
    updatedSections[sectionIndex].isEnabled = !updatedSections[sectionIndex].isEnabled;
    
    setWebsite({ ...website, sections: updatedSections });
  };

  // Move section up/down
  const moveSection = (fromIndex: number, toIndex: number) => {
    if (!website) return;
    
    const newSections = arrayMove(website.sections, fromIndex, toIndex);
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setWebsite({ ...website, sections: updatedSections });
  };

  // Add new section
  const addSection = (sectionType: string) => {
    if (!website) return;
    
    const sectionTypeInfo = sectionTypes.find(st => st.type === sectionType);
    if (!sectionTypeInfo) return;
    
    const newSection: Section = {
      type: sectionType,
      title: sectionTypeInfo.title,
      content: {},
      isEnabled: true,
      order: website.sections.length + 1
    };
    
    setWebsite({
      ...website,
      sections: [...website.sections, newSection]
    });
    
    setShowAddSection(false);
  };

  // Delete section
  const deleteSection = (sectionIndex: number) => {
    if (!website) return;
    
    const updatedSections = website.sections.filter((_, index) => index !== sectionIndex);
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setWebsite({ ...website, sections: reorderedSections });
  };

  // Edit section
  const handleEditSection = (section: Section) => {
    console.log('Edit section clicked:', section);
    setTimeout(() => {
      setSelectedSection(section);
    }, 0);
  };

  // Save section changes
  const handleSaveSection = (updatedSection: Section) => {
    if (!website) return;
    
    console.log('Saving section:', updatedSection);
    
    const updatedSections = website.sections.map(section => 
      section.type === updatedSection.type && section.order === updatedSection.order 
        ? updatedSection 
        : section
    );
    
    setWebsite({ ...website, sections: updatedSections });
    setSelectedSection(null);
  };

  // Close section editor
  const handleCloseSectionEditor = () => {
    console.log('Closing section editor');
    setSelectedSection(null);
  };

  // Handle go back
  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Website Builder</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the website builder.</p>
          <Link 
            href="/login"
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your website builder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Website Builder</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showSettings 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings size={16} />
                {showSettings ? 'Hide Settings' : 'Settings'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Sections */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
              <button
                onClick={() => setShowAddSection(!showAddSection)}
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* Add Section Modal */}
            {showAddSection && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Choose a section type:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {sectionTypes.map((sectionType) => (
                    <button
                      key={sectionType.type}
                      onClick={() => addSection(sectionType.type)}
                      className="flex items-center gap-3 p-2 text-left bg-white rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                    >
                      <span className="text-xl">{sectionType.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{sectionType.title}</div>
                        <div className="text-xs text-gray-500">{sectionType.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sections List */}
          <div className="flex-1 overflow-y-auto">
            {website && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={website.sections.map(section => section.type + '-' + section.order)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="p-4 space-y-3">
                    {website.sections.map((section, index) => (
                      <SortableSection
                        key={section.type + '-' + section.order}
                        section={section}
                        onToggle={() => toggleSection(index)}
                        onEdit={() => handleEditSection(section)}
                        onDelete={() => deleteSection(index)}
                        onMoveUp={() => moveSection(index, Math.max(0, index - 1))}
                        onMoveDown={() => moveSection(index, Math.min(website.sections.length - 1, index + 1))}
                        isFirst={index === 0}
                        isLast={index === website.sections.length - 1}
                        isSelected={selectedSection?.type === section.type && selectedSection?.order === section.order}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Main Area - Live Preview */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(`/${website?.slug}`, '_blank')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Globe size={16} />
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-100 p-4 overflow-auto">
            <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto min-h-full">
              {/* Live Preview Content */}
              <div className="p-8">
                {website ? (
                  <div className="space-y-8">
                    {website.sections
                      .filter(section => section.isEnabled)
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div key={section.type + '-' + section.order} className="border-b border-gray-200 pb-8 last:border-b-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                          <div className="text-gray-600">
                            {section.type === 'hero' && (
                              <div className="text-center py-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{section.content.headline || 'Your Headline'}</h1>
                                <p className="text-xl text-gray-600 mb-4">{section.content.subtitle || 'Your Subtitle'}</p>
                                <p className="text-lg text-gray-500">{section.content.date ? new Date(section.content.date).toLocaleDateString() : 'Your Date'}</p>
                                <p className="text-gray-600 mt-2">{section.content.venue || 'Your Venue'}</p>
                              </div>
                            )}
                            {section.type === 'story' && (
                              <div className="prose max-w-none">
                                <p>{section.content.story || 'Your story will appear here...'}</p>
                              </div>
                            )}
                            {section.type === 'event-details' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Ceremony</h4>
                                  <p className="text-gray-600">{section.content.ceremonyTime || 'Time TBD'}</p>
                                  <p className="text-gray-600">{section.content.ceremonyLocation || 'Location TBD'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Reception</h4>
                                  <p className="text-gray-600">{section.content.receptionTime || 'Time TBD'}</p>
                                  <p className="text-gray-600">{section.content.receptionLocation || 'Location TBD'}</p>
                                </div>
                              </div>
                            )}
                            {section.type === 'rsvp' && (
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">RSVP</h4>
                                <p className="text-gray-600 mb-4">Please respond by {section.content.deadline || 'TBD'}</p>
                                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium">
                                  RSVP Now
                                </button>
                              </div>
                            )}
                            {section.type === 'gallery' && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                  <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">Photo {i}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {section.type === 'registry' && (
                              <div className="text-center py-8">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Registry</h4>
                                <p className="text-gray-600 mb-4">Your registry information will appear here...</p>
                              </div>
                            )}
                            {section.type === 'contact' && (
                              <div className="text-center py-8">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h4>
                                <p className="text-gray-600">{section.content.email || 'your-email@example.com'}</p>
                                <p className="text-gray-600">{section.content.phone || 'Your Phone'}</p>
                              </div>
                            )}
                            {section.type === 'timeline' && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">Engagement</h4>
                                    <p className="text-gray-600">{section.content.engagementDate || 'Date TBD'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">Wedding Day</h4>
                                    <p className="text-gray-600">{section.content.weddingDate || 'Date TBD'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {section.type === 'bridal-party' && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-gray-500">👰</span>
                                  </div>
                                  <p className="font-medium text-gray-900">Bride</p>
                                </div>
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-gray-500">🤵</span>
                                  </div>
                                  <p className="font-medium text-gray-900">Groom</p>
                                </div>
                              </div>
                            )}
                            {section.type === 'accommodations' && (
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Hotel Information</h4>
                                <p className="text-gray-600">{section.content.hotelInfo || 'Hotel details will appear here...'}</p>
                              </div>
                            )}
                            {section.type === 'travel' && (
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Travel Information</h4>
                                <p className="text-gray-600">{section.content.travelInfo || 'Travel details will appear here...'}</p>
                              </div>
                            )}
                            {section.type === 'faq' && (
                              <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Common Questions</h4>
                                  <p className="text-gray-600">FAQ content will appear here...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Globe size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Your website preview will appear here</p>
                    <p className="text-sm">Add sections from the sidebar to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings (Optional) */}
        {showSettings && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Website Settings</h2>
              
              <div className="space-y-6">
                {/* Basic Settings */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Basic Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">beehitched.com/</span>
                        <input
                          type="text"
                          value={website?.slug || ''}
                          onChange={(e) => setWebsite(prev => prev ? { ...prev, slug: e.target.value } : null)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                          placeholder="your-wedding"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Domain (Optional)
                      </label>
                      <input
                        type="text"
                        value={website?.customDomain || ''}
                        onChange={(e) => setWebsite(prev => prev ? { ...prev, customDomain: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                        placeholder="yourwedding.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Settings */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Theme & Design</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme Style
                      </label>
                      <select
                        value={website?.theme.style || 'classic'}
                        onChange={(e) => setWebsite(prev => prev ? { 
                          ...prev, 
                          theme: { ...prev.theme, style: e.target.value }
                        } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="romantic">Romantic</option>
                        <option value="minimal">Minimal</option>
                        <option value="rustic">Rustic</option>
                        <option value="elegant">Elegant</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={website?.theme.colors.primary || '#E6397E'}
                        onChange={(e) => setWebsite(prev => prev ? { 
                          ...prev, 
                          theme: { 
                            ...prev.theme, 
                            colors: { ...prev.theme.colors, primary: e.target.value }
                          }
                        } : null)}
                        className="w-full h-10 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Publishing */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Publishing</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Website Status</h4>
                      <p className="text-xs text-gray-500">
                        {website?.isPublished ? 'Your website is live and public' : 'Your website is private'}
                      </p>
                    </div>
                    <button
                      onClick={() => setWebsite(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        website?.isPublished
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {website?.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Editor Side Panel */}
        {selectedSection && (
          <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sectionTypes.find(st => st.type === selectedSection.type)?.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Edit {selectedSection.title}</h2>
                  <p className="text-sm text-gray-500">Customize your section content</p>
                </div>
              </div>
              <button
                onClick={handleCloseSectionEditor}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <SectionEditor
                  section={selectedSection}
                  onSave={handleSaveSection}
                  onClose={handleCloseSectionEditor}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 