import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTab } from '../types';

interface FooterProps {
  partner1Name: string;
  partner2Name: string;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  partner1Name,
  partner2Name,
  onSelectTab,
  onOpenSettings
}) => {
  const triggerHearts = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#E88B96', '#C95B65', '#DCAE78', '#FAF0F2']
    });
  };

  return (
    <footer className="border-t border-[#2A4166] bg-[#182740] py-14 px-4 sm:px-6 lg:px-8 mt-auto text-[#94A3B8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <button
            onClick={() => onSelectTab('countdown')}
            className="font-serif text-2xl text-white flex items-center gap-2 cursor-pointer text-left hover:text-[#93C5FD] transition-colors"
          >
            <span>Nenei</span>
            <Heart className="w-4 h-4 text-[#F472B6] fill-[#F472B6]" />
          </button>
          <p className="text-xs text-[#94A3B8] mt-1 font-serif italic">
            Anniversary March 26, 2026 · First Date January 12, 2026
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#CBD5E1] flex-wrap justify-center">
          <button
            onClick={() => onSelectTab('countdown')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('first-date')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Our First Date
          </button>
          <button
            onClick={() => onSelectTab('gallery')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Photo Gallery
          </button>
          <button
            onClick={() => onSelectTab('conditions-goals')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            For You
          </button>
          <button
            onClick={onOpenSettings}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>

        <button
          onClick={triggerHearts}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#FBCFE8] bg-[#203354] border border-[#2D4874] hover:bg-[#28406B] transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
          <span>Love Confetti</span>
        </button>
      </div>
    </footer>
  );
};
