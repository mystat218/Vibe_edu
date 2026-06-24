import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-card-border/50 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex items-center gap-2">
            <div className="bg-foreground/5 p-1.5 rounded-lg">
              <Sparkles size={16} className="text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground/80">
              부산축제허브 (Busan Festival Hub)
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-foreground/60">
            <a
              href="https://www.data.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 hover:text-primary transition-colors"
            >
              공공데이터포털
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://www.visitbusan.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 hover:text-primary transition-colors"
            >
              비지트부산
              <ArrowUpRight size={12} />
            </a>
            <span className="cursor-default">
              © {new Date().getFullYear()} 부산광역시 축제 OpenAPI 연동
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
