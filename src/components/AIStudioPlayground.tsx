import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { MaarifTask } from '../types';

interface Props {
  onAddCustomTask: (task: MaarifTask) => void;
}

export const AIStudioPlayground: React.FC<Props> = ({ onAddCustomTask }) => {
  const [taskType, setTaskType] = useState<'mil' | 'round' | 'mental' | 'pattern'>('mil');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'generator'>('generator');

  const systemPrompt = `Sen Türkiye Yüzyılı Maarif Modeli ilkelerine uygun tasarlanmış 5. sınıf matematik doğal sayılar oyun yöneticisisin.
Öğrenciye asla doğrudan cevap verme; Sokratik soru teknikleriyle basamak, bölük ve zihinden işlem ipuçları sun.
Soruları en çok dokuz basamaklı doğal sayılar, bölükler, basamak değeri ve tahmin kazanımlarından seç.
Pedagojik Filtre: Yapay zeka yönlendirmeleri, öğrencilerin günlük yaşam verileriyle matematiksel bağ kurmasını ve hata analizi yapmasını sağlar.`;

  const handleGenerate = async () => {
    setIsGenerating(true);
    playSound('click');
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType, difficulty }),
      });
      const data = await res.json();
      setGeneratedQuestion(data.question);
      playSound('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAsQuest = () => {
    if (!generatedQuestion) return;
    const newTask: MaarifTask = {
      id: `ai-task-${Date.now()}`,
      type: taskType,
      questNumber: 99,
      title: generatedQuestion.title || 'Özel Maarif Modeli Görevi',
      subTitle: generatedQuestion.valueBadge || 'Yapay Zeka Destekli Problem',
      contextText: generatedQuestion.context || 'Günlük yaşam ve erdem temelli matematik problemi.',
      storyImage: 'landmark',
      questionText: generatedQuestion.questionText || '',
      correctAnswer: generatedQuestion.correctAnswer || '',
      options: generatedQuestion.options || ['A', 'B', 'C', 'D'],
      explanation: generatedQuestion.explanation || '',
      socraticClues: [
        generatedQuestion.socraticClue || 'Basamakları ve bölükleri sağdan sola inceleyelim.',
      ],
      valueTitle: generatedQuestion.valueBadge || 'Matematiksel Düşünme',
      valueDescription: 'Sayılar arasındaki ilişkileri keşfederek günlük hayatta problem çözme becerisi.',
      targetCompetency: 'Türkiye Yüzyılı Maarif Modeli 5. Sınıf Doğal Sayılar Kazanımı',
      interactiveTool: taskType === 'mil' ? 'abacus' : taskType === 'round' ? 'rounding' : taskType === 'mental' ? 'mental' : 'mosaic',
    };

    onAddCustomTask(newTask);
    playSound('badge');
    alert('Harika! Yeni yapay zeka görevi oyun listesine eklendi. "Maceraya Başla" sekmesinden oynayabilirsiniz.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-3 pb-3">
        <button
          onClick={() => { setActiveTab('generator'); playSound('click'); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'generator'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>✨</span>
          <span>Maarif Soru Üreteci (Gemini 3.8 Flash)</span>
        </button>
        <button
          onClick={() => { setActiveTab('prompt'); playSound('click'); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'prompt'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>📋</span>
          <span>AI Studio Sistem Promptu (Slayt 3)</span>
        </button>
      </div>

      {activeTab === 'prompt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-xl text-sky-400">
              ⚙️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Google AI Studio Sistem Talimatı (Prompt Mimarisi)
              </h3>
              <p className="text-xs text-slate-400">
                Maarif Modeli pedagojisini uygulayan yapay zeka denetleyici talimatı
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
              Sistem Talimatı İçeriği:
            </label>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {systemPrompt}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-900/50 space-y-1">
              <span className="font-bold text-sky-300">🎯 Sokratik Yöntem:</span>
              <p className="text-slate-300">
                Öğrenciye doğrudan "Cevap 447" demek yerine, "Milyonlar bölüğünde hangi 3 basamaklı sayı var?" diye sorar.
              </p>
            </div>
            <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-900/50 space-y-1">
              <span className="font-bold text-emerald-300">🌱 Erdem ve Değer Entegrasyonu:</span>
              <p className="text-slate-300">
                Soruları soyut sayılardan çıkarıp müze koruma, kitap bağışı ve esnaf dayanışması bağlamlarına yerleştirir.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'generator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>🪄</span>
                Öğretmenler & Sınıf İçin Maarif Problem Üreteci
              </h3>
              <p className="text-xs text-slate-400">
                5. Sınıf kazanımlarına uygun, değer ve erdem odaklı yeni matematik görevleri üretin.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Kazanım / Konu Alanı:</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="mil">Görev 1: Milyonlar Bölüğü & Tarihi Miras Analizi</option>
                <option value="round">Görev 2: En Yakın Yüzlüğe Yuvarlama & Tasarruf</option>
                <option value="mental">Görev 3: Zihinden İşlem Stratejileri & Kermes</option>
                <option value="pattern">Görev 4: Antik Mozaik Sayı Örüntüleri</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Zorluk Seviyesi:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { setDifficulty(lvl); playSound('click'); }}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition ${
                      difficulty === lvl
                        ? 'bg-sky-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {lvl === 'easy' ? 'Kolay' : lvl === 'medium' ? 'Orta' : 'Zorlayıcı'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">🌀</span>
                <span>Yapay Zeka Maarif Problemi Hazırlıyor...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Yeni Maarif Problemi Üret</span>
              </>
            )}
          </button>

          {/* Generated Question Display */}
          {generatedQuestion && (
            <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-sky-800/80 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-sky-950 text-sky-300 border border-sky-800 px-3 py-1 rounded-full">
                  {generatedQuestion.valueBadge || 'Maarif Kazanımı'}
                </span>
                <span className="text-xs text-slate-400">Üretildi</span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                  {generatedQuestion.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  "{generatedQuestion.context}"
                </p>
              </div>

              <div className="bg-sky-950/40 p-4 rounded-xl border border-sky-900/60">
                <p className="text-sm sm:text-base font-bold text-sky-200">
                  {generatedQuestion.questionText}
                </p>
              </div>

              {/* Options */}
              {generatedQuestion.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedQuestion.options.map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <span className="font-bold text-sky-400">
                        {String.fromCharCode(65 + idx)})
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Socratic Clue preview */}
              {generatedQuestion.socraticClue && (
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                  <strong>💡 Sokratik AI İpucu:</strong> {generatedQuestion.socraticClue}
                </div>
              )}

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleAddAsQuest}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Bu Soruyu Oyuna Ekle ve Oyna</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
