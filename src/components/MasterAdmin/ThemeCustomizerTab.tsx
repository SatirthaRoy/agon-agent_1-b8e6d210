import React, { useState } from 'react';
import { useTheme, THEMES } from '../../contexts/ThemeContext';
import { Palette, Eye, ArrowUp, ArrowDown, Check, Save, Sparkles } from 'lucide-react';

export const ThemeCustomizerTab: React.FC = () => {
  const { settings, updateSettings } = useTheme();
  const [formData, setSettingsState] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleChange = (key: string, value: any) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  };

  const handleComponentToggle = (compKey: string) => {
    setSettingsState((prev) => ({
      ...prev,
      enabled_components: {
        ...prev.enabled_components,
        [compKey as keyof typeof prev.enabled_components]:
          !prev.enabled_components[compKey as keyof typeof prev.enabled_components],
      },
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...formData.section_order];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= order.length) return;

    const temp = order[index];
    order[index] = order[targetIdx];
    order[targetIdx] = temp;

    setSettingsState((prev) => ({ ...prev, section_order: order }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    try {
      await updateSettings(formData);
      setSavedMsg('Settings saved successfully! ✨');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const componentLabels: Record<string, string> = {
    hero: 'Hero Header & Welcome',
    plushie: '3D Heart Plushie Interactive Scene',
    countdown: 'Anniversary & Days Together Counter',
    timeline: 'Our Love Story Milestones',
    reasons: '100 Reasons Why I Love You Cards',
    gallery: 'Photo Memory Gallery',
    notes: 'Secret Love Letters',
    bucketlist: 'Couple Bucket List Checklist',
    quiz: 'Couples Knowledge Quiz',
    lovejar: 'Love Jar Message Board',
    music: 'Romantic Background Music Player',
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Save Button Header */}
      <div className="flex items-center justify-between bg-white dark:bg-rose-950 p-4 rounded-2xl border border-pink-200 dark:border-rose-800 shadow-sm sticky top-20 z-30">
        <h3 className="text-lg font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-500" />
          <span>Site Design & Master Customization</span>
        </h3>

        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-xs font-bold text-emerald-600 animate-pulse">{savedMsg}</span>}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* 1. Romantic Color Theme Selector */}
      <div className="bg-white/80 dark:bg-rose-950/60 p-6 rounded-3xl border border-pink-200 dark:border-rose-800 space-y-4">
        <h4 className="text-base font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Select Romantic Color Theme</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(THEMES).map((t) => {
            const isSelected = formData.theme_id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => handleChange('theme_id', t.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 dark:bg-rose-900/60 shadow-md ring-2 ring-pink-400'
                    : 'border-pink-200 dark:border-rose-800 hover:border-pink-300'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm text-rose-950 dark:text-rose-100">{t.name}</h5>
                  <span className="text-[10px] text-rose-500">Theme ID: {t.id}</span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Text & Customization Branding */}
      <div className="bg-white/80 dark:bg-rose-950/60 p-6 rounded-3xl border border-pink-200 dark:border-rose-800 space-y-4">
        <h4 className="text-base font-bold text-rose-950 dark:text-rose-100">Personal Names & Text Customization</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Girlfriend's Name / Nickname</label>
            <input
              type="text"
              value={formData.partner_name}
              onChange={(e) => handleChange('partner_name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Your Name / Boyfriend</label>
            <input
              type="text"
              value={formData.user_name}
              onChange={(e) => handleChange('user_name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Hero Title Banner</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Hero Subtitle</label>
            <textarea
              rows={2}
              value={formData.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Anniversary Start Date</label>
            <input
              type="date"
              value={formData.anniversary_date ? formData.anniversary_date.split('T')[0] : ''}
              onChange={(e) => handleChange('anniversary_date', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Secret Love Letter Lock Code</label>
            <input
              type="text"
              value={formData.secret_code}
              onChange={(e) => handleChange('secret_code', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm font-semibold"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-rose-700 dark:text-rose-300">Background MP3 Music Track URL</label>
            <input
              type="text"
              value={formData.bg_music_url || ''}
              onChange={(e) => handleChange('bg_music_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. Component Visibility Toggles & Order */}
      <div className="bg-white/80 dark:bg-rose-950/60 p-6 rounded-3xl border border-pink-200 dark:border-rose-800 space-y-4">
        <h4 className="text-base font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Eye className="w-4 h-4 text-pink-500" />
          <span>Website Components Visibility & Section Order</span>
        </h4>

        <div className="space-y-3">
          {formData.section_order.map((key, idx) => {
            const isEnabled = formData.enabled_components[key as keyof typeof formData.enabled_components];

            return (
              <div
                key={key}
                className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-rose-900/50 border border-pink-200 dark:border-rose-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-rose-900 text-pink-600 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-rose-950 dark:text-rose-100">
                    {componentLabels[key] || key}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleComponentToggle(key)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isEnabled
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {isEnabled ? 'Enabled ✅' : 'Hidden ❌'}
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, 'up')}
                    className="p-1.5 rounded-lg bg-pink-100 dark:bg-rose-900 text-rose-700 disabled:opacity-30 hover:bg-pink-200"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={idx === formData.section_order.length - 1}
                    onClick={() => handleMoveSection(idx, 'down')}
                    className="p-1.5 rounded-lg bg-pink-100 dark:bg-rose-900 text-rose-700 disabled:opacity-30 hover:bg-pink-200"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
};
