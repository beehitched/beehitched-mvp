'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Users, Gift, Camera, Phone, Mail, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  sections: Array<{
    type: string;
    title: string;
    content: any;
    isEnabled: boolean;
    order: number;
    settings?: any;
  }>;
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

export default function WeddingWebsitePage({ params }: { params: { weddingSlug: string } }) {
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedding-website/public/${params.weddingSlug}`);
        
        if (!response.ok) {
          throw new Error('Wedding website not found');
        }
        
        const data = await response.json();
        setWebsite(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wedding website');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [params.weddingSlug]);

  // Calculate countdown
  const getCountdown = () => {
    if (!website?.sections) return null;
    
    const eventSection = website.sections.find(s => s.type === 'event-details');
    if (!eventSection?.content?.ceremony?.date) return null;
    
    const weddingDate = new Date(eventSection.content.ceremony.date);
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const countdown = getCountdown();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wedding website...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Wedding Website Not Found</h1>
          <p className="text-gray-600">This wedding website doesn't exist or is not published.</p>
        </div>
      </div>
    );
  }

  // Apply theme styles
  const themeStyles = {
    '--primary-color': website.theme.colors.primary,
    '--secondary-color': website.theme.colors.secondary,
    '--accent-color': website.theme.colors.accent,
    '--text-color': website.theme.colors.text,
    '--background-color': website.theme.colors.background,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={themeStyles}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="font-serif font-semibold text-lg">BeeHitched</span>
            </div>
            
            {website.settings.enableSharing && (
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 size={16} />
                Share
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {website.sections
          .filter(section => section.isEnabled)
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={section.type + '-' + section.order} className="py-16">
              {renderSection(section, website, countdown)}
            </div>
          ))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-serif font-semibold">BeeHitched</span>
          </div>
          <p className="text-gray-400 text-sm">
            Made with love using BeeHitched
          </p>
        </div>
      </footer>
    </div>
  );
}

// Section renderer
function renderSection(section: any, website: WeddingWebsite, countdown: any) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
              {section.content.headline || 'Welcome to Our Wedding'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {section.content.subtitle || 'We\'re getting married!'}
            </p>
            
            {section.content.date && (
              <div className="flex items-center justify-center gap-2 text-lg text-gray-700 mb-8">
                <Calendar size={20} />
                <span>{new Date(section.content.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            )}
            
            {section.content.venue && (
              <div className="flex items-center justify-center gap-2 text-lg text-gray-700 mb-8">
                <MapPin size={20} />
                <span>{section.content.venue}</span>
              </div>
            )}
            
            {countdown && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                  Counting Down to Our Big Day
                </h3>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-500">{countdown.days}</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-500">{countdown.hours}</div>
                    <div className="text-sm text-gray-600">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-500">{countdown.minutes}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'story':
      return (
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-xl leading-relaxed">
              {section.content.story || 'Our love story is being written...'}
            </p>
          </div>
        </div>
      );

    case 'event-details':
      return (
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony */}
            {section.content.ceremony && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Heart size={24} className="text-pink-500" />
                  Ceremony
                </h3>
                
                {section.content.ceremony.time && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Clock size={16} />
                    <span>{section.content.ceremony.time}</span>
                  </div>
                )}
                
                {section.content.ceremony.location && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <MapPin size={16} />
                    <span>{section.content.ceremony.location}</span>
                  </div>
                )}
                
                {section.content.ceremony.address && (
                  <p className="text-gray-600 mb-4">{section.content.ceremony.address}</p>
                )}
                
                {section.content.ceremony.description && (
                  <p className="text-gray-700">{section.content.ceremony.description}</p>
                )}
              </div>
            )}
            
            {/* Reception */}
            {section.content.reception && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <Gift size={24} className="text-pink-500" />
                  Reception
                </h3>
                
                {section.content.reception.time && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Clock size={16} />
                    <span>{section.content.reception.time}</span>
                  </div>
                )}
                
                {section.content.reception.location && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <MapPin size={16} />
                    <span>{section.content.reception.location}</span>
                  </div>
                )}
                
                {section.content.reception.address && (
                  <p className="text-gray-600 mb-4">{section.content.reception.address}</p>
                )}
                
                {section.content.reception.description && (
                  <p className="text-gray-700">{section.content.reception.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      );

    case 'rsvp':
      return (
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 text-center mb-8">
              {section.content.message || 'Please RSVP by [date]'}
            </p>
            
            <div className="text-center">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                RSVP Now
              </button>
            </div>
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          
          {section.content.photos && section.content.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.content.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Wedding photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Camera size={64} className="mx-auto mb-4 opacity-50" />
              <p>Photos will be shared here</p>
            </div>
          )}
        </div>
      );

    case 'registry':
      return (
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-lg text-gray-700 mb-6">
              {section.content.message || 'Your presence is our present, but if you\'d like to give a gift...'}
            </p>
            
            {section.content.links && section.content.links.length > 0 ? (
              <div className="space-y-4">
                {section.content.links.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {link.name || 'Registry Link'}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Registry information coming soon</p>
            )}
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <Phone size={32} className="mx-auto text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">We'd love to hear from you</p>
              </div>
              
              <div className="text-center">
                <Mail size={32} className="mx-auto text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">Send us a message</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            {section.title}
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-gray-500 text-center">Content coming soon...</p>
          </div>
        </div>
      );
  }
} 