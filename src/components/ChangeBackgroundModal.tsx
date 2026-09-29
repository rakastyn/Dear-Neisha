import React, { useState } from 'react';
import {
  X,
  Check,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sliders,
  Sparkles,
  Layout,
  Maximize2,
  RefreshCw,
  Camera
} from 'lucide-react';
import { BackgroundPreset, BACKGROUND_PRESETS, DEFAULT_HERO_BG } from '../utils/storage';
import { PhotoItem } from '../types';

interface ChangeBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  currentMode?: 'banner' | 'full';
  currentDimming?: number;
  galleryPhotos?: PhotoItem[];
  onSaveBackground: (image: string, mode: 'banner' | 'full', dimming: number) => void;
}

export const ChangeBackgroundModal: React.FC<ChangeBackgroundModalProps> = ({
  isOpen,
  onClose,
  currentImage = DEFAULT_HERO_BG,
  currentMode = 'banner',
  currentDimming = 55,
  galleryPhotos = [],
  onSaveBackground
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [selectedMode, setSelectedMode] = useState<'banner' | 'full'>(currentMode);
  const [selectedDimming, setSelectedDimming] = useState<number>(currentDimming);
  const [activeTab, setActiveTab] = useState<'presets' | 'gallery' | 'upload' | 'url'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage);
      setSelectedMode(currentMode);
      setSelectedDimming(currentDimming);
      setUrlError('');
      setToastMessage(null);
    }
  }, [isOpen, currentImage, currentMode, currentDimming]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleSelectPreset = (preset: BackgroundPreset) => {
    setSelectedImage(preset.imageSrc);
    showToast(`Selected "${preset.name}"`);
  };

  const handleSelectGalleryPhoto = (photo: PhotoItem) => {
    setSelectedImage(photo.imageSrc);
    showToast(`Selected "${photo.title}"`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setSelectedImage(dataUrl);
        showToast('Photo uploaded from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    try {
      const url = new URL(customUrlInput.trim());
      setSelectedImage(url.href);
      setUrlError('');
      showToast('Image URL applied!');
    } catch {
      setUrlError('Please enter a valid HTTP or HTTPS image URL.');
    }
  };

  const handleResetToDefault = () => {
    setSelectedImage(DEFAULT_HERO_BG);
    setSelectedMode('banner');
    setSelectedDimming(55);
    showToast('Reset to original cinematic background.');
  };

  const handleSaveAndApply = () => {
    onSaveBackground(selectedImage, selectedMode, selectedDimming);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#192A45] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[#2D4874] my-6 animate-in zoom-in-95 duration-200 text-white flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#263E63] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#203354] border border-[#2D4874] text-[#F472B6] flex items-center justify-center shadow-inner">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium flex items-center gap-2">
                Home Background Photo
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Customize the banner and wallpaper for &ldquo;Japan, Indonesia, and everything in between&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white rounded-full bg-[#15233A] hover:bg-[#203354] border border-[#263E63] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Feedback Toast Notification */}
        {toastMessage && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#F472B6]/20 border border-[#F472B6]/50 text-xs text-[#FBCFE8] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-4 space-y-5 flex-1">
          {/* Live Preview Card */}
          <div className="rounded-2xl overflow-hidden border border-[#2D4874] relative bg-stone-950 p-6 text-center shadow-lg group">
            <img
              src={selectedImage}
              alt="Background preview"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.08] transition-transform duration-500 group-hover:scale-102"
            />
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-300"
              style={{
                backgroundColor: `rgba(20, 15, 18, ${Math.min(0.95, (selectedDimming / 100) * 0.95)})`
              }}
            />
            <div className="relative z-10 max-w-md mx-auto py-2">
              <span className="inline-block text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-medium mb-2 border border-white/20">
                Live Preview &bull; {selectedMode === 'banner' ? 'Cinematic Banner' : 'Full Page Wallpaper'}
              </span>
              <h4 className="font-serif text-lg sm:text-2xl font-light text-white leading-tight drop-shadow-md">
                Japan, Indonesia, and everything in between
              </h4>
              <p className="text-[11px] text-rose-100/90 italic mt-1 font-serif">
                &ldquo;Though miles apart or side by side, always close to you.&rdquo;
              </p>
            </div>
          </div>

          {/* Source Tabs */}
          <div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#15233A] border border-[#263E63]">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-[#F472B6] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#203354]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Memories ({BACKGROUND_PRESETS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#F472B6] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#203354]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo Gallery ({galleryPhotos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-[#F472B6] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#203354]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-[#F472B6] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#203354]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web URL</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Presets Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BACKGROUND_PRESETS.map((preset) => {
                const isSelected = selectedImage === preset.imageSrc;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative rounded-xl overflow-hidden border-2 text-left p-1 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#F472B6] bg-[#203354] ring-2 ring-[#F472B6]/40 scale-[1.02]'
                        : 'border-[#2D4874] bg-[#15233A] hover:border-[#3E65A0] hover:bg-[#1A2E4E]'
                    }`}
                  >
                    <div className="h-24 w-full rounded-lg overflow-hidden bg-stone-900 relative">
                      <img
                        src={preset.imageSrc}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      {preset.tag && (
                        <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-rose-200 px-1.5 py-0.5 rounded">
                          {preset.tag}
                        </span>
                      )}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 bg-[#F472B6] text-white p-1 rounded-full shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="p-1.5 mt-1">
                      <div className="text-xs font-semibold text-white truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] line-clamp-1">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Gallery Photos */}
          {activeTab === 'gallery' && (
            <div>
              {galleryPhotos.length === 0 ? (
                <div className="text-center py-8 text-[#94A3B8] text-xs">
                  No photos found in gallery. You can pick from presets or upload a new photo!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryPhotos.map((photo) => {
                    const isSelected = selectedImage === photo.imageSrc;
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => handleSelectGalleryPhoto(photo)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left p-1 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#F472B6] bg-[#203354] ring-2 ring-[#F472B6]/40 scale-[1.02]'
                            : 'border-[#2D4874] bg-[#15233A] hover:border-[#3E65A0] hover:bg-[#1A2E4E]'
                        }`}
                      >
                        <div className="h-24 w-full rounded-lg overflow-hidden bg-stone-900 relative">
                          <img
                            src={photo.imageSrc}
                            alt={photo.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 bg-[#F472B6] text-white p-1 rounded-full shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="p-1.5 mt-1">
                          <div className="text-xs font-semibold text-white truncate">
                            {photo.title}
                          </div>
                          <div className="text-[10px] text-[#94A3B8] truncate">
                            {photo.date || 'Memory'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Upload from Device */}
          {activeTab === 'upload' && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#F472B6]/40 bg-[#15233A] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#203354] border border-[#2D4874] flex items-center justify-center text-[#F472B6]">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif text-base text-white">
                  Upload a photo of you two
                </h4>
                <p className="text-xs text-[#94A3B8] max-w-sm mt-0.5">
                  Supports JPG, PNG, WebP from your phone or computer. The photo will be saved locally.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F472B6] hover:bg-[#E11D48] text-white text-xs font-medium cursor-pointer shadow-lg transition-transform hover:scale-102">
                <Upload className="w-4 h-4" />
                <span>Select Photo from Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Tab 4: Direct Web Image URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3">
              <label className="block text-xs font-medium text-[#CBD5E1]">
                Paste Direct Image Web Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    setUrlError('');
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F472B6] hover:bg-[#E11D48] text-white text-xs font-medium rounded-xl cursor-pointer transition-colors"
                >
                  Load Image
                </button>
              </div>
              {urlError && <p className="text-xs text-rose-400">{urlError}</p>}
            </form>
          )}

          {/* Visual Customization Controls: Mode & Dimming */}
          <div className="pt-4 border-t border-[#263E63] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#93C5FD] uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Display &amp; Readability Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Mode */}
              <div className="p-3.5 rounded-xl bg-[#15233A] border border-[#263E63]">
                <label className="block text-xs font-medium text-[#CBD5E1] mb-2">
                  Display Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('banner')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedMode === 'banner'
                        ? 'bg-[#203354] border-2 border-[#F472B6] text-white shadow-sm'
                        : 'border border-[#2D4874] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span>Banner Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMode('full')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedMode === 'full'
                        ? 'bg-[#203354] border-2 border-[#F472B6] text-white shadow-sm'
                        : 'border border-[#2D4874] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full Wallpaper</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-2">
                  {selectedMode === 'banner'
                    ? 'Image is elegantly framed inside the hero card.'
                    : 'Image spans the entire home page behind all milestone cards.'}
                </p>
              </div>

              {/* Dimming Slider */}
              <div className="p-3.5 rounded-xl bg-[#15233A] border border-[#263E63] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#CBD5E1] mb-1">
                    <span>Darkness Scrim</span>
                    <span className="text-[#F472B6] font-mono font-semibold">{selectedDimming}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="5"
                    value={selectedDimming}
                    onChange={(e) => setSelectedDimming(Number(e.target.value))}
                    className="w-full accent-[#F472B6] cursor-pointer mt-2"
                  />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-2">
                  Higher dimming ensures romantic typography is ultra-crisp and easy to read.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#263E63] shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white cursor-pointer px-2 py-1 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Background</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
