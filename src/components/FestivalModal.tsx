'use client';

import React, { useEffect, useState } from 'react';
import { Festival } from '@/lib/types';
import { 
  X, Calendar, MapPin, Phone, Globe, Info, Heart, 
  Bus, CreditCard, Accessibility, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FestivalModalProps {
  festival: Festival | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (festival: Festival) => void;
}

export default function FestivalModal({
  festival,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: FestivalModalProps) {
  const [imgSrc, setImgSrc] = useState('');

  // Sync image source with local state when modal opens
  useEffect(() => {
    if (festival) {
      setImgSrc(festival.imageNormal);
      // Disable background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [festival]);

  if (!festival) return null;

  const handleImageError = () => {
    setImgSrc('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200&auto=format&fit=crop');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Background Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-card-border bg-background shadow-2xl z-10 flex flex-col focus:outline-none"
        >
          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button
              onClick={() => onToggleBookmark(festival)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-md active:scale-95 transition-all"
              aria-label="Bookmark"
            >
              <Heart
                size={18}
                className={isBookmarked ? 'fill-accent text-accent' : 'text-white'}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-md active:scale-95 transition-all"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Banner Image */}
          <div className="relative h-64 sm:h-80 w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc || festival.imageNormal}
              alt={festival.title}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/30" />
            
            {/* Visual Title on Image Bottom */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-md">
                  {festival.gugun}
                </span>
                {festival.isFree && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-md">
                    무료 입장
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground drop-shadow-sm">
                {festival.title}
              </h2>
              {festival.tagline && (
                <p className="text-sm font-semibold text-primary mt-1.5 drop-shadow-sm">
                  {festival.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Modal Grid Content */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Info Column (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Introduction */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Info size={18} className="text-primary" />
                  축제 소개
                </h3>
                {festival.descriptionParagraphs.length > 0 ? (
                  <div className="space-y-4 text-foreground/80 leading-relaxed text-sm sm:text-base">
                    {festival.descriptionParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 text-sm">상세 소개 정보가 존재하지 않습니다.</p>
                )}
              </div>

              {/* Accessibility (Barrier-Free) Tags */}
              {festival.accessibility.length > 0 && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                    <Accessibility size={16} />
                    무장애 접근성 및 편의 시설
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {festival.accessibility.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        <CheckCircle2 size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Details Sidebar (Right 1/3) */}
            <div className="space-y-6 lg:border-l lg:border-card-border/50 lg:pl-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-accent" />
                상세 안내
              </h3>

              <div className="space-y-5 text-sm">
                {/* Period */}
                <div className="flex gap-3">
                  <Calendar size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground/55">축제 기간</h4>
                    <p className="text-foreground mt-0.5 font-medium">{festival.period}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex gap-3">
                  <MapPin size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground/55">장소</h4>
                    <p className="text-foreground mt-0.5 font-medium">{festival.mainPlace}</p>
                    <p className="text-foreground/60 text-xs mt-0.5">{festival.address}</p>
                  </div>
                </div>

                {/* Admission Fee */}
                <div className="flex gap-3">
                  <CreditCard size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground/55">이용 요금</h4>
                    <p className="text-foreground mt-0.5 font-medium">{festival.fee || '무료'}</p>
                  </div>
                </div>

                {/* Tel */}
                {festival.tel && (
                  <div className="flex gap-3">
                    <Phone size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground/55">문의 전화</h4>
                      <a
                        href={`tel:${festival.tel}`}
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1 mt-0.5"
                      >
                        {festival.tel}
                      </a>
                    </div>
                  </div>
                )}

                {/* Traffic Info */}
                {festival.traffic && (
                  <div className="flex gap-3">
                    <Bus size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground/55">찾아오시는 길</h4>
                      <p className="text-foreground/80 mt-0.5 text-xs whitespace-pre-line leading-relaxed">
                        {festival.traffic}
                      </p>
                    </div>
                  </div>
                )}

                {/* Homepage URL */}
                {festival.homepage && (
                  <div className="pt-2">
                    <a
                      href={festival.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-white hover:bg-primary-hover font-semibold shadow-md shadow-primary/10 transition-colors"
                    >
                      <Globe size={16} />
                      공식 홈페이지 바로가기
                      <ChevronRight size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
