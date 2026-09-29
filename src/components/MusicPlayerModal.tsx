import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, X, Youtube } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  songArtist: string;
  audioUrl?: string;
  partner1Name?: string;
  partner2Name?: string;
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  songTitle,
  songArtist,
  audioUrl,
  partner1Name: _partner1Name,
  partner2Name: _partner2Name
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [viewMode, setViewMode] = useState<'vinyl' | 'video'>('vinyl');

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => setIsPlaying(playing));
    const unsubTime = romanticAudio.subscribeTime((time, dur) => {
      setCurrentTime(time);
      setDuration(dur || 240);
    });
    setVolume(romanticAudio.getVolume());
    if (audioUrl) {
      romanticAudio.setCustomAudioUrl(audioUrl);
    }
    return () => {
      unsub();
      unsubTime();
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const togglePlay = () => {
    romanticAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    romanticAudio.setVolume(val);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSec = parseFloat(e.target.value);
    romanticAudio.seekTo(newSec);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#192A45] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#2D4874] relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C95B65]/15 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-[#C95B65] animate-spin-slow" />
            <span className="text-xs uppercase tracking-wider text-[#D9A5AA] font-medium">
              Reality Club · Special Song
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Vinyl / Video */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-full text-xs">
              <button
                type="button"
                onClick={() => setViewMode('vinyl')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'vinyl' ? 'bg-[#C95B65] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Vinyl
              </button>
              <button
                type="button"
                onClick={() => setViewMode('video')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'video' ? 'bg-[#C95B65] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Youtube className="w-3 h-3" />
                <span>Video</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode 1: Vinyl Turntable Display */}
        {viewMode === 'vinyl' ? (
          <div className="my-8 flex flex-col items-center justify-center relative z-10">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
              {/* Spinning Vinyl */}
              <div
                className={`w-full h-full rounded-full bg-[#0D0B0A] border-4 border-[#2A2320] shadow-2xl flex items-center justify-center relative ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #1E1715 25%, #0D0B0A 30%, #171210 50%, #0D0B0A 70%, #201815 85%, #0D0B0A 100%)'
                }}
              >
                {/* Vinyl Grooves effect */}
                <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-14 rounded-full border border-white/5 pointer-events-none" />

                {/* Center Label */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9B3842] to-[#D57B84] p-2 flex flex-col items-center justify-center text-center shadow-inner border border-white/20">
                  <div className="w-4 h-4 rounded-full bg-[#181210] border border-white/30 mb-1" />
                  <span className="text-[8px] text-white/90 uppercase tracking-widest font-semibold">
                    Reality Club
                  </span>
                </div>
              </div>

              {/* Equalizer Visualizer Bars when playing */}
              {isPlaying && (
                <div className="absolute -bottom-3 flex items-end gap-1 h-5 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full border border-white/10">
                  <span className="w-1 bg-[#C95B65] h-3 animate-pulse rounded-full" />
                  <span className="w-1 bg-[#E88B96] h-5 animate-pulse rounded-full" />
                  <span className="w-1 bg-[#DCAE78] h-2 animate-pulse rounded-full" />
                  <span className="w-1 bg-[#C95B65] h-4 animate-pulse rounded-full" />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* View Mode 2: Official YouTube Video Embed */
          <div className="my-6 relative z-10 aspect-16/9 w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/7bz81uv3v1E?autoplay=1&enablejsapi=1&rel=0"
              title="Reality Club - Close to You / Jauh"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Track Details */}
        <div className="text-center relative z-10 mb-5">
          <h3 className="font-serif text-2xl text-white font-medium">
            {songTitle}
          </h3>
          <p className="text-xs text-[#E8BAC0] mt-1 font-medium">
            {songArtist} · Our Special Song
          </p>
        </div>

        {/* Time Progress Bar */}
        <div className="relative z-10 mb-5">
          <input
            type="range"
            min="0"
            max={duration || 240}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#C95B65] h-1.5 cursor-pointer bg-white/15 rounded-lg"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls: Play/Pause, Volume */}
        <div className="flex items-center justify-between relative z-10 pt-2">
          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white/50" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/70" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[#C95B65] h-1"
            />
          </div>

          {/* Primary Play Button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#C95B65] hover:bg-[#B74E58] text-white flex items-center justify-center shadow-lg shadow-[#C95B65]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <div className="w-32 text-right">
            <span className="text-[11px] text-white/50 block">
              {isPlaying ? 'Reality Club' : 'Tap Play'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
