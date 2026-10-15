import React, { useState } from 'react';
import { MaarifTask, Badge } from '../types';
import { AbacusPlaceValue } from './AbacusPlaceValue';
import { RoundingVisualizer } from './RoundingVisualizer';
import { MentalMathStudio } from './MentalMathStudio';
import { MosaicPatternLab } from './MosaicPatternLab';
import { playSound } from '../utils/audio';

interface Props {
  tasks: MaarifTask[];
  activeTaskId: string;
  onSelectTask: (id: string) => void;
  onQuestCompleted: (questNumber: number, badgeId: string) => void;
  onOpenSocraticMentor: (title: string, question: string, clues: string[]) => void;
  onOpenCertificate: () => void;
  badges: Badge[];
}

export const GameView: React.FC<Props> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onQuestCompleted,
  onOpenSocraticMentor,
  onOpenCertificate,
  badges,
}) => {
  const currentTaskIndex = tasks.findIndex((t) => t.id === activeTaskId || t.type === activeTaskId);
  const task = tasks[currentTaskIndex >= 0 ? currentTaskIndex : 0];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'problem' | 'tool'>('tool');

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    playSound('click');
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const isRight = selectedOption.trim() === String(task.correctAnswer).trim();
    setIsAnswered(true);
    setIsCorrect(isRight);

    if (isRight) {
      playSound('success');
      if (!completedTaskIds.includes(task.id)) {
        setCompletedTaskIds((prev) => [...prev, task.id]);
        const badgeMap: Record<string, string> = {
          'task-1': 'badge-1',
          'task-2': 'badge-2',
          'task-3': 'badge-3',
          'task-4': 'badge-4',
        };
        const badgeId = badgeMap[task.id] || 'badge-5';
        onQuestCompleted(task.questNumber, badgeId);
      }
    } else {
      playSound('error');
    }
  };

  const handleNextQuest = () => {
    const nextIdx = (currentTaskIndex + 1) % tasks.length;
    onSelectTask(tasks[nextIdx].id);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    playSound('click');
  };

  const allCoreCompleted = tasks
    .slice(0, 4)
    .every((t) => completedTaskIds.includes(t.id));

  return (
    <div className="w-full space-y-6">
      {/* Quests Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              Sayılar Ülkesi Macera Haritası
            </h3>
            <span className="text-xs text-sky-400 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-800">
              {completedTaskIds.length} / {tasks.length} Görev Tamamlandı
            </span>
          </div>

          {allCoreCompleted && (
            <button
              onClick={onOpenCertificate}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 animate-bounce"
            >
              <span>🎓</span>
              <span>Yetkinlik Belgeni Al!</span>
            </button>
          )}
        </div>

        {/* Quest Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tasks.map((t, idx) => {
            const isDone = completedTaskIds.includes(t.id);
            const isCurrent = t.id === task.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTask(t.id);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  playSound('click');
                }}
                className={`p-2.5 sm:p-3 rounded-xl border transition text-left flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-sky-950/70 border-sky-400 text-white shadow-lg ring-1 ring-sky-500'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="truncate">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {idx < 4 ? `GÖREV ${idx + 1}` : 'ÖZEL GÖREV'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold truncate">
                    {t.title.split(':')[0]}
                  </div>
                </div>
                <span className="text-base sm:text-lg flex-shrink-0">
                  {isDone ? '✅' : idx === 0 ? '🏛️' : idx === 1 ? '📚' : idx === 2 ? '⚡' : '🧩'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Task Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
        {/* Task Header & Context */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800 text-xs font-bold rounded-full">
                {task.questNumber <= 4 ? `Görev ${task.questNumber}` : 'Yapay Zeka Özel Görevi'}
              </span>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-full">
                {task.valueTitle}
              </span>
            </div>

            <button
              onClick={() =>
                onOpenSocraticMentor(task.title, task.questionText, task.socraticClues)
              }
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>🧙‍♂️</span>
              <span>Bilge Rehberden İpucu İste</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-100">
            {task.title}
          </h2>
          <h3 className="text-sm sm:text-base font-semibold text-sky-400">
            {task.subTitle}
          </h3>

          {/* Context Narrative */}
          <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/90 text-xs sm:text-sm text-slate-300 leading-relaxed italic flex gap-3 items-start">
            <span className="text-xl flex-shrink-0">📜</span>
            <div>
              <p>"{task.contextText}"</p>
              <div className="mt-2 text-[11px] text-slate-400 font-normal not-italic">
                <strong>Yetkinlik Hedefi:</strong> {task.targetCompetency}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Math Tool Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              🛠️ İNTERAKTİF MATEMATİK DİJİTAL ATÖLYESİ
            </span>
            <span className="text-xs text-sky-400">
              Verileri deneyerek kuralı keşfedin
            </span>
          </div>

          {task.interactiveTool === 'abacus' && (
            <AbacusPlaceValue initialNumber="342105008" />
          )}
          {task.interactiveTool === 'rounding' && (
            <RoundingVisualizer initialValue={4876} />
          )}
          {task.interactiveTool === 'mental' && (
            <MentalMathStudio initialBase={450} initialMultiplier={50} />
          )}
          {task.interactiveTool === 'mosaic' && (
            <MosaicPatternLab initialStart={5} initialDiff={7} />
          )}
        </div>

        {/* Question & Interactive Response Section */}
        <div className="bg-slate-950/90 p-5 sm:p-7 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
              ?
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
                SORU KAZANIMI
              </span>
              <p className="text-base sm:text-lg font-bold text-white leading-snug">
                {task.questionText}
              </p>
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {task.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = opt.trim() === String(task.correctAnswer).trim();

              let optClass = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isSelected && !isAnswered) {
                optClass = 'bg-sky-950 border-sky-400 text-sky-200 ring-2 ring-sky-500/40';
              } else if (isAnswered) {
                if (isOptionCorrect) {
                  optClass = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isSelected && !isOptionCorrect) {
                  optClass = 'bg-rose-950/90 border-rose-400 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left font-semibold text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isOptionCorrect && (
                    <span className="text-emerald-400 text-sm font-bold">✓ Doğru</span>
                  )}
                  {isAnswered && isSelected && !isOptionCorrect && (
                    <span className="text-rose-400 text-sm font-bold">✗ Yanlış</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Button & Feedback */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>Cevabı Onayla</span>
                <span>➔</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 w-full justify-between">
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm flex-1 ${
                    isCorrect
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-800 text-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <div>
                      <div className="font-bold flex items-center gap-1.5 text-emerald-300 mb-1">
                        <span>🎉</span>
                        <span>Harika Çözüm! Yetkinlik Rozeti Kazanıldı!</span>
                      </div>
                      <p className="text-emerald-200/90 text-xs leading-relaxed">
                        {task.explanation}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
                        <span>💡</span>
                        <span>Pes etmek yok! Sokratik ipucuna bakalım:</span>
                      </div>
                      <p className="text-rose-200/90 text-xs leading-relaxed">
                        {task.socraticClues[0] || 'Basamak tablosunu inceleyelim.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isCorrect && (
                    <button
                      onClick={() => {
                        setIsAnswered(false);
                        setSelectedOption(null);
                        playSound('click');
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
                    >
                      Tekrar Dene
                    </button>
                  )}
                  <button
                    onClick={handleNextQuest}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    <span>Sıradaki Göreve Geç</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
