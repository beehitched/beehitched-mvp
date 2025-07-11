'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Upload, Edit3, Trash2, ExternalLink, Save, X, Image as ImageIcon, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

interface MoodboardImage {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  notes: string;
  sourceUrl: string;
  sourceName: string;
  position: { x: number; y: number };
  order: number;
}

interface Moodboard {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: MoodboardImage[];
  isPublic: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Florals',
  'Tablescape', 
  'Venue Inspo',
  'Dress Vibes',
  'Decor',
  'Food',
  'Other'
];

// Floating Hearts Component
const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Create initial hearts with different colors and sizes
    const heartColors = [
      'text-pink-300 fill-pink-200',
      'text-pink-400 fill-pink-300', 
      'text-rose-300 fill-rose-200',
      'text-red-300 fill-red-200',
      'text-purple-300 fill-purple-200',
      'text-pink-500 fill-pink-400',
      'text-rose-400 fill-rose-300'
    ];
    
    const initialHearts = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      y: 100 + (Math.random() * 20), // Start below screen (100-120%)
      size: Math.random() * 20 + 8, // 8-28px
      delay: Math.random() * 8, // Staggered start times
      duration: Math.random() * 8 + 12, // 12-20s to reach top
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <Heart
            size={heart.size}
            className={`${heart.color} animate-heart-beat`}
            style={{
              animationDelay: `${heart.delay + 1}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Sortable Image Component
function SortableImage({ image, onEdit, onDelete }: { 
  image: MoodboardImage; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      {...attributes}
      {...listeners}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/moodboards/${image.filename}`}
        alt={image.originalName}
        className="w-full aspect-square object-cover rounded-lg cursor-move"
        onClick={onEdit}
        onError={(e) => {
          console.error('Failed to load image:', image.filename);
          console.error('Image URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/uploads/moodboards/${image.filename}`);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Successfully loaded image:', image.filename);
        }}
      />
      
      {/* Drag Handle */}
      <div
        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-full cursor-move transition-colors"
        title="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
          <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
        </svg>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Edit3 size={16} className="text-gray-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>
      {image.notes && (
        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          {image.notes}
        </div>
      )}
    </div>
  );
}

export default function MoodboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MoodboardImage | null>(null);
  const [selectedMoodboard, setSelectedMoodboard] = useState<Moodboard | null>(null);
  
  // Form states
  const [newMoodboard, setNewMoodboard] = useState({
    name: '',
    description: '',
    category: 'Other'
  });
  
  const [uploadData, setUploadData] = useState({
    notes: '',
    sourceUrl: '',
    sourceName: ''
  });
  
  const [imageEditData, setImageEditData] = useState({
    notes: '',
    sourceUrl: '',
    sourceName: ''
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch moodboards
  const fetchMoodboards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch moodboards');
      
      const data = await response.json();
      setMoodboards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch moodboards');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMoodboards();
    }
  }, [fetchMoodboards, token]);

  // Create new moodboard
  const handleCreateMoodboard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMoodboard)
      });
      
      if (!response.ok) throw new Error('Failed to create moodboard');
      
      const createdMoodboard = await response.json();
      setMoodboards(prev => [createdMoodboard, ...prev]);
      setShowCreateModal(false);
      setNewMoodboard({ name: '', description: '', category: 'Other' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create moodboard');
    }
  };

  // Upload images
  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMoodboard) return;
    
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    const files = fileInput?.files;
    
    if (!files || files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      formData.append('notes', uploadData.notes);
      formData.append('sourceUrl', uploadData.sourceUrl);
      formData.append('sourceName', uploadData.sourceName);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards/${selectedMoodboard._id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload images');
      
      const updatedMoodboard = await response.json();
      setMoodboards(prev => prev.map(mb => 
        mb._id === selectedMoodboard._id ? updatedMoodboard : mb
      ));
      
      setShowUploadModal(false);
      setUploadData({ notes: '', sourceUrl: '', sourceName: '' });
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    }
  };

  // Update image details
  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMoodboard || !selectedImage) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards/${selectedMoodboard._id}/images/${selectedImage._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(imageEditData)
      });
      
      if (!response.ok) throw new Error('Failed to update image');
      
      const updatedMoodboard = await response.json();
      setMoodboards(prev => prev.map(mb => 
        mb._id === selectedMoodboard._id ? updatedMoodboard : mb
      ));
      
      setShowImageModal(false);
      setSelectedImage(null);
      setImageEditData({ notes: '', sourceUrl: '', sourceName: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
    }
  };

  // Delete image
  const handleDeleteImage = async (moodboardId: string, imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards/${moodboardId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      const updatedMoodboard = await response.json();
      setMoodboards(prev => prev.map(mb => 
        mb._id === moodboardId ? updatedMoodboard : mb
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  // Delete moodboard
  const handleDeleteMoodboard = async (moodboardId: string) => {
    if (!confirm('Are you sure you want to delete this moodboard? This will also delete all images.')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards/${moodboardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete moodboard');
      
      setMoodboards(prev => prev.filter(mb => mb._id !== moodboardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete moodboard');
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('Drag end event:', event);
    
    const { active, over } = event;
    
    if (!over || active.id === over.id || !selectedMoodboard) {
      return;
    }
    
    const oldIndex = selectedMoodboard.images.findIndex(img => img._id === active.id);
    const newIndex = selectedMoodboard.images.findIndex(img => img._id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    
    const newImages = arrayMove(selectedMoodboard.images, oldIndex, newIndex);
    
    console.log('Reordered images:', newImages.map((img, index) => ({ id: img._id, order: index })));
    
    // Update order numbers
    const imageOrders = newImages.map((item, index) => ({
      imageId: item._id,
      order: index
    }));
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/moodboards/${selectedMoodboard._id}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageOrders })
      });
      
      if (!response.ok) throw new Error('Failed to reorder images');
      
      const updatedMoodboard = await response.json();
      setMoodboards(prev => prev.map(mb => 
        mb._id === selectedMoodboard._id ? updatedMoodboard : mb
      ));
      console.log('Images reordered successfully');
    } catch (err) {
      console.error('Reorder error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder images');
    }
  };

  // Filter moodboards by category
  const filteredMoodboards = selectedCategory === 'all' 
    ? moodboards 
    : moodboards.filter(mb => mb.category === selectedCategory);

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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center relative">
        <FloatingHearts />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Moodboard</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your moodboards.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Return Home
            </Link>
            <Link 
              href="/login"
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center relative">
        <FloatingHearts />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your inspiration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative">
      <FloatingHearts />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Go Back Button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Wedding Moodboard</h1>
          <p className="text-gray-600">Collect and organize your wedding inspiration</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-pink-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Create New Moodboard Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Create New Moodboard
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Moodboards Grid */}
        {filteredMoodboards.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No moodboards yet</h3>
            <p className="text-gray-500 mb-4">Create your first moodboard to start collecting inspiration</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create Your First Moodboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMoodboards.map(moodboard => (
              <div
                key={moodboard._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedMoodboard(moodboard);
                  setShowUploadModal(true);
                }}
              >
                {/* Moodboard Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{moodboard.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMoodboard(moodboard._id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{moodboard.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                      {moodboard.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moodboard.images.length} images
                    </span>
                  </div>
                </div>

                {/* Image Preview Grid */}
                <div className="p-4">
                  {moodboard.images.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Upload size={32} className="mx-auto mb-2" />
                      <p className="text-sm">No images yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {moodboard.images.slice(0, 4).map((image, index) => (
                        <div key={image._id} className="aspect-square bg-gray-100 rounded overflow-hidden">
                          <img
                            src={`/api/uploads/moodboards/${image.filename}`}
                            alt={image.originalName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {moodboard.images.length > 4 && (
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                          +{moodboard.images.length - 4} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Moodboard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Moodboard</h2>
            <form onSubmit={handleCreateMoodboard}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newMoodboard.name}
                  onChange={(e) => setNewMoodboard(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMoodboard.description}
                  onChange={(e) => setNewMoodboard(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newMoodboard.category}
                  onChange={(e) => setNewMoodboard(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Images Modal */}
      {showUploadModal && selectedMoodboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedMoodboard.name}</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-1">{selectedMoodboard.description}</p>
            </div>

            <div className="p-6">
              {/* Upload Form */}
              <form onSubmit={handleImageUpload} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (JPG, PNG, GIF, WebP - Max 5MB each)
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={uploadData.notes}
                      onChange={(e) => setUploadData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                      placeholder="Add notes about these images..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source URL
                    </label>
                    <input
                      type="url"
                      value={uploadData.sourceUrl}
                      onChange={(e) => setUploadData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="https://pinterest.com/..."
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={uploadData.sourceName}
                    onChange={(e) => setUploadData(prev => ({ ...prev, sourceName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Pinterest, Etsy, etc."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Upload Images
                </button>
              </form>

              {/* Images Grid */}
              {selectedMoodboard.images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Images ({selectedMoodboard.images.length})</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                      </svg>
                      Drag images to reorder
                    </div>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedMoodboard.images.map(img => img._id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedMoodboard.images.map((image) => (
                          <SortableImage
                            key={image._id}
                            image={image}
                            onEdit={() => {
                              setSelectedImage(image);
                              setImageEditData({
                                notes: image.notes,
                                sourceUrl: image.sourceUrl,
                                sourceName: image.sourceName
                              });
                              setShowImageModal(true);
                            }}
                            onDelete={() => handleDeleteImage(selectedMoodboard._id, image._id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Image</h2>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={`/api/uploads/moodboards/${selectedImage.filename}`}
                  alt={selectedImage.originalName}
                  className="w-full rounded-lg"
                />
              </div>
              
              <form onSubmit={handleUpdateImage}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={imageEditData.notes}
                    onChange={(e) => setImageEditData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Add notes about this image..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source URL
                  </label>
                  <input
                    type="url"
                    value={imageEditData.sourceUrl}
                    onChange={(e) => setImageEditData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://pinterest.com/..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={imageEditData.sourceName}
                    onChange={(e) => setImageEditData(prev => ({ ...prev, sourceName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Pinterest, Etsy, etc."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 