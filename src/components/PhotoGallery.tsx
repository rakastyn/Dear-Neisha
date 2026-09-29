import React, { useState } from 'react';
import { Heart, Plus, Camera, MapPin, Calendar, X, Sparkles, Upload, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoItem } from '../types';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  partner1Name: string;
  partner2Name: string;
  onUpdatePhotos: (photos: PhotoItem[]) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  partner1Name,
  partner2Name,
  onUpdatePhotos
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<PhotoItem | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Form state for adding photo
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PhotoItem['category']>('everyday');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('');

  const confirmDeletePhoto = () => {
    if (!photoToDelete) return;
    const updated = photos.filter((p) => p.id !== photoToDelete.id);
    onUpdatePhotos(updated);
    if (selectedPhoto && selectedPhoto.id === photoToDelete.id) {
      setSelectedPhoto(null);
    }
    setPhotoToDelete(null);
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = photos.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
    onUpdatePhotos(updated);
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, likes: selectedPhoto.likes + 1 });
    }
  };

  const handleDirectReplace = (photoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        const updated = photos.map((p) => (p.id === photoId ? { ...p, imageSrc: dataUrl } : p));
        onUpdatePhotos(updated);
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto({ ...selectedPhoto, imageSrc: dataUrl });
        }
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E88B96', '#C95B65', '#DCAE78', '#FAF0F2']
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropPhoto = (photoId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        const updated = photos.map((p) => (p.id === photoId ? { ...p, imageSrc: dataUrl } : p));
        onUpdatePhotos(updated);
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto({ ...selectedPhoto, imageSrc: dataUrl });
        }
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E88B96', '#C95B65', '#DCAE78', '#FAF0F2']
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageSrc) return;

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: newTitle || 'Sweet Memory',
      category: newCategory,
      date: newDate || 'Recently',
      location: newLocation || 'Everywhere with you',
      caption: newCaption || 'A moment frozen in time.',
      imageSrc: newImageSrc,
      likes: 1
    };

    onUpdatePhotos([newPhoto, ...photos]);
    setIsAddingPhoto(false);
    // Reset form
    setNewTitle('');
    setNewCaption('');
    setNewDate('');
    setNewLocation('');
    setNewImageSrc('');
  };

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Our Photo Gallery
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-xl">
            Every glance, every flower, and every laughter shared between {partner1Name} and {partner2Name}.
          </p>
        </div>

        <button
          onClick={() => setIsAddingPhoto(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] transition-colors shadow-md self-start md:self-end cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Memory Photo</span>
        </button>
      </div>

      {/* Unified Gallery Grid */}
      {photos.length > 0 && (
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photos.map((item, idx) => {
              if (!item) return null;
              const isDraggingOver = dragOverId === item.id;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedPhoto(item)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverId(item.id);
                  }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={(e) => handleDropPhoto(item.id, e)}
                  className={`group cursor-pointer bg-[#192A45] rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                    isDraggingOver
                      ? 'border-[#F472B6] ring-2 ring-[#F472B6] shadow-xl scale-[1.02]'
                      : 'border-[#2D4874] shadow-md hover:shadow-xl hover:border-[#3E65A0]'
                  }`}
                >
                  <div>
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#15233A] mb-3.5 shadow-inner">
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Delete button on top right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoToDelete(item);
                        }}
                        title="Delete photo"
                        className="cursor-pointer absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-[#E11D48] text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all hover:scale-110 z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>

                      {/* Device photo upload button (clean icon only) */}
                      <label
                        onClick={(e) => e.stopPropagation()}
                        title="Upload photo from device"
                        className="cursor-pointer absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-[#F472B6] text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all hover:scale-110 z-10"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDirectReplace(item.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mb-1">
                      <span>{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.location}</span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-medium text-white mb-1.5 group-hover:text-[#FBCFE8] transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed line-clamp-3">
                      {item.caption}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#263E63] flex items-center justify-between text-xs text-[#94A3B8]">
                    <span className="text-[11px] text-[#94A3B8]">{item.date}</span>
                    <span className="text-[11px] font-medium text-[#93C5FD] group-hover:text-[#F472B6] transition-colors">
                      View Story →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when all photos deleted */}
      {photos.length === 0 && (
        <div className="text-center py-16 bg-[#192A45] rounded-3xl border border-dashed border-[#2D4874] p-8 max-w-lg mx-auto mb-16">
          <div className="w-14 h-14 rounded-full bg-[#203354] text-[#F472B6] flex items-center justify-center mx-auto mb-4 border border-[#2D4874]">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-white mb-2">
            No Photos in Gallery
          </h3>
          <p className="text-xs text-[#94A3B8] mb-6">
            The photo gallery is currently empty. Click the button below to add your special memory photos!
          </p>
          <button
            onClick={() => setIsAddingPhoto(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Memory Photo</span>
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#192A45] text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#2D4874] flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Image viewer */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden p-2">
              <img
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[60vh] md:max-h-[85vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sidebar info */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-[#15233A]">
              <div>
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1 text-white/70 hover:text-white rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-serif text-2xl text-white mb-2">
                  {selectedPhoto.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F472B6]" />
                    <span>{selectedPhoto.date}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F472B6]" />
                    <span className="truncate max-w-[140px]">{selectedPhoto.location}</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#192A45] border border-[#2D4874] mb-6">
                  <p className="font-serif italic text-sm text-[#E2E8F0] leading-relaxed">
                    &ldquo;{selectedPhoto.caption}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#263E63] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoToDelete(selectedPhoto);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-medium text-white hover:text-white bg-[#E11D48]/30 hover:bg-[#E11D48] border border-[#E11D48]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Photo</span>
                </button>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-5 py-2 rounded-full text-xs font-medium bg-[#203354] hover:bg-[#2A436D] text-white border border-[#2D4874] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {photoToDelete && (
        <div
          onClick={() => setPhotoToDelete(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E8DFD5] text-center animate-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF0F2] text-[#C95B65] flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#2D2420] mb-2">
              Delete Memory Photo?
            </h3>
            <p className="text-xs text-[#736359] leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{photoToDelete.title}&rdquo; from the memory gallery?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#685950] bg-[#FAF7F2] border border-[#DDD3C7] hover:bg-[#F2ECE3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                className="px-5 py-2 rounded-full text-xs font-medium text-white bg-[#C95B65] hover:bg-[#B3454F] shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Memory Photo Modal */}
      {isAddingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#192A45] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#2D4874] my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
              <h3 className="font-serif text-2xl text-white">
                Add a Special Memory
              </h3>
              <button
                onClick={() => setIsAddingPhoto(false)}
                className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Photo File <span className="text-[#F472B6]">*</span>
                </label>
                {!newImageSrc ? (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2D4874] hover:border-[#F472B6] bg-[#15233A] hover:bg-[#1E3252] rounded-xl cursor-pointer transition-all text-center group">
                    <div className="w-12 h-12 rounded-full bg-[#203354] shadow-xs flex items-center justify-center text-[#F472B6] mb-2.5 group-hover:scale-110 transition-transform border border-[#2D4874]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-[#FBCFE8] transition-colors">
                      Choose photo from files
                    </span>
                    <span className="text-xs text-[#94A3B8] mt-1">
                      Click to browse from your computer or phone
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-[#2D4874] bg-stone-900 group">
                    <div className="aspect-16/9 w-full">
                      <img
                        src={newImageSrc}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#203354] text-white border border-[#2D4874] rounded-full text-xs font-medium shadow-md hover:bg-[#2A436D] transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#F472B6]" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewImageSrc('')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48]/80 hover:bg-[#E11D48] text-white rounded-full text-xs font-medium shadow-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Under the stars together"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. March 26, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. By the ocean shore"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Why this memory is special to you
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet memory or feeling from that day..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
                <button
                  type="button"
                  onClick={() => setIsAddingPhoto(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImageSrc}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  <span>Save to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
