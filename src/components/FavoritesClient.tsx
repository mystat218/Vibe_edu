'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Festival } from '@/lib/types';
import FestivalCard from './FestivalCard';
import FestivalModal from './FestivalModal';
import { Heart, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FavoritesClientProps {
  initialFestivals: Festival[];
}

export default function FavoritesClient({ initialFestivals }: FavoritesClientProps) {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);

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

  // Sync / Toggle Bookmark
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

  // Filter festivals based on bookmarked IDs and search term
  const bookmarkedFestivals = useMemo(() => {
    return initialFestivals.filter((fest) => {
      const isSaved = bookmarks.includes(fest.id);
      const matchesSearch = 
        fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.gugun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.description.toLowerCase().includes(searchTerm.toLowerCase());

      return isSaved && matchesSearch;
    });
  }, [initialFestivals, bookmarks, searchTerm]);

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Title Header */}
      <div className="space-y-4 mb-10 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/20">
          <Heart size={12} className="fill-accent text-accent animate-pulse" />
          내 보관함
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          내가 찜한 부산 축제
        </h1>
        <p className="text-foreground/60 text-sm sm:text-base max-w-xl">
          관심 있는 축제들을 보관하고 손쉽게 확인하세요. 북마크 데이터는 브라우저 로컬 저장소에 안전하게 유지됩니다.
        </p>
      </div>

      {/* Conditional Rendering */}
      {bookmarks.length > 0 ? (
        <div className="space-y-8">
          {/* Internal Search Bar for Bookmarks */}
          <div className="max-w-md">
            <div className="relative flex items-center rounded-2xl border border-card-border bg-card-bg/20 backdrop-blur-sm p-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
              <Search className="text-foreground/45 ml-3 shrink-0" size={18} />
              <input
                type="text"
                placeholder="북마크 목록 내 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 text-foreground placeholder-foreground/40 py-2 px-3 text-sm focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Bookmarks Grid */}
          {bookmarkedFestivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedFestivals.map((fest) => (
                <FestivalCard
                  key={fest.id}
                  festival={fest}
                  onOpenDetails={setActiveFestival}
                  isBookmarked={true}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          ) : (
            // Search result inside bookmarks is empty
            <div className="text-center py-16 glass rounded-3xl max-w-md mx-auto">
              <Search className="mx-auto text-foreground/30 mb-3" size={28} />
              <p className="text-sm font-semibold text-foreground/80">검색 조건에 맞는 북마크가 없습니다</p>
              <p className="text-xs text-foreground/60 mt-1">검색어를 지우거나 다르게 변경해보세요.</p>
            </div>
          )}
        </div>
      ) : (
        // Entirely Empty Bookmark State
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-16 text-center space-y-5 max-w-xl mx-auto border border-card-border/50 mt-12"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/15 text-accent mb-2">
            <Heart size={32} className="text-accent/80" />
          </div>
          <h3 className="text-xl font-bold text-foreground">북마크한 축제가 없습니다</h3>
          <p className="text-foreground/60 text-sm max-w-md mx-auto">
            축제 둘러보기에서 마음에 드는 축제 카드의 하트 아이콘을 눌러 나만의 관심 축제 목록을 만들어보세요!
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary-hover font-semibold shadow-md shadow-primary/10 transition-colors"
            >
              다양한 축제 찾아보기
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Detail Modal */}
      <FestivalModal
        festival={activeFestival}
        onClose={() => setActiveFestival(null)}
        isBookmarked={activeFestival ? bookmarks.includes(activeFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
