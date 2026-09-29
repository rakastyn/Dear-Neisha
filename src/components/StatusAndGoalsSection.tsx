import React, { useState, useEffect } from 'react';
import {
  BatteryCharging,
  Heart,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Edit3,
  X,
  Award,
  Trash2,
  Mail,
  Pin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartnerCondition, SharedGoal, RakaMessage, CoupleProfile, PhotoItem } from '../types';
import { DEFAULT_FOR_YOU_BG } from '../utils/storage';
import { ChangeBackgroundModal } from './ChangeBackgroundModal';

interface StatusAndGoalsSectionProps {
  conditions: { partner1: PartnerCondition; partner2: PartnerCondition };
  goals: SharedGoal[];
  partner1Name: string;
  partner2Name: string;
  profile?: CoupleProfile;
  galleryPhotos?: PhotoItem[];
  onUpdateProfile?: (profile: CoupleProfile) => void;
  onUpdateConditions: (conds: { partner1: PartnerCondition; partner2: PartnerCondition }) => void;
  onUpdateGoals: (goals: SharedGoal[]) => void;
}

const MOOD_OPTIONS = [
  { emoji: '🥰', label: 'Adoring & In Love' },
  { emoji: '🌸', label: 'Cozy & Peaceful' },
  { emoji: '🥺', label: 'Missing You Deeply' },
  { emoji: '⚡', label: 'Energized & Motivated' },
  { emoji: '☕', label: 'Need a Coffee & Hug' },
  { emoji: '😴', label: 'Sleepy & Soft' },
  { emoji: '🎉', label: 'Celebrating Small Wins' },
  { emoji: '🍰', label: 'Craving Sweet Treats' }
];

const MESSAGE_CATEGORIES: RakaMessage['category'][] = [
  'Love Letter',
  'Encouragement',
  'When You Miss Me',
  'Little Reminder',
  'Late Night Note'
];

const GOAL_CATEGORIES: SharedGoal['category'][] = [
  'Romantic Dates',
  'Travel',
  'Life Milestones',
  'Silly Adventures'
];

const DEFAULT_RAKA_MESSAGE: RakaMessage = {
  id: 'msg-primary',
  title: 'To the Most Beautiful Girl in My Universe',
  category: 'Love Letter',
  content:
    'Hey my sweetest Neisha... Whenever today feels a little heavy, or if you ever feel tired and alone, please always remember that you have me right here with you. You are the most breathtaking thing that has ever happened to my life. Eat something delicious, don\'t be too hard on yourself, and always keep that soft, beautiful smile glowing.\n\nI love you to the moon and back, always and forever.',
  date: 'March 2026',
  time: '11:15 PM',
  isPinned: true,
  likes: 28
};

export const StatusAndGoalsSection: React.FC<StatusAndGoalsSectionProps> = ({
  conditions,
  goals,
  partner1Name,
  partner2Name,
  profile,
  galleryPhotos = [],
  onUpdateProfile,
  onUpdateConditions,
  onUpdateGoals
}) => {
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);

  // Modal states for Neisha condition
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [editFormData, setEditFormData] = useState<PartnerCondition | null>(null);

  // Goal modal states
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<SharedGoal | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<SharedGoal['category']>('Romantic Dates');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalNotes, setGoalNotes] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Single Raka Message state
  const [message, setMessage] = useState<RakaMessage>(() => {
    const saved = localStorage.getItem('couple_raka_message');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.title && parsed.content) {
          if (parsed.content.includes('Hai Neisha cantiknya')) {
            return DEFAULT_RAKA_MESSAGE;
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved raka message:', e);
      }
    }
    return DEFAULT_RAKA_MESSAGE;
  });

  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [msgTitle, setMsgTitle] = useState(message.title);
  const [msgCategory, setMsgCategory] = useState<RakaMessage['category']>(message.category);
  const [msgContent, setMsgContent] = useState(message.content);

  useEffect(() => {
    try {
      localStorage.setItem('couple_raka_message', JSON.stringify(message));
    } catch (e) {
      console.error('Failed to persist raka message:', e);
    }
  }, [message]);

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendVirtualLove = (toPartner: string, actionType: string) => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F472B6', '#FB7185', '#E88B96', '#60A5FA', '#DCAE78']
    });

    if (actionType === 'hug') showToast(`Sent a warm, tight virtual hug to ${toPartner}! 🤗`);
    if (actionType === 'kiss') showToast(`Sent a gentle forehead kiss to ${toPartner}! 💋`);
    if (actionType === 'tea') showToast(`Brewed a cup of comfort tea for ${toPartner}! 🍵`);
    if (actionType === 'love') showToast(`Sent infinite heartbeats to ${toPartner}! ❤️`);
  };

  const openEditNeishaCondition = () => {
    setEditFormData({ ...conditions.partner2 });
    setIsEditingCondition(true);
  };

  const handleSaveCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    const updated = {
      ...conditions,
      partner2: {
        ...editFormData,
        lastUpdated: 'Just now'
      }
    };
    onUpdateConditions(updated);
    setIsEditingCondition(false);
    setEditFormData(null);
    showToast(`Updated vibe status for ${partner2Name}! ✨`);
  };

  // Goals Handlers
  const confirmDeleteGoal = () => {
    if (!goalToDelete) return;
    const updated = goals.filter((g) => g.id !== goalToDelete.id);
    onUpdateGoals(updated);
    showToast(`"${goalToDelete.title}" removed from bucket list`);
    setGoalToDelete(null);
  };

  const handleToggleGoal = (id: string) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    if (willBeCompleted) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#38BDF8', '#DCAE78']
      });
      showToast(`Goal unlocked together! 🎉 "${target.title}"`);
    }

    const updated = goals.map((g) =>
      g.id === id
        ? {
            ...g,
            completed: willBeCompleted,
            completedDate: willBeCompleted
              ? new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : undefined
          }
        : g
    );
    onUpdateGoals(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newGoal: SharedGoal = {
      id: `goal-${Date.now()}`,
      title: goalTitle.trim(),
      category: goalCategory,
      completed: false,
      targetDate: goalTargetDate.trim() || 'Someday soon',
      notes: goalNotes.trim()
    };

    onUpdateGoals([...goals, newGoal]);
    setIsAddingGoal(false);
    setGoalTitle('');
    setGoalCategory('Romantic Dates');
    setGoalNotes('');
    setGoalTargetDate('');
    showToast('New shared goal added to our bucket list! 🌟');
  };

  // Single Message Handlers
  const openEditMessageModal = () => {
    setMsgTitle(message.title);
    setMsgCategory(message.category);
    setMsgContent(message.content);
    setIsEditingMessage(true);
  };

  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgContent.trim()) return;

    const updated: RakaMessage = {
      ...message,
      title: msgTitle.trim(),
      category: msgCategory,
      content: msgContent.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessage(updated);
    setIsEditingMessage(false);
    showToast('Message updated with love! 💌');
  };

  const getCategoryBadgeStyle = (cat: RakaMessage['category']) => {
    switch (cat) {
      case 'Love Letter':
        return 'bg-[#372338] text-[#F472B6] border-[#5A3159]';
      case 'Encouragement':
        return 'bg-[#3A3022] text-[#FBBF24] border-[#614E30]';
      case 'When You Miss Me':
        return 'bg-[#1E2E4A] text-[#60A5FA] border-[#2E4A78]';
      case 'Little Reminder':
        return 'bg-[#183329] text-[#34D399] border-[#265744]';
      case 'Late Night Note':
        return 'bg-[#2A2346] text-[#C084FC] border-[#443770]';
      default:
        return 'bg-[#1E2E4A] text-[#CBD5E1] border-[#2E4A78]';
    }
  };

  const forYouBg = profile?.forYouBackgroundImage || DEFAULT_FOR_YOU_BG;
  const isFullPage = profile?.forYouBackgroundMode === 'full';
  const dimming = typeof profile?.forYouDimming === 'number' ? profile.forYouDimming : 65;

  const handleSaveForYouBackground = (image: string, mode: 'banner' | 'full', dimmingPercent: number) => {
    if (profile && onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        forYouBackgroundImage: image,
        forYouBackgroundMode: mode,
        forYouDimming: dimmingPercent
      });
      showToast('For You background photo updated! ✨');
    }
  };

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16243C] text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-[#2E4A78] animate-in slide-in-from-bottom-5 duration-300">
          <Heart className="w-4 h-4 text-[#F472B6] fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PART A: NEISHA'S CONDITION CHECK */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#F472B6] mb-1">
              Personal Vibe Check
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white flex items-center gap-2">
              <span>{partner2Name}&apos;s Condition</span>
            </h3>
          </div>

          <button
            onClick={openEditNeishaCondition}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-[#192A45] hover:bg-[#253D63] border border-[#2D4874] transition-colors cursor-pointer shadow-sm"
            title="Update your vibe"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>Update Vibe</span>
          </button>
        </div>

        {/* Neisha's Primary Condition Card in Deep Navy */}
        <div className="bg-gradient-to-br from-[#192A45] to-[#1E3253] rounded-2xl p-6 sm:p-8 border border-[#2D4874] shadow-lg">
          {/* Top row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#203354] border border-[#2D4874] flex items-center justify-center text-3xl shadow-inner select-none shrink-0">
              {conditions.partner2.mood}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-xl sm:text-2xl font-medium text-white">
                  {partner2Name}
                </h4>
              </div>
              <div className="text-xs sm:text-sm text-[#F472B6] font-medium mt-1">
                {conditions.partner2.moodLabel} · <span className="text-[#94A3B8]">Updated {conditions.partner2.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Energy battery */}
          <div className="mb-6 p-4 rounded-xl bg-[#15233A] border border-[#263E63] shadow-inner">
            <div className="flex items-center justify-between text-xs text-[#CBD5E1] mb-2 font-medium">
              <span className="flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-[#F472B6]" />
                <span>Heart &amp; Energy Battery</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-sm text-[#F472B6]">
                {conditions.partner2.energyLevel}%
              </span>
            </div>
            <div className="w-full bg-[#0F1B2E] h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#EC4899] to-[#F43F5E] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${conditions.partner2.energyLevel}%` }}
              />
            </div>
          </div>

          {/* Thoughts & Cravings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
              <span className="text-[11px] uppercase tracking-wider text-[#93C5FD] font-semibold block mb-1">
                Currently Thinking About
              </span>
              <p className="text-sm text-[#E2E8F0] italic font-serif leading-relaxed">
                &ldquo;{conditions.partner2.thinkingAbout}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15233A] border border-[#263E63]">
              <span className="text-[11px] uppercase tracking-wider text-[#93C5FD] font-semibold block mb-1">
                Currently Craving
              </span>
              <p className="text-sm text-[#E2E8F0] font-medium leading-relaxed">
                {conditions.partner2.craving}
              </p>
            </div>
          </div>

          {/* Send Love Row */}
          <div className="pt-4 border-t border-[#263E63] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">
              Send Love from {partner1Name} to {partner2Name}:
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleSendVirtualLove(partner2Name, 'hug')}
                className="py-1.5 px-3 text-xs rounded-lg bg-[#203354] border border-[#2D4874] hover:bg-[#28406B] text-[#FBCFE8] text-center transition-colors font-medium shadow-xs cursor-pointer"
              >
                Hug 🤗
              </button>
              <button
                onClick={() => handleSendVirtualLove(partner2Name, 'kiss')}
                className="py-1.5 px-3 text-xs rounded-lg bg-[#203354] border border-[#2D4874] hover:bg-[#28406B] text-[#FBCFE8] text-center transition-colors font-medium shadow-xs cursor-pointer"
              >
                Kiss 💋
              </button>
              <button
                onClick={() => handleSendVirtualLove(partner2Name, 'tea')}
                className="py-1.5 px-3 text-xs rounded-lg bg-[#203354] border border-[#2D4874] hover:bg-[#28406B] text-[#FBCFE8] text-center transition-colors font-medium shadow-xs cursor-pointer"
              >
                Tea 🍵
              </button>
              <button
                onClick={() => handleSendVirtualLove(partner2Name, 'love')}
                className="py-1.5 px-3 text-xs rounded-lg bg-[#203354] border border-[#2D4874] hover:bg-[#28406B] text-[#FBCFE8] text-center transition-colors font-medium shadow-xs cursor-pointer"
              >
                Love ❤️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PART B: MESSAGES FROM RAKA (SINGLE BEAUTIFUL PARCHMENT IN NAVY SANCTUARY) */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F472B6] mb-1">
              <Mail className="w-3.5 h-3.5 text-[#F472B6]" />
              <span>Dedicated from {partner1Name} to {partner2Name}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl text-white">
              Messages from {partner1Name}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
              A little space for the things I want to say to you
            </p>
          </div>

          <button
            onClick={openEditMessageModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] transition-colors self-start sm:self-end shadow-md cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Message from {partner1Name}</span>
          </button>
        </div>

        {/* Single Featured Love Letter / Message Bubble in Deep Navy Glass */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#16253D] to-[#1C3050] border-2 border-[#2D4A77] p-6 sm:p-9 shadow-xl">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#203354] border border-[#385A90] text-[#93C5FD] text-[11px] font-semibold shadow-xs">
            <Pin className="w-3 h-3 text-[#F472B6]" />
            <span>Featured Letter</span>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${getCategoryBadgeStyle(message.category)}`}>
                {message.category}
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                {message.date} {message.time ? `· ${message.time}` : ''}
              </span>
            </div>

            <h4 className="font-serif text-xl sm:text-2xl text-white mb-3 font-medium">
              {message.title}
            </h4>

            <p className="font-serif text-sm sm:text-base text-[#E2E8F0] leading-relaxed whitespace-pre-line italic">
              &ldquo;{message.content}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* PART C: OUR SHARED GOALS & BUCKET LIST */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F472B6] mb-1">
              <span>Together Towards Tomorrow</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Our Shared Bucket List &amp; Goals
            </h3>
          </div>

          <button
            onClick={() => setIsAddingGoal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white bg-[#253D66] hover:bg-[#325287] border border-[#3B5F99] transition-colors self-start sm:self-end cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Dream / Goal</span>
          </button>
        </div>

        {/* Progress Tracker Banner */}
        <div className="bg-[#192A45] rounded-2xl p-5 sm:p-6 border border-[#2D4874] mb-8 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F472B6]" />
              <span className="font-medium text-sm text-white">
                {completedGoalsCount} of {goals.length} Dreams Accomplished
              </span>
            </div>
            <span className="font-mono tabular-nums text-sm font-bold text-[#F472B6]">
              {progressPercent}% Completed
            </span>
          </div>

          <div className="w-full bg-[#15233A] h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#DCAE78] to-[#F472B6] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Goals Checklist Grid - Clean display without empty placeholder box */}
        {goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className={`group cursor-pointer rounded-xl p-4 sm:p-5 border transition-all duration-200 flex items-start gap-4 ${
                  goal.completed
                    ? 'bg-[#15233A]/80 border-[#223757] opacity-80'
                    : 'bg-[#192A45] border-[#2D4874] hover:border-[#F472B6] hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 transition-transform group-hover:scale-110 ${
                    goal.completed ? 'text-[#F472B6]' : 'text-[#64748B]'
                  }`}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  {(goal.targetDate || (goal.completed && goal.completedDate)) && (
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-[#94A3B8]">
                      {goal.targetDate && (
                        <span className="font-medium text-[#94A3B8]">Target: {goal.targetDate}</span>
                      )}
                      {goal.targetDate && goal.completed && goal.completedDate && (
                        <span aria-hidden="true">·</span>
                      )}
                      {goal.completed && goal.completedDate && (
                        <span className="text-[#F472B6] font-medium">Achieved on {goal.completedDate}</span>
                      )}
                    </div>
                  )}

                  <h4
                    className={`text-sm sm:text-base font-medium transition-colors ${
                      goal.completed
                        ? 'line-through text-[#94A3B8]'
                        : 'text-white group-hover:text-[#FBCFE8]'
                    }`}
                  >
                    {goal.title}
                  </h4>

                  {goal.notes && (
                    <p className="text-xs text-[#CBD5E1] mt-1 italic font-serif">
                      &ldquo;{goal.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGoalToDelete(goal);
                  }}
                  className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-[#94A3B8] hover:text-[#F472B6] hover:bg-[#203354] rounded-lg transition-all shrink-0 cursor-pointer self-start"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Neisha Condition Modal */}
      {isEditingCondition && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#192A45] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2D4874] my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
              <h3 className="font-serif text-2xl text-white">
                Update {partner2Name}&apos;s Vibe
              </h3>
              <button
                onClick={() => setIsEditingCondition(false)}
                className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCondition} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Current Mood Emoji &amp; Feeling
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {MOOD_OPTIONS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() =>
                        setEditFormData({
                          ...editFormData,
                          mood: item.emoji,
                          moodLabel: item.label
                        })
                      }
                      className={`p-2 rounded-lg text-xl flex items-center justify-center border transition-all cursor-pointer ${
                        editFormData.mood === item.emoji
                          ? 'border-[#F472B6] bg-[#2D4874] scale-105'
                          : 'border-[#263E63] bg-[#15233A] hover:bg-[#203354]'
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editFormData.moodLabel}
                  onChange={(e) => setEditFormData({ ...editFormData, moodLabel: e.target.value })}
                  placeholder="Mood description"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-[#CBD5E1] mb-1">
                  <span>Heart &amp; Energy Battery</span>
                  <span className="font-mono tabular-nums font-bold text-[#F472B6]">
                    {editFormData.energyLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={editFormData.energyLevel}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, energyLevel: Number(e.target.value) })
                  }
                  className="w-full accent-[#F472B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  What are you thinking about right now?
                </label>
                <textarea
                  rows={2}
                  value={editFormData.thinkingAbout}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, thinkingAbout: e.target.value })
                  }
                  placeholder="e.g. Dreaming about our next weekend date together..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  What are you craving?
                </label>
                <input
                  type="text"
                  value={editFormData.craving}
                  onChange={(e) => setEditFormData({ ...editFormData, craving: e.target.value })}
                  placeholder="e.g. Warm hugs, matcha latte, sweet boba, ice cream"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
                <button
                  type="button"
                  onClick={() => setIsEditingCondition(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] rounded-lg transition-colors cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Single Raka Message Modal */}
      {isEditingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#192A45] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#2D4874] my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
              <h3 className="font-serif text-2xl text-white">
                Edit Message from {partner1Name}
              </h3>
              <button
                onClick={() => setIsEditingMessage(false)}
                className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Category Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {MESSAGE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMsgCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        msgCategory === cat
                          ? 'bg-[#F472B6] text-white border-[#F472B6]'
                          : 'bg-[#15233A] text-[#CBD5E1] border-[#2D4874] hover:bg-[#203354]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Message Title / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. To the Most Beautiful Girl in My Universe"
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Words from {partner1Name} for {partner2Name}
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write your heartfelt message, reminder, or words of love for Neisha..."
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
                <button
                  type="button"
                  onClick={() => setIsEditingMessage(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] rounded-lg transition-colors cursor-pointer"
                >
                  Save Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Goal Confirmation Modal */}
      {goalToDelete && (
        <div
          onClick={() => setGoalToDelete(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#192A45] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#2D4874] text-center animate-in zoom-in-95 duration-150 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-[#203354] text-[#F472B6] flex items-center justify-center mx-auto mb-4 border border-[#2D4874]">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-white mb-2">
              Delete Shared Goal?
            </h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed mb-6">
              Are you sure you want to delete &ldquo;{goalToDelete.title}&rdquo;?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setGoalToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#CBD5E1] bg-[#15233A] border border-[#2D4874] hover:bg-[#203354] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteGoal}
                className="px-5 py-2 rounded-full text-xs font-medium text-white bg-[#E11D48] hover:bg-[#BE123C] shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dream / Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#192A45] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#2D4874] my-8 animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#263E63] mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F472B6]" />
                <h3 className="font-serif text-2xl text-white">
                  Add New Shared Dream
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="p-1 text-[#94A3B8] hover:text-white rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGoalCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        goalCategory === cat
                          ? 'bg-[#F472B6] text-white border-[#F472B6]'
                          : 'bg-[#15233A] text-[#CBD5E1] border-[#2D4874] hover:bg-[#203354]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  What is our dream or goal? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Watch the sunset together in Kyoto, Cook a cozy dinner"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Target Date or Season (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer 2026, Next Month, Someday Soon"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Sweet Notes or Motivation (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Little notes on why this means so much to both of us..."
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#2D4874] bg-[#15233A] text-white placeholder-[#64748B] focus:border-[#F472B6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263E63]">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!goalTitle.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#F472B6] hover:bg-[#E11D48] disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bucket List</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Background Photos Modal for "For You" page */}
      <ChangeBackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        currentImage={forYouBg}
        currentMode={profile?.forYouBackgroundMode || 'full'}
        currentDimming={dimming}
        galleryPhotos={galleryPhotos}
        onSaveBackground={handleSaveForYouBackground}
      />
    </div>
  );
};
