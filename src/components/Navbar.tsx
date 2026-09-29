import React, { useState, useEffect } from 'react';
import { Music, Settings, Heart, Volume2, Sparkles, Disc3 } from 'lucide-react';
import { romanticAudio } from '../utils/audio';
import { ActiveTab } from '../types';

interface NavbarProps {
  partner1Name: string;
  partner2Name: string;
  songTitle: string;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenMusicModal: () => void;
  onOpenSettingsModal: () => void;
  onCelebrate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  partner1Name,
  partner2Name,
  songTitle,
  activeTab,
  onSelectTab,
  onOpenMusicModal,
  onOpenSettingsModal,
  onCelebrate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.toggle();
  };

  const navItems: { id: ActiveTab; label: string; highlight?: boolean }[] = [
    { id: 'countdown', label: 'Home' },
    { id: 'first-date', label: 'Our First Date' },
    { id: 'gallery', label: 'Photo Gallery' },
    { id: 'conditions-goals', label: 'For You' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#203354]/95 backdrop-blur-md border-b border-[#2C456D] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('countdown')}
          className="font-serif text-2xl tracking-tight text-white hover:text-[#93C5FD] transition-colors whitespace-nowrap group flex items-center gap-2 cursor-pointer text-left"
        >
          <span>Nenei</span>
          <Heart className="w-4 h-4 text-[#F472B6] fill-[#F472B6] opacity-90 group-hover:scale-125 transition-transform" />
        </button>

        {/* Zone 2: Navigation tabs that switch views (No single page scroll) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#CBD5E1] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] inline-block ml-1 mb-1" />
                )}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F472B6] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Song Play Toggle */}
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause Reality Club - Close to You' : 'Play Reality Club - Close to You'}
            className={`group flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-full transition-all duration-200 border cursor-pointer ${
              isPlaying
                ? 'bg-[#2D4A77] text-white border-[#4A6FAD] shadow-xs animate-pulse'
                : 'bg-[#1A2C49] text-[#E2E8F0] border-[#2C456D] hover:bg-[#253D66] hover:border-[#3D5E94]'
            }`}
          >
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${isPlaying ? 'bg-[#F472B6] text-white' : 'bg-[#253D66] text-[#CBD5E1]'}`}>
              {isPlaying ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <Music className="w-3 h-3" />
              )}
            </span>
            <span className="hidden sm:inline-block max-w-[130px] truncate font-medium">
              {isPlaying ? 'Playing Song' : 'Play Song'}
            </span>
          </button>

          {/* Open Vinyl Turntable Player Modal */}
          <button
            onClick={onOpenMusicModal}
            title="Open turntable player & lyrics"
            className="p-2 text-[#CBD5E1] hover:text-white hover:bg-[#253D66] rounded-full transition-colors cursor-pointer"
          >
            <Disc3 className="w-4 h-4 text-[#F472B6]" />
          </button>

          {/* Celebrate Confetti */}
          <button
            onClick={onCelebrate}
            title="Sprinkle love confetti"
            className="p-2 text-[#F472B6] hover:bg-[#253D66] rounded-full transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettingsModal}
            title="Settings & customize"
            className="p-2 text-[#CBD5E1] hover:text-white hover:bg-[#253D66] rounded-full transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 gap-2 border-t border-[#2C456D] bg-[#203354] no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#F472B6] text-white'
                  : 'bg-[#1A2C49] text-[#CBD5E1] border border-[#2C456D]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
