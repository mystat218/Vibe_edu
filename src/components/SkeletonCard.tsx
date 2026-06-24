import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-card-border/50 bg-card-bg/40 backdrop-blur-sm overflow-hidden flex flex-col h-[420px] animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-foreground/10" />

      {/* Content skeleton */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          {/* Badge & District skeleton */}
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-foreground/10 rounded-full" />
            <div className="h-5 w-12 bg-foreground/10 rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="h-6 w-3/4 bg-foreground/15 rounded-lg" />

          {/* Subtitle skeleton */}
          <div className="h-4 w-5/6 bg-foreground/10 rounded-md" />
        </div>

        {/* Footer info skeleton */}
        <div className="pt-4 border-t border-card-border/30 space-y-2">
          <div className="h-4 w-full bg-foreground/10 rounded-md" />
          <div className="h-4 w-2/3 bg-foreground/10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
