/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_TASKS, INITIAL_BADGES } from './data/maarifContent';
import { MaarifTask, Badge } from './types';
import { Navbar } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { GameView } from './components/GameView';
import { AIStudioPlayground } from './components/AIStudioPlayground';
import { BadgesView } from './components/BadgesView';
import { SocraticMentorModal } from './components/SocraticMentorModal';
import { CertificateModal } from './components/CertificateModal';
import { playSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'presentation' | 'studio' | 'badges'>('presentation');
  const [tasks, setTasks] = useState<MaarifTask[]>(INITIAL_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<string>('task-1');
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [score, setScore] = useState<number>(0);

  // Socratic Mentor Modal State
  const [isSocraticOpen, setIsSocraticOpen] = useState(false);
  const [socraticContext, setSocraticContext] = useState({
    title: '5. Sınıf Doğal Sayılar',
    question: 'Bölükler, basamaklar ve zihinden işlemler.',
    clues: [] as string[],
  });

  // Certificate Modal State
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const handleQuestCompleted = (questNumber: number, badgeId: string) => {
    setScore((prev) => prev + 25);
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b))
    );

    // If 4 core quests completed, unlock the grand champion badge
    const currentCompleted = badges.filter((b) => b.unlocked).length + 1;
    if (currentCompleted >= 4) {
      setBadges((prev) =>
        prev.map((b) => (b.id === 'badge-5' ? { ...b, unlocked: true } : b))
      );
    }
  };

  const handleOpenSocratic = (
    title = '5. Sınıf Doğal Sayılar',
    question = 'Bölükler ve zihinden işlemler',
    clues: string[] = []
  ) => {
    setSocraticContext({ title, question, clues });
    setIsSocraticOpen(true);
  };

  const handleGoToTask = (taskIdOrType: string) => {
    const matched = tasks.find((t) => t.id === taskIdOrType || t.type === taskIdOrType);
    if (matched) {
      setActiveTaskId(matched.id);
    }
    setActiveTab('game');
    playSound('click');
  };

  const handleAddCustomTask = (newTask: MaarifTask) => {
    setTasks((prev) => [...prev, newTask]);
    setActiveTaskId(newTask.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        score={score}
        badges={badges}
        onOpenSocratic={() => handleOpenSocratic()}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'presentation' && (
          <PresentationView
            onGoToTask={handleGoToTask}
            onOpenSocraticMentor={(title, q) => handleOpenSocratic(title, q)}
          />
        )}

        {activeTab === 'game' && (
          <GameView
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectTask={setActiveTaskId}
            onQuestCompleted={handleQuestCompleted}
            onOpenSocraticMentor={handleOpenSocratic}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            badges={badges}
          />
        )}

        {activeTab === 'studio' && (
          <AIStudioPlayground onAddCustomTask={handleAddCustomTask} />
        )}

        {activeTab === 'badges' && (
          <BadgesView
            badges={badges}
            score={score}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onGoToTask={handleGoToTask}
          />
        )}
      </main>

      {/* Floating Socratic AI Mentor Button (Available across all tabs) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            playSound('hint');
            handleOpenSocratic();
          }}
          className="group px-4 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-2.5 transition active:scale-95 border border-sky-400/40"
          title="Sokratik Bilge Rehberi Aç"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🧙‍♂️</span>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-extrabold leading-none">Bilge Rehber</div>
            <div className="text-[10px] text-sky-200/90 leading-tight">Sokratik AI İpucu</div>
          </div>
        </button>
      </div>

      {/* Socratic Mentor Chat & Hints Modal */}
      <SocraticMentorModal
        isOpen={isSocraticOpen}
        onClose={() => setIsSocraticOpen(false)}
        currentTaskTitle={socraticContext.title}
        currentQuestion={socraticContext.question}
        defaultClues={socraticContext.clues}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName="5. Sınıf Öğrencisi"
        score={score}
        badges={badges}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            Türkiye Yüzyılı Maarif Modeli • 5. Sınıf Matematik Dersi Sayılar Ülkesi & Google AI Studio Tasarımı
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('presentation')} className="hover:text-slate-300">
              Akıllı Tahta Sunumu
            </button>
            <button onClick={() => setActiveTab('game')} className="hover:text-slate-300">
              Macera Haritası
            </button>
            <button onClick={() => setActiveTab('studio')} className="hover:text-slate-300">
              AI Studio Prompt
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
