import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Heart, Disc3 } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface FloatingMusicBarProps {
  songTitle: string;
  songArtist: string;
  onOpenModal: () => void;
}

export const FloatingMusicBar: React.FC<FloatingMusicBarProps> = ({
  songTitle,
  songArtist,
  onOpenModal
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => setIsPlaying(playing));
    return () => unsub();
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div
        onClick={onOpenModal}
        className="group cursor-pointer flex items-center gap-3 bg-[#192A45]/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#2D4874] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Animated Disc Icon */}
        <div
          className={`w-9 h-9 rounded-full bg-[#15233A] border border-[#2D4874] text-white flex items-center justify-center relative shadow-xs ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
        >
          <Disc3 className="w-5 h-5 text-[#F472B6]" />
          <div className="w-2 h-2 rounded-full bg-white absolute" />
        </div>

        {/* Song Info */}
        <div className="max-w-[130px] sm:max-w-[180px] text-left">
          <div className="text-xs font-semibold text-white truncate">
            {songTitle}
          </div>
          <div className="text-[11px] text-[#94A3B8] truncate">
            {isPlaying ? 'Playing our song...' : songArtist}
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            romanticAudio.toggle();
          }}
          className="w-8 h-8 rounded-full bg-[#203354] hover:bg-[#2D4874] text-white flex items-center justify-center transition-colors border border-[#2D4874]"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
