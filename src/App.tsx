/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CoupleProfile,
  FirstDateInfo,
  PhotoItem,
  PartnerCondition,
  SharedGoal,
  ActiveTab
} from './types';
import {
  loadProfile,
  saveProfile,
  loadFirstDate,
  saveFirstDate,
  loadPhotos,
  savePhotos,
  loadConditions,
  saveConditions,
  loadGoals,
  saveGoals,
  DEFAULT_HERO_BG,
  DEFAULT_FIRST_DATE_BG,
  DEFAULT_GALLERY_BG,
  DEFAULT_FOR_YOU_BG
} from './utils/storage';
import { romanticAudio } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HeroCountdown } from './components/HeroCountdown';
import { FirstDateSection } from './components/FirstDateSection';
import { PhotoGallery } from './components/PhotoGallery';
import { StatusAndGoalsSection } from './components/StatusAndGoalsSection';
import { MusicPlayerModal } from './components/MusicPlayerModal';
import { PersonalizeModal } from './components/PersonalizeModal';
import { FloatingMusicBar } from './components/FloatingMusicBar';
import { Footer } from './components/Footer';

const TAB_ORDER: ActiveTab[] = ['countdown', 'first-date', 'gallery', 'conditions-goals'];

export default function App() {
  const [profile, setProfile] = useState<CoupleProfile>(loadProfile);
  const [firstDate, setFirstDate] = useState<FirstDateInfo>(loadFirstDate);
  const [photos, setPhotos] = useState<PhotoItem[]>(loadPhotos);
  const [conditions, setConditions] = useState<{
    partner1: PartnerCondition;
    partner2: PartnerCondition;
  }>(loadConditions);
  const [goals, setGoals] = useState<SharedGoal[]>(loadGoals);

  // Active view tab state (each section is accessed via top menu)
  const [activeTab, setActiveTab] = useState<ActiveTab>('countdown');
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  // Modals state
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync profile audio when URL changes & initialize YouTube Player Host
  useEffect(() => {
    romanticAudio.setPlayerHostElement('youtube-audio-host');
    if (profile.songAudioUrl) {
      romanticAudio.setCustomAudioUrl(profile.songAudioUrl);
    }
  }, [profile.songAudioUrl]);

  const handleUpdateProfile = (newProfile: CoupleProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);

    // Keep partner names updated across conditions
    const updatedConditions = {
      ...conditions,
      partner1: { ...conditions.partner1, partnerName: newProfile.partner1Name },
      partner2: { ...conditions.partner2, partnerName: newProfile.partner2Name }
    };
    setConditions(updatedConditions);
    saveConditions(updatedConditions);
  };

  const handleUpdateFirstDate = (info: FirstDateInfo) => {
    setFirstDate(info);
    saveFirstDate(info);
  };

  const handleUpdatePhotos = (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
    savePhotos(newPhotos);
  };

  const handleUpdateConditions = (newConditions: {
    partner1: PartnerCondition;
    partner2: PartnerCondition;
  }) => {
    setConditions(newConditions);
    saveConditions(newConditions);
  };

  const handleUpdateGoals = (newGoals: SharedGoal[]) => {
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const triggerGlobalCelebrate = () => {
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#E88B96', '#C95B65', '#DCAE78', '#FAF0F2', '#EEDADF']
    });
  };

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === activeTab) return;
    const prevIdx = TAB_ORDER.indexOf(activeTab);
    const nextIdx = TAB_ORDER.indexOf(tab);
    setSlideDirection(nextIdx >= prevIdx ? 'right' : 'left');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#203354] text-white flex flex-col font-sans selection:bg-[#385A90] selection:text-white relative">
      {/* Viewport-level Full Page Background (Lives outside animated/transformed containers so fullscreen NEVER bugs) */}
      {activeTab === 'countdown' && profile.heroBackgroundMode === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={profile.heroBackgroundImage || DEFAULT_HERO_BG}
            alt="Japan, Indonesia, and everything in between"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[1.08] blur-[0.5px] scale-102"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: `rgba(24, 18, 20, ${((profile.heroDimming ?? 55) / 100) * 0.72})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#203354]/95" />
        </div>
      )}

      {/* Viewport-level Full Page Background for "Our First Date" page */}
      {activeTab === 'first-date' && profile.firstDateBackgroundMode === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={profile.firstDateBackgroundImage || DEFAULT_FIRST_DATE_BG}
            alt="First Date Sanctuary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[1.05] blur-[0.5px] scale-102"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: `rgba(20, 28, 48, ${((profile.firstDateDimming ?? 65) / 100) * 0.88})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#203354]/85 via-transparent to-[#203354]/95" />
        </div>
      )}

      {/* Viewport-level Full Page Background for "Photo Gallery" page */}
      {activeTab === 'gallery' && profile.galleryBackgroundMode === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={profile.galleryBackgroundImage || DEFAULT_GALLERY_BG}
            alt="Gallery Sanctuary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[1.05] blur-[0.5px] scale-102"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: `rgba(20, 28, 48, ${((profile.galleryDimming ?? 65) / 100) * 0.88})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#203354]/85 via-transparent to-[#203354]/95" />
        </div>
      )}

      {/* Viewport-level Full Page Background for "For You" page (conditions-goals) */}
      {activeTab === 'conditions-goals' && profile.forYouBackgroundMode === 'full' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={profile.forYouBackgroundImage || DEFAULT_FOR_YOU_BG}
            alt="For You Sanctuary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[1.05] blur-[0.5px] scale-102"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: `rgba(20, 28, 48, ${((profile.forYouDimming ?? 65) / 100) * 0.88})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#203354]/85 via-transparent to-[#203354]/95" />
        </div>
      )}

      {/* Top Navbar Menu */}
      <Navbar
        partner1Name={profile.partner1Name}
        partner2Name={profile.partner2Name}
        songTitle={profile.specialSongTitle}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenMusicModal={() => setIsMusicModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onCelebrate={triggerGlobalCelebrate}
      />

      {/* Main View Router based on Active Tab with Smooth Sliding Transition */}
      <main className="flex-1 overflow-x-hidden relative z-10">
        <div
          key={activeTab}
          className={slideDirection === 'right' ? 'animate-slide-section-right' : 'animate-slide-section-left'}
        >
          {activeTab === 'countdown' && (
            <HeroCountdown
              profile={profile}
              galleryPhotos={photos}
              onOpenMusicModal={() => setIsMusicModalOpen(true)}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              onNavigate={handleSelectTab}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'first-date' && (
            <FirstDateSection
              firstDate={firstDate}
              partner1Name={profile.partner1Name}
              partner2Name={profile.partner2Name}
              onUpdateFirstDate={handleUpdateFirstDate}
            />
          )}

          {activeTab === 'gallery' && (
            <PhotoGallery
              photos={photos}
              partner1Name={profile.partner1Name}
              partner2Name={profile.partner2Name}
              onUpdatePhotos={handleUpdatePhotos}
            />
          )}

          {activeTab === 'conditions-goals' && (
            <StatusAndGoalsSection
              conditions={conditions}
              goals={goals}
              partner1Name={profile.partner1Name}
              partner2Name={profile.partner2Name}
              profile={profile}
              galleryPhotos={photos}
              onUpdateProfile={handleUpdateProfile}
              onUpdateConditions={handleUpdateConditions}
              onUpdateGoals={handleUpdateGoals}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        partner1Name={profile.partner1Name}
        partner2Name={profile.partner2Name}
        onSelectTab={handleSelectTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Floating Audio Bar */}
      <FloatingMusicBar
        songTitle={profile.specialSongTitle}
        songArtist={profile.specialSongArtist}
        onOpenModal={() => setIsMusicModalOpen(true)}
      />

      {/* Vinyl Turntable Music Player Modal */}
      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        songTitle={profile.specialSongTitle}
        songArtist={profile.specialSongArtist}
        audioUrl={profile.songAudioUrl}
        partner1Name={profile.partner1Name}
        partner2Name={profile.partner2Name}
      />

      {/* Personalize & Settings Modal */}
      <PersonalizeModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
      />

      {/* Hidden YouTube IFrame host for background audio */}
      <div
        className="fixed -bottom-24 -right-24 w-1 h-1 overflow-hidden opacity-0 pointer-events-none -z-50"
        aria-hidden="true"
      >
        <div id="youtube-audio-host"></div>
      </div>
    </div>
  );
}
