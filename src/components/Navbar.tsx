import React from 'react';
import { Badge } from '../types';
import { playSound } from '../utils/audio';

interface Props {
  activeTab: 'game' | 'presentation' | 'studio' | 'badges';
  onTabChange: (tab: 'game' | 'presentation' | 'studio' | 'badges') => void;
  score: number;
  badges: Badge[];
  onOpenSocratic: () => void;
  onOpenCertificate: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  score,
  badges,
  onOpenSocratic,
  onOpenCertificate,
}) => {
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('presentation')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-sky-600/30 border border-sky-400/40">
            🇹🇷
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
                TÜRKİYE YÜZYILI MAARİF MODELİ
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-800 hidden sm:inline-block">
                5. Sınıf Matematik
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Sayılar Ülkesi</span>
              <span className="text-xs font-normal text-slate-400">| Dijital Macera & AI Studio</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => { onTabChange('game'); playSound('click'); }}
            className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'game'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🎮</span>
            <span>Macera Oyunu</span>
          </button>

          <button
            onClick={() => { onTabChange('presentation'); playSound('click'); }}
            className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'presentation'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📽️</span>
            <span>Sunum & Akıllı Tahta (9 Slayt)</span>
          </button>

          <button
            onClick={() => { onTabChange('studio'); playSound('click'); }}
            className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚙️</span>
            <span>AI Studio Laboratuvarı</span>
          </button>

          <button
            onClick={() => { onTabChange('badges'); playSound('click'); }}
            className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🏆</span>
            <span>Rozetler</span>
          </button>
        </nav>

        {/* User Stats & Socratic AI Button */}
        <div className="flex items-center gap-2.5">
          {/* Score Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
            <span>⭐</span>
            <span>{score} Puan</span>
          </div>

          {/* Badges count */}
          <div
            onClick={() => onTabChange('badges')}
            className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-300 cursor-pointer hover:border-sky-700 transition"
          >
            <span>🎖️</span>
            <span>{unlockedBadgesCount} / {badges.length} Rozet</span>
          </div>

          {/* Socratic Mentor Action Button */}
          <button
            onClick={() => { onOpenSocratic(); playSound('hint'); }}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            title="Sokratik Bilge Rehbere Danış"
          >
            <span>🧙‍♂️</span>
            <span className="hidden sm:inline">Bilge Rehber</span>
          </button>

          {/* Certificate Action Button */}
          <button
            onClick={() => { onOpenCertificate(); playSound('badge'); }}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition flex items-center gap-1"
            title="Maarif Yetkinlik Belgesini Gör"
          >
            <span>🎓</span>
            <span className="hidden md:inline">Belge</span>
          </button>
        </div>
      </div>
    </header>
  );
};
