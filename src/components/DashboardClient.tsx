'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Festival } from '@/lib/types';
import FestivalCard from './FestivalCard';
import FestivalModal from './FestivalModal';
import { Search, Calendar, MapPin, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardClientProps {
  initialFestivals: Festival[];
}

export default function DashboardClient({ initialFestivals }: DashboardClientProps) {
  // Client States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGugun, setSelectedGugun] = useState('전체');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedFee, setSelectedFee] = useState<'all' | 'free' | 'paid'>('all');
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Load Bookmarks from localStorage on Mount
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

  // Sync Bookmarks to localStorage
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

  // Extract all unique districts (GUGUN) from data
  const guguns = useMemo(() => {
    const set = new Set(initialFestivals.map(f => f.gugun));
    return ['전체', ...Array.from(set).sort()];
  }, [initialFestivals]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGugun('전체');
    setSelectedMonth(null);
    setSelectedFee('all');
  };

  // Filtered Festivals
  const filteredFestivals = useMemo(() => {
    return initialFestivals.filter((fest) => {
      // 1. Text Search
      const matchesSearch = 
        fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fest.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Gugun (District) Filter
      const matchesGugun = selectedGugun === '전체' || fest.gugun === selectedGugun;

      // 3. Month Filter
      const matchesMonth = selectedMonth === null || fest.months.includes(selectedMonth);

      // 4. Admission Fee Filter
      const matchesFee = 
        selectedFee === 'all' || 
        (selectedFee === 'free' && fest.isFree) || 
        (selectedFee === 'paid' && !fest.isFree);

      return matchesSearch && matchesGugun && matchesMonth && matchesFee;
    });
  }, [initialFestivals, searchTerm, selectedGugun, selectedMonth, selectedFee]);

  return (
    <div className="flex-grow pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Dynamic Abstract Wave Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-950 z-0" />
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

        <div className="relative max-w-4xl mx-auto z-10 space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30"
          >
            🎡 부산의 다채로운 축제 축제 정보
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            오색찬란한 <span className="bg-gradient-to-r from-blue-400 via-primary to-accent bg-clip-text text-transparent">부산의 축제</span>속으로!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto"
          >
            부산 전역에서 사계절 내내 펼쳐지는 다양한 문화, 역사, 해양 축제 정보를 스마트하게 찾아보세요.
          </motion.p>

          {/* Integrated Search Bar inside Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto pt-4"
          >
            <div className="relative flex items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
              <Search className="text-slate-400 ml-3.5 shrink-0" size={20} />
              <input
                type="text"
                placeholder="축제 이름, 장소, 혹은 키워드를 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder-slate-400 py-3 px-3 text-sm sm:text-base focus:outline-none focus:ring-0"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  지우기
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar: Detailed Filters panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-3xl p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-card-border pb-4">
                <span className="font-extrabold text-foreground flex items-center gap-2">
                  <Filter size={18} className="text-primary" />
                  상세 필터
                </span>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-primary transition-colors focus:outline-none"
                >
                  <RefreshCw size={12} />
                  초기화
                </button>
              </div>

              {/* District Filter (Gugun) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  지역구 (구/군)
                </label>
                <select
                  value={selectedGugun}
                  onChange={(e) => setSelectedGugun(e.target.value)}
                  className="w-full rounded-2xl border border-card-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all cursor-pointer"
                >
                  {guguns.map((gugun) => (
                    <option key={gugun} value={gugun}>
                      {gugun}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter (Fee) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-primary" />
                  요금 종류
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-foreground/5 rounded-xl border border-card-border/50">
                  {(['all', 'free', 'paid'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFee(type)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        selectedFee === type
                          ? 'bg-background text-primary shadow-sm'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {type === 'all' ? '전체' : type === 'free' ? '무료' : '유료'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/60 flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  개최 일정 (월별)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(selectedMonth === m ? null : m)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedMonth === m
                          ? 'bg-primary border-primary text-white shadow-md shadow-primary/15'
                          : 'border-card-border bg-background hover:bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      {m}월
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Festival Grid Listing */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground/70">
                검색 결과:{' '}
                <span className="font-bold text-foreground">
                  {filteredFestivals.length}
                </span>
                개 축제
              </p>
            </div>

            {/* List Grid */}
            {filteredFestivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFestivals.map((fest) => (
                  <FestivalCard
                    key={fest.id}
                    festival={fest}
                    onOpenDetails={setActiveFestival}
                    isBookmarked={bookmarks.includes(fest.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              // Empty State Fallback
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto border border-card-border/50"
              >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 text-accent mb-2">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">검색 결과가 없습니다</h3>
                <p className="text-foreground/60 text-sm max-w-md mx-auto">
                  필터 조건이나 검색어를 변경해보세요. 또는 필터를 초기화하여 전체 축제 리스트를 확인할 수 있습니다.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-white hover:bg-primary-hover font-semibold shadow-md shadow-primary/10 transition-colors"
                >
                  필터 초기화
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* Detail view Modal */}
      <FestivalModal
        festival={activeFestival}
        onClose={() => setActiveFestival(null)}
        isBookmarked={activeFestival ? bookmarks.includes(activeFestival.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
