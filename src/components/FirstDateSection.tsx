import React, { useState } from 'react';
import { Calendar, MapPin, X, Check, Camera, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FirstDateInfo } from '../types';

interface FirstDateSectionProps {
  firstDate: FirstDateInfo;
  partner1Name: string;
  partner2Name: string;
  onUpdateFirstDate: (info: FirstDateInfo) => void;
}

export const FirstDateSection: React.FC<FirstDateSectionProps> = ({
  firstDate,
  partner1Name,
  partner2Name,
  onUpdateFirstDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FirstDateInfo>(firstDate);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFirstDate(formData);
    setIsEditing(false);
  };

  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        const updated = { ...firstDate, imageSrc: dataUrl };
        onUpdateFirstDate(updated);
        setFormData(updated);
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

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        const updated = { ...firstDate, imageSrc: dataUrl };
        onUpdateFirstDate(updated);
        setFormData(updated);
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

  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData({ ...formData, imageSrc: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Editorial Section Header */}
      <div className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#F472B6] mb-2">
          Where Everything Began
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
          Our Very First Date
        </h2>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Polaroid Style Visual Frame (Span 5) */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDropImage}
            className="relative group max-w-sm sm:max-w-md w-full"
          >
            {/* Decorative Tape graphic on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#2D4874]/90 backdrop-blur-xs border border-[#3E65A0] rotate-1 z-20 shadow-xs" />

            {/* Polaroid frame */}
            <div
              className={`bg-white p-4 sm:p-5 pb-8 rounded-sm shadow-2xl border transform transition-all duration-500 ${
                isDraggingOver
                  ? 'border-[#F472B6] ring-2 ring-[#F472B6] scale-105 rotate-0'
                  : '-rotate-1 group-hover:rotate-0 border-white/20'
              }`}
            >
              <div className="aspect-3/4 w-full overflow-hidden bg-[#FAF6F0] rounded-xs relative">
                <img
                  src={firstDate.imageSrc}
                  alt="Our First Date Memory"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-xs font-mono">
                  {firstDate.date}
                </div>

                {/* Instant device photo upload button */}
                <label
                  title="Upload photo from device"
                  className="cursor-pointer absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#F472B6] text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all hover:scale-110 z-10"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirectImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Handwritten caption below image */}
              <div className="mt-4 text-center">
                <p className="text-xs text-[#52443C] mt-1 font-medium">
                  {firstDate.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Story narrative & details (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#192A45] rounded-xl border border-[#2D4874] shadow-md">
              <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>The Date</span>
              </span>
              <p className="font-medium text-sm text-white">{firstDate.date}</p>
            </div>

            <div className="p-3.5 bg-[#192A45] rounded-xl border border-[#2D4874] shadow-md">
              <span className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Location</span>
              </span>
              <p className="font-medium text-sm text-white truncate">{firstDate.location}</p>
            </div>
          </div>

          {/* Narrative Story Block */}
          <div className="bg-[#192A45] rounded-2xl p-6 sm:p-7 border border-[#2D4874] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#2D4874]/30 rounded-bl-full pointer-events-none -z-0" />
            <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed relative z-10 whitespace-pre-line font-serif">
              {firstDate.storyText}
            </p>
          </div>

          {/* First Impression */}
          <div className="p-4 bg-[#192A45] rounded-xl border border-[#2D4874]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD]">
                {partner1Name}&apos;s First Impression
              </span>
            </div>
            <p className="font-serif italic text-sm text-[#E2E8F0] leading-relaxed">
              {firstDate.firstImpression1}
            </p>
          </div>
        </div>
      </div>

      {/* Edit First Date Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#192A45] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#2D4874] my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
              <h3 className="font-serif text-2xl text-white">
                Customize Our First Date Memory
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload in Edit Modal */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Photo from First Date
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#2D4874] bg-black/40 flex-shrink-0">
                    <img
                      src={formData.imageSrc}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#15233A] border border-[#2D4874] rounded-lg text-white hover:bg-[#203354]">
                    <Upload className="w-3.5 h-3.5 text-[#F472B6]" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">The Story</label>
                <textarea
                  rows={4}
                  value={formData.storyText}
                  onChange={(e) => setFormData({ ...formData, storyText: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">{partner1Name}&apos;s First Impression</label>
                  <input
                    type="text"
                    value={formData.firstImpression1}
                    onChange={(e) => setFormData({ ...formData, firstImpression1: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">{partner2Name}&apos;s First Impression</label>
                  <input
                    type="text"
                    value={formData.firstImpression2}
                    onChange={(e) => setFormData({ ...formData, firstImpression2: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white focus:outline-hidden focus:border-[#F472B6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Memory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
