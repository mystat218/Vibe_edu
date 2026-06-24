'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Festival } from '@/lib/types';
import FestivalModal from './FestivalModal';
import { Search, MapPin, Calendar, Heart, Compass } from 'lucide-react';

// Dynamically import Leaflet map with SSR disabled to prevent Node window reference errors
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-foreground/5 gap-3 border border-card-border/50 rounded-3xl">
      <Compass className="animate-spin text-primary" size={32} />
      <span className="text-sm font-semibold text-foreground/60">부산 지도를 불러오는 중입니다...</span>
    </div>
  ),
});

interface MapClientProps {
  initialFestivals: Festival[];
}

export default function MapClient({ initialFestivals }: MapClientProps) {
  // Page States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGugun, setSelectedGugun] = useState('전체');
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [detailedFestival, setDetailedFestival] = useState<Festival | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Load Bookmarks on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('busan-festival-bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse bookmarks:', e);
    }
  }, []);

  // Sync Bookmarks
  const toggleBookmark = (festival: Festival) => {
    let updated: number[];
    if (bookmarks.includes(festival.id)) {
      updated = bookmarks.filter(id => id !== festival.id);
    } else {
      updated = [...bookmarks, festival.id];
    }
    setBookmarks(updated);
    localStorage.setItem('busan-festival-bookmarks', JSON.stringify(updated));
  };

  // Dynamic District Lists
  const guguns = useMemo(() => {
    const set = new Set(initialFestivals.map(f => f.gugun));
    return ['전체', ...Array.from(set).sort()];
  }, [initialFestivals]);

  // Filtered List
  const filteredFestivals = useMemo(() => {
    return initialFestivals.filter((fest) => {
      const matchesSearch = 
        fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGugun = selectedGugun === '전체' || fest.gugun === selectedGugun;

      return matchesSearch && matchesGugun;
    });
  }, [initialFestivals, searchTerm, selectedGugun]);

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] relative overflow-hidden bg-background">
      
      {/* Left Pane: Search & Scrollable Sidebar (1/3 Width on md+) */}
      <div className="w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-card-border/50 bg-card-bg/25 backdrop-blur-md flex flex-col h-[40vh] md:h-full z-20">
        {/* Search Header */}
        <div className="p-4 border-b border-card-border/50 space-y-3 bg-background/50">
          <h2 className="font-extrabold text-lg text-foreground flex items-center gap-2">
            <Compass size={18} className="text-primary animate-pulse" />
            지도로 찾는 축제
          </h2>
          
          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative flex items-center rounded-xl border border-card-border bg-background p-1.5 focus-within:border-primary/50 transition-all duration-300">
              <Search className="text-foreground/45 ml-2.5 shrink-0" size={16} />
              <input
                type="text"
                placeholder="축제명 또는 검색어..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 text-foreground placeholder-foreground/40 py-1.5 px-2 text-xs focus:outline-none focus:ring-0"
              />
            </div>

            {/* Gugun Select */}
            <select
              value={selectedGugun}
              onChange={(e) => setSelectedGugun(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all cursor-pointer"
            >
              {guguns.map((gugun) => (
                <option key={gugun} value={gugun}>
                  {gugun}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {filteredFestivals.length > 0 ? (
            filteredFestivals.map((fest) => {
              const isSelected = activeFestival?.id === fest.id;
              const isSaved = bookmarks.includes(fest.id);

              return (
                <div
                  key={fest.id}
                  onClick={() => setActiveFestival(fest)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex gap-3 ${
                    isSelected
                      ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/5'
                      : 'border-card-border/50 hover:border-card-border hover:bg-foreground/5 bg-card-bg/10'
                  }`}
                >
                  {/* Miniature Image */}
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fest.imageThumb}
                      alt={fest.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 
                          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Body Text */}
                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                          {fest.gugun}
                        </span>
                        {isSaved && <Heart size={10} className="fill-accent text-accent" />}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-foreground mt-1 line-clamp-1">
                        {fest.title}
                      </h3>
                      <p className="text-[10px] text-foreground/60 flex items-center gap-0.5 mt-0.5 line-clamp-1">
                        <MapPin size={10} className="shrink-0 text-accent/80" />
                        {fest.place}
                      </p>
                      <p className="text-[10px] text-foreground/60 flex items-center gap-0.5 mt-0.5 line-clamp-1">
                        <Calendar size={10} className="shrink-0 text-primary/80" />
                        {fest.period}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-foreground/50 text-xs">
              조건에 맞는 축제가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Map Area (2/3 Width on md+) */}
      <div className="flex-grow h-[60vh] md:h-full p-4 relative z-10">
        <MapComponent
          festivals={filteredFestivals}
          activeFestival={activeFestival}
          onSelectFestival={setActiveFestival}
          onOpenDetails={setDetailedFestival}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
        />
      </div>

      {/* Detail view Modal */}
      <FestivalModal
        festival={detailedFestival}
        onClose={() => setDetailedFestival(null)}
        isBookmarked={detailedFestival ? bookmarks.includes(detailedFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
