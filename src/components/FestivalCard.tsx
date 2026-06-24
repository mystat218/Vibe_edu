'use client';

import React, { useState } from 'react';
import { Festival } from '@/lib/types';
import { Calendar, MapPin, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FestivalCardProps {
  festival: Festival;
  onOpenDetails: (festival: Festival) => void;
  isBookmarked: boolean;
  onToggleBookmark: (festival: Festival) => void;
}

export default function FestivalCard({
  festival,
  onOpenDetails,
  isBookmarked,
  onToggleBookmark,
}: FestivalCardProps) {
  const [imgSrc, setImgSrc] = useState(festival.imageThumb);

  // Fallback image using a high-quality Busan skyline or default illustration
  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600&auto=format&fit=crop');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group rounded-3xl border border-card-border/50 bg-card-bg/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-[450px] overflow-hidden relative"
    >
      {/* Thumbnail and Tags */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={festival.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Backdrop overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

        {/* Floating Category Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-white backdrop-blur-sm shadow-md">
            {festival.gugun}
          </span>
          {festival.months.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/90 text-white backdrop-blur-sm shadow-md">
              {festival.months.map(m => `${m}월`).join(', ')}
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(festival);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm border border-white/20 shadow-md hover:scale-110 active:scale-95 transition-all z-10"
          aria-label="Bookmark festival"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isBookmarked ? 'fill-accent text-accent scale-110' : 'text-white'
            }`}
          />
        </button>

        {/* Floating Fee Badge */}
        <span className={`absolute bottom-3 right-4 px-2.5 py-0.5 rounded-md text-xs font-bold ${
          festival.isFree 
            ? 'bg-emerald-500/90 text-white' 
            : 'bg-amber-500/90 text-white'
        } backdrop-blur-sm shadow-sm`}>
          {festival.isFree ? '무료 입장' : '유료'}
        </span>
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Catchphrase / Tagline */}
          {festival.tagline && (
            <p className="text-xs font-semibold text-primary tracking-wide line-clamp-1">
              {festival.tagline}
            </p>
          )}

          {/* Festival Title */}
          <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {festival.title}
          </h3>

          {/* Subtitle / Venue */}
          <p className="text-sm text-foreground/60 line-clamp-2 min-h-[40px]">
            {festival.subtitle || festival.place}
          </p>
        </div>

        {/* Date and Address Metadata */}
        <div className="pt-4 border-t border-card-border/30 space-y-2 text-xs text-foreground/75">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary/70 shrink-0" />
            <span className="line-clamp-1">{festival.period}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-accent/70 shrink-0" />
            <span className="line-clamp-1">{festival.mainPlace}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onOpenDetails(festival)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-foreground/5 hover:bg-primary hover:text-white text-sm font-semibold transition-all duration-300 group/btn"
        >
          상세 정보 보기
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
