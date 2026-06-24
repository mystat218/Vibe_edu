'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Festival } from '@/lib/types';
import { Calendar, MapPin, Heart, ArrowRight } from 'lucide-react';

interface MapComponentProps {
  festivals: Festival[];
  activeFestival: Festival | null;
  onSelectFestival: (festival: Festival | null) => void;
  onOpenDetails: (festival: Festival) => void;
  bookmarks: number[];
  onToggleBookmark: (festival: Festival) => void;
}

// Map Controller for handling fly-to transitions
function MapController({ activeCoords }: { activeCoords: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeCoords) {
      map.flyTo(activeCoords, 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [activeCoords, map]);

  return null;
}

// Custom Marker Pin Generator
const createCustomIcon = (isBookmarked: boolean) => {
  const colorClass = isBookmarked ? 'bg-accent' : 'bg-primary';
  const pulseClass = isBookmarked ? 'bg-accent/40' : 'bg-primary/40';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Pulsing effect -->
        <span class="absolute inline-flex h-8 w-8 rounded-full ${pulseClass} animate-ping"></span>
        
        <!-- Teardrop Pin -->
        <div class="relative ${colorClass} text-white p-2 rounded-full border-2 border-white shadow-lg transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function MapComponent({
  festivals,
  activeFestival,
  onSelectFestival,
  onOpenDetails,
  bookmarks,
  onToggleBookmark,
}: MapComponentProps) {
  // Base coordinates for Busan (City Hall Area)
  const defaultPosition: [number, number] = [35.179554, 129.075641];
  
  // Coords for active festival or default position
  const activeCoords: [number, number] | null = activeFestival
    ? [activeFestival.lat, activeFestival.lng]
    : null;

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-3xl overflow-hidden border border-card-border/50 shadow-md">
      <MapContainer
        center={defaultPosition}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* OpenStreetMap Tile Layer (Clean and free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Controller for moving view */}
        <MapController activeCoords={activeCoords} />

        {/* Festival Pins */}
        {festivals.map((fest) => {
          const isSaved = bookmarks.includes(fest.id);
          const icon = createCustomIcon(isSaved);

          return (
            <Marker
              key={fest.id}
              position={[fest.lat, fest.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectFestival(fest),
              }}
            >
              {/* Marker Popup */}
              <Popup>
                <div className="p-1 max-w-[240px] space-y-2 select-none">
                  {/* Miniature Image */}
                  <div className="relative h-24 w-full rounded-lg overflow-hidden bg-muted">
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
                    
                    {/* Tiny Floating district */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary/95 text-white text-[10px] font-bold">
                      {fest.gugun}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-1 m-0">
                      {fest.title}
                    </h4>
                    <p className="text-[11px] text-foreground/70 flex items-center gap-1 my-0.5">
                      <MapPin size={11} className="text-accent shrink-0" />
                      <span className="line-clamp-1">{fest.place}</span>
                    </p>
                    <p className="text-[10px] text-foreground/60 flex items-center gap-1 my-0.5">
                      <Calendar size={11} className="text-primary shrink-0" />
                      <span className="line-clamp-1">{fest.period}</span>
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-1.5 pt-1 border-t border-card-border/30">
                    <button
                      onClick={() => onToggleBookmark(fest)}
                      className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground border border-card-border/30 flex items-center justify-center shrink-0 active:scale-95 transition-all"
                      title="Bookmark toggle"
                    >
                      <Heart
                        size={12}
                        className={isSaved ? 'fill-accent text-accent' : 'text-foreground/50'}
                      />
                    </button>
                    <button
                      onClick={() => onOpenDetails(fest)}
                      className="flex-grow inline-flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      상세 보기
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
