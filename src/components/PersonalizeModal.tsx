import React, { useState } from 'react';
import { X, Check, Heart, Music, Calendar, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { CoupleProfile } from '../types';
import { DEFAULT_HERO_BG, ALT_HERO_BG, BACKGROUND_PRESETS } from '../utils/storage';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onSaveProfile: (profile: CoupleProfile) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<CoupleProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData({
          ...formData,
          heroBackgroundImage: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#192A45] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#2D4874] my-8 animate-in zoom-in-95 duration-200 text-white"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#F472B6] fill-[#F472B6]" />
            <h3 className="font-serif text-2xl text-white">
              Personalize Our Sanctuary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={formData.partner1Name}
                onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Her Name (Girlfriend)
              </label>
              <input
                type="text"
                value={formData.partner2Name}
                onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Anniversary Date
              </label>
              <input
                type="date"
                value={formData.anniversaryDate}
                onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                First Date
              </label>
              <input
                type="date"
                value={formData.firstDate || '2026-01-12'}
                onChange={(e) => setFormData({ ...formData, firstDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Since (Counter)
              </label>
              <input
                type="date"
                value={formData.relationshipStartDate.split('T')[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relationshipStartDate: `${e.target.value}T12:00:00`
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
              Our Love Tagline / Motto
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
              placeholder="e.g. You make every ordinary moment feel like poetry."
            />
          </div>

          {/* Homepage Background Customizer */}
          <div className="pt-2 border-t border-[#263E63]">
            <span className="text-xs font-semibold text-[#93C5FD] uppercase tracking-wider block mb-2">
              Homepage Background Photo (&ldquo;Japan, Indonesia, and everything in between&rdquo;)
            </span>

            {/* Current Background Preview & Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 max-h-52 overflow-y-auto pr-1">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected = (formData.heroBackgroundImage || DEFAULT_HERO_BG) === preset.imageSrc;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, heroBackgroundImage: preset.imageSrc })}
                    className={`relative rounded-xl overflow-hidden border-2 text-left p-1 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#F472B6] ring-2 ring-[#F472B6]/40 bg-[#203354]'
                        : 'border-[#2D4874] bg-[#15233A] hover:border-[#3E65A0]'
                    }`}
                  >
                    <div className="h-16 w-full rounded-lg overflow-hidden bg-stone-900 relative">
                      <img
                        src={preset.imageSrc}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <span className="absolute top-1 right-1 bg-[#F472B6] text-white p-0.5 rounded-full shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="p-1">
                      <div className="text-[11px] font-medium text-white truncate">{preset.name}</div>
                      <div className="text-[9px] text-[#94A3B8] truncate">{preset.tag || 'Memory'}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Photo Upload */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Or Upload Another Favorite Photo
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-[#F472B6]/50 bg-[#15233A] hover:bg-[#203354] text-[#F472B6] text-xs font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose Photo from Device Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* View Mode & Dimming */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Display Mode
                </label>
                <select
                  value={formData.heroBackgroundMode || 'banner'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heroBackgroundMode: e.target.value as 'banner' | 'full'
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                >
                  <option value="banner">Cinematic Banner</option>
                  <option value="full">Full Page Wallpaper</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#CBD5E1] mb-1">
                  <span>Dimming / Darkness</span>
                  <span className="text-[#F472B6] font-mono">{formData.heroDimming ?? 55}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={formData.heroDimming ?? 55}
                  onChange={(e) =>
                    setFormData({ ...formData, heroDimming: Number(e.target.value) })
                  }
                  className="w-full accent-[#F472B6] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#263E63]">
            <span className="text-xs font-semibold text-[#93C5FD] uppercase tracking-wider block mb-2">
              Our Special Song Details
            </span>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Song Title</label>
                <input
                  type="text"
                  value={formData.specialSongTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, specialSongTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Artist</label>
                <input
                  type="text"
                  value={formData.specialSongArtist}
                  onChange={(e) =>
                    setFormData({ ...formData, specialSongArtist: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:border-[#F472B6] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                Custom MP3 URL (Optional)
              </label>
              <input
                type="url"
                placeholder="Leave blank to play the dreamy acoustic acoustic chord progression"
                value={formData.songAudioUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, songAudioUrl: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
              />
              <span className="text-[11px] text-[#94A3B8] mt-1 block">
                Default: romantic acoustic piano arpeggio built using Web Audio API.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] rounded-lg transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
