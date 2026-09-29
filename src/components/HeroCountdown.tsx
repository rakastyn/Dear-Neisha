import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Play, Pause, Camera, Target, Coffee, ArrowRight } from 'lucide-react';
import { CoupleProfile, ActiveTab, PhotoItem } from '../types';
import { romanticAudio } from '../utils/audio';
import { DEFAULT_HERO_BG } from '../utils/storage';

interface HeroCountdownProps {
  profile: CoupleProfile;
  onOpenMusicModal: () => void;
  onOpenSettingsModal: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onUpdateProfile?: (profile: CoupleProfile) => void;
  galleryPhotos?: PhotoItem[];
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  profile,
  onOpenMusicModal,
  onOpenSettingsModal,
  onNavigate,
  onUpdateProfile,
  galleryPhotos = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [togetherTime, setTogetherTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [nextAnniversary, setNextAnniversary] = useState({
    years: 0,
    daysLeft: 0,
    hoursLeft: 0,
    minutesLeft: 0,
    targetDateFormatted: ''
  });

  const heroBg = profile.heroBackgroundImage || DEFAULT_HERO_BG;
  const isFullPage = profile.heroBackgroundMode === 'full';
  const dimming = typeof profile.heroDimming === 'number' ? profile.heroDimming : 55;

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => setIsPlaying(playing));
    return () => unsub();
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const start = new Date(profile.relationshipStartDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTogetherTime({ days, hours, minutes, seconds });

      // Calculate next anniversary
      const [startYear, startMonth, startDay] = profile.anniversaryDate.split('-').map(Number);
      const currentDate = new Date();
      let nextAnnivYear = currentDate.getFullYear();
      let nextDate = new Date(nextAnnivYear, (startMonth || 3) - 1, startDay || 26);

      if (nextDate.getTime() < currentDate.getTime()) {
        nextAnnivYear += 1;
        nextDate = new Date(nextAnnivYear, (startMonth || 3) - 1, startDay || 26);
      }

      const yearsCelebrated = nextAnnivYear - (startYear || 2026);
      const annivDiff = Math.max(0, nextDate.getTime() - currentDate.getTime());
      const aDays = Math.floor(annivDiff / (1000 * 60 * 60 * 24));
      const aHours = Math.floor((annivDiff / (1000 * 60 * 60)) % 24);
      const aMins = Math.floor((annivDiff / (1000 * 60)) % 60);

      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      setNextAnniversary({
        years: yearsCelebrated || 1,
        daysLeft: aDays,
        hoursLeft: aHours,
        minutesLeft: aMins,
        targetDateFormatted: nextDate.toLocaleDateString('en-US', options)
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [profile.relationshipStartDate, profile.anniversaryDate]);

  const handleToggleMusic = () => {
    romanticAudio.toggle();
  };

  return (
    <div className="relative">
      <section className="relative pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient subtle decorative glow when in banner mode */}
        {!isFullPage && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#F4D9DC]/40 via-[#F7ECE4]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        )}

        {/* Hero Showcase with Photo Background & "Japan, Indonesia, and everything in between" */}
        <div
          className={`relative rounded-3xl overflow-hidden shadow-xl border mb-12 sm:mb-14 p-8 sm:p-12 lg:p-16 text-center text-white min-h-[460px] sm:min-h-[520px] flex flex-col justify-center items-center transition-all ${
            isFullPage
              ? 'bg-stone-950/45 backdrop-blur-md border-white/25 shadow-2xl'
              : 'border-stone-800/15'
          }`}
        >
          {/* Couple Photograph in Background (Rendered inside the banner when in banner mode) */}
          {!isFullPage && (
            <>
              <img
                src={heroBg}
                alt="Japan, Indonesia, and everything in between"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.08] transition-transform duration-1000 hover:scale-102"
              />

              {/* Multi-layered cinematic gradient scrim for crystal-clear readability */}
              <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, rgba(18, 12, 14, ${(dimming / 100) * 0.72}) 0%, rgba(26, 17, 20, ${(dimming / 100) * 0.92}) 50%, rgba(18, 12, 14, ${Math.min(0.96, (dimming / 100) * 1.15)}) 100%)`
                }}
              />

              {/* Romantic ambient center glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,91,101,0.2)_0%,_transparent_75%)] pointer-events-none" />
            </>
          )}

          {/* Foreground Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Main Headline requested by user */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.12] mb-8 text-balance drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              Japan, Indonesia, and everything in between
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleToggleMusic}
                className={`group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer shadow-lg ${
                  isPlaying
                    ? 'bg-[#C95B65] text-white hover:bg-[#B74E58] shadow-[#C95B65]/40 scale-102 ring-2 ring-rose-300/40'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{isPlaying ? 'Pause Our Song' : 'Play Our Special Song'}</span>
                <span className="text-xs text-rose-200/90 font-normal">
                  ({profile.specialSongTitle})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Milestone Cards: Days Together & Upcoming Anniversary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-14">
          {/* Card 1: Live Days Together (Span 7) */}
          <div className="lg:col-span-7 bg-[#192A45]/90 backdrop-blur-md rounded-2xl p-7 sm:p-9 border border-[#2D4874] shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#3E65A0]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#93C5FD]">
                  Live Relationship Counter
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">
                  Days in Love Together
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#203354] border border-[#2D4874] flex items-center justify-center text-[#F472B6] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Number Display */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 my-4">
              <div className="text-center p-3 sm:p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
                <div className="font-mono tabular-nums text-3xl sm:text-5xl font-bold text-white">
                  {togetherTime.days}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#94A3B8] mt-1 font-medium">
                  Days
                </div>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
                <div className="font-mono tabular-nums text-3xl sm:text-5xl font-bold text-white">
                  {togetherTime.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#94A3B8] mt-1 font-medium">
                  Hours
                </div>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
                <div className="font-mono tabular-nums text-3xl sm:text-5xl font-bold text-white">
                  {togetherTime.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#94A3B8] mt-1 font-medium">
                  Mins
                </div>
              </div>

              <div className="text-center p-3 sm:p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
                <div className="font-mono tabular-nums text-3xl sm:text-5xl font-bold text-[#F472B6]">
                  {togetherTime.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#94A3B8] mt-1 font-medium">
                  Secs
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#263E63] flex items-center justify-between text-xs text-[#94A3B8]">
              <span>
                Official Anniversary: 26 March 2026
              </span>
              <span className="font-serif italic text-sm text-[#FBCFE8]">
                Every single second has been worth it.
              </span>
            </div>
          </div>

          {/* Card 2: Next Anniversary Countdown (Span 5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E2E4A]/90 to-[#192A45]/90 backdrop-blur-md rounded-2xl p-7 sm:p-9 border border-[#2D4874] shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#3E65A0]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#F472B6]">
                  Upcoming Milestone
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">
                  Anniversary Countdown
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#203354] border border-[#2D4874] flex items-center justify-center text-[#F472B6] shadow-sm shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="my-3">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono tabular-nums text-4xl sm:text-6xl font-bold text-[#F472B6]">
                  {nextAnniversary.daysLeft}
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#E2E8F0]">
                  days until celebration
                </span>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Counting down to our anniversary celebration on March 26th.
              </p>
            </div>

            <div className="pt-4 border-t border-[#263E63] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-ping" />
                <span>{nextAnniversary.hoursLeft} hrs &amp; {nextAnniversary.minutesLeft} mins left</span>
              </div>
              <button
                onClick={onOpenSettingsModal}
                className="text-xs font-medium text-[#93C5FD] hover:text-white underline transition-colors cursor-pointer"
              >
                Edit Dates
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Portals to Other Sections */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Portal 1: First Date */}
            <button
              onClick={() => onNavigate('first-date')}
              className="group p-5 rounded-2xl bg-[#192A45]/90 backdrop-blur-md border border-[#2D4874] hover:border-[#F472B6] hover:shadow-lg transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#203354] text-[#F472B6] border border-[#2D4874] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-medium text-white group-hover:text-[#FBCFE8] transition-colors">
                  Our First Date
                </h4>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#93C5FD] group-hover:text-[#F472B6]">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Portal 2: Photo Gallery */}
            <button
              onClick={() => onNavigate('gallery')}
              className="group p-5 rounded-2xl bg-[#192A45]/90 backdrop-blur-md border border-[#2D4874] hover:border-[#F472B6] hover:shadow-lg transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#203354] text-[#F472B6] border border-[#2D4874] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-medium text-white group-hover:text-[#FBCFE8] transition-colors">
                  Photo Gallery
                </h4>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#93C5FD] group-hover:text-[#F472B6]">
                <span>View Photos</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Portal 3: For You */}
            <button
              onClick={() => onNavigate('conditions-goals')}
              className="group p-5 rounded-2xl bg-[#192A45]/90 backdrop-blur-md border border-[#2D4874] hover:border-[#F472B6] hover:shadow-lg transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#203354] text-[#F472B6] border border-[#2D4874] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-medium text-white group-hover:text-[#FBCFE8] transition-colors">
                  For You
                </h4>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#93C5FD] group-hover:text-[#F472B6]">
                <span>View For You</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
