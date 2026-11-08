import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeCustomizerTab } from './ThemeCustomizerTab';
import { TimelineEditorTab } from './TimelineEditorTab';
import { ReasonsEditorTab } from './ReasonsEditorTab';
import { GalleryEditorTab } from './GalleryEditorTab';
import { NotesEditorTab } from './NotesEditorTab';
import { BucketListEditorTab } from './BucketListEditorTab';
import { QuizEditorTab } from './QuizEditorTab';
import { GfInboxTab } from './GfInboxTab';
import { Palette, Calendar, Heart, Image, Mail, Compass, HelpCircle, MessageCircle, LogOut, X, Settings } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { logoutAdmin } = useAuth();
  const { settings } = useTheme();
  const [activeTab, setActiveTab] = useState('design');

  const tabs = [
    { id: 'design', label: 'Design & Themes', icon: Palette },
    { id: 'timeline', label: 'Love Story', icon: Calendar },
    { id: 'reasons', label: '100 Reasons', icon: Heart },
    { id: 'gallery', label: 'Photo Gallery', icon: Image },
    { id: 'notes', label: 'Love Letters', icon: Mail },
    { id: 'bucketlist', label: 'Bucket List', icon: Compass },
    { id: 'quiz', label: 'Quiz Trivia', icon: HelpCircle },
    { id: 'inbox', label: 'GF Love Jar Inbox', icon: MessageCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xl flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-white/90 dark:bg-rose-950/90 border-b border-pink-200 dark:border-rose-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md">
            <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-rose-950 dark:text-rose-100">
              Master Admin Control Panel
            </h2>
            <p className="text-xs font-semibold text-rose-500">
              Customizing Site For {settings.partner_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logoutAdmin();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 font-bold text-xs hover:bg-rose-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Exit Admin</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-pink-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-3 space-y-2">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-rose-950/60 border border-pink-200 dark:border-rose-800 space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                      : 'text-rose-900 dark:text-rose-200 hover:bg-pink-100 dark:hover:bg-rose-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="md:col-span-9 bg-white/90 dark:bg-rose-950/80 p-6 sm:p-8 rounded-3xl border border-pink-200 dark:border-rose-800 shadow-2xl space-y-6">
          {activeTab === 'design' && <ThemeCustomizerTab />}
          {activeTab === 'timeline' && <TimelineEditorTab />}
          {activeTab === 'reasons' && <ReasonsEditorTab />}
          {activeTab === 'gallery' && <GalleryEditorTab />}
          {activeTab === 'notes' && <NotesEditorTab />}
          {activeTab === 'bucketlist' && <BucketListEditorTab />}
          {activeTab === 'quiz' && <QuizEditorTab />}
          {activeTab === 'inbox' && <GfInboxTab />}
        </div>
      </div>
    </div>
  );
};
