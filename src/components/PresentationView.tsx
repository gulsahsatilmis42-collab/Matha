import React, { useState, useEffect } from 'react';
import { PRESENTATION_SLIDES } from '../data/maarifContent';
import { playSound, speakTurkish } from '../utils/audio';

interface Props {
  onGoToTask: (taskId: string) => void;
  onOpenSocraticMentor: (title: string, question: string) => void;
}

export const PresentationView: React.FC<Props> = ({
  onGoToTask,
  onOpenSocraticMentor,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [teamScores, setTeamScores] = useState({ teamA: 0, teamB: 0 });
  const [showAnswerState, setShowAnswerState] = useState<Record<number, boolean>>({});

  const totalSlides = PRESENTATION_SLIDES.length;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      playSound('click');
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      playSound('click');
    }
  };

  const toggleAnswer = (slideId: number) => {
    setShowAnswerState((prev) => ({
      ...prev,
      [slideId]: !prev[slideId],
    }));
    playSound('hint');
  };

  const addScore = (team: 'teamA' | 'teamB', delta: number) => {
    setTeamScores((prev) => ({
      ...prev,
      [team]: Math.max(0, prev[team] + delta),
    }));
    playSound(delta > 0 ? 'success' : 'click');
  };

  return (
    <div className="w-full space-y-6">
      {/* Smart Board Presentation Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              Akıllı Tahta & Sunum Modu
            </span>
          </div>
          <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-1 rounded-full font-mono font-bold">
            Slayt {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Classroom Team Scoreboard for Teacher */}
        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-400">Takım A (Milyonlar):</span>
            <span className="font-mono text-base font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {teamScores.teamA}
            </span>
            <button
              onClick={() => addScore('teamA', 10)}
              className="w-5 h-5 rounded bg-sky-800 hover:bg-sky-700 text-white font-bold flex items-center justify-center transition"
            >
              +
            </button>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-400">Takım B (Binler):</span>
            <span className="font-mono text-base font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {teamScores.teamB}
            </span>
            <button
              onClick={() => addScore('teamB', 10)}
              className="w-5 h-5 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentSlideIndex === 0}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs sm:text-sm font-bold rounded-lg border border-slate-700 transition flex items-center gap-1"
          >
            ◀ Önceki
          </button>
          <button
            onClick={goToNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-lg transition flex items-center gap-1 shadow-md shadow-sky-600/30"
          >
            Sonraki ▶
          </button>
        </div>
      </div>

      {/* Slide Viewport (1280x720 aspect ratio or responsive container) */}
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 transition-all duration-300">
        {/* Slide 1 */}
        {currentSlideIndex === 0 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#0f172a] p-8 sm:p-14 flex flex-col justify-center relative">
            <div className="absolute top-6 right-8 bg-white/10 backdrop-blur-md text-slate-100 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider">
              Maarif Modeli • Slide 1 / 9
            </div>
            <p className="text-xs sm:text-sm text-sky-400 font-bold uppercase tracking-[2.5px] mb-4">
              Türkiye Yüzyılı Maarif Modeli • Yapay Zeka Destekli Öğrenme
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight max-w-3xl">
              Sayılar Ülkesi: Doğal Sayılarla Yetkinlik Temelli Dijital Macera
            </h1>
            <p className="text-base sm:text-xl text-slate-400 mt-6 max-w-2xl leading-relaxed">
              5. Sınıf Matematik Dersi • Milyonlar, Bölükler ve Zihinden İşlemler Odaklı Google AI Studio Oyun Tasarımı
            </p>
            <div className="w-20 h-1.5 bg-sky-400 mt-8 rounded-full" />

            <div className="mt-12 flex flex-wrap gap-4">
              <button
                onClick={() => onGoToTask('mil')}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm sm:text-base"
              >
                <span>🎮</span>
                Macerayı Başlat (Görev 1'e Git)
              </button>
              <button
                onClick={goToNext}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition text-sm"
              >
                Sunumu İncele (Slayt 2) ➔
              </button>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {currentSlideIndex === 1 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 2 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-8 leading-snug">
                Maarif Modeli Temel Yaklaşımı: Sayılar Ünitesi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">📐</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Matematiksel Yetkinlik
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Doğal sayıların basamak, bölük yapısını kavramak ve büyük sayıları okuyup yazabilmek.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600">
                    Kazanım: 9 Basamaklı Doğal Sayılar
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">🌱</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Erdem-Değer-Eylem
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Bütçeleme, tasarruf bilinci ve sosyal yardımlaşma projelerinde verileri doğru analiz etme erdemi.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600">
                    Değer: Kültürel Miras & Tasarruf
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">🧠</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Sokratik Yapay Zeka
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Ezberi reddeden, öğrenciyi adım adım düşünmeye sevk eden Google AI Studio rehberliği.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600">
                    Metot: Düşündürücü Sorular
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              💡 Türkiye Yüzyılı Maarif Modeli: Öğrenciyi edilgen dinleyiciden, aktif kural keşfedicisine dönüştürür.
            </div>
          </div>
        )}

        {/* Slide 3 */}
        {currentSlideIndex === 2 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 3 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Google AI Studio Sistem Talimatı (Prompt)
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold text-[#0f172a] text-base sm:text-lg">
                    <span className="text-blue-600">⌨️</span>
                    <span>System Instructions Yapısı:</span>
                  </div>
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-1 text-sm sm:text-base text-slate-700 italic">
                    "Sen Türkiye Yüzyılı Maarif Modeli ilkelerine uygun tasarlanmış 5. sınıf matematik doğal sayılar oyun yöneticisisin."
                  </blockquote>
                  <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 text-sm sm:text-base text-slate-700 italic">
                    "Öğrenciye asla doğrudan cevap verme; Sokratik soru teknikleriyle basamak, bölük ve zihinden işlem ipuçları sun."
                  </blockquote>
                  <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 text-sm sm:text-base text-slate-700 italic">
                    "Soruları en çok dokuz basamaklı doğal sayılar, bölükler, basamak değeri ve tahmin kazanımlarından seç."
                  </blockquote>
                </div>

                <div className="w-full lg:w-96 bg-[#1e293b] rounded-2xl p-6 sm:p-8 text-[#f8fafc] flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-sky-400 mb-4">
                    Pedagojik Filtre
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Yapay zeka yönlendirmeleri, öğrencilerin günlük yaşam verileriyle matematiksel bağ kurmasını ve hata analizi yapmasını sağlar.
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Model: Gemini 3.8 Flash</span>
                    <span className="text-xs text-emerald-400 font-semibold">● Aktif Entegre</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              🔧 Sistem talimatını test etmek için üst menüdeki "AI Studio Laboratuvarı" sekmesini kullanabilirsiniz.
            </div>
          </div>
        )}

        {/* Slide 4: Task 1 */}
        {currentSlideIndex === 3 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 4 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Görev 1: Milyonlar Bölüğü ve Tarihi Eser Koruma
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mb-2">
                      MAARİF MODELİ BAĞLAMI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-4">
                      Müze Ziyaretçi Sayısı Analizi
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                      "Tarihi müzenin yıllık ziyaretçi sayısı <strong>'Üç yüz kırk iki milyon yüz beş bin sekiz'</strong> olarak açıklandı."
                    </p>
                    <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm sm:text-base font-bold text-blue-950">
                        AI Soru: Bu sayının milyonlar bölüğündeki sayı ile binler bölüğündeki sayının toplamı kaçtır?
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => onGoToTask('mil')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-lg transition shadow flex items-center gap-2"
                    >
                      <span>🏛️</span>
                      Abaküs ile Çöz
                    </button>
                    <button
                      onClick={() => toggleAnswer(4)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg transition"
                    >
                      {showAnswerState[4] ? 'Cevabı Gizle' : 'Çözümü Göster'}
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-[#eff6ff] rounded-2xl p-6 sm:p-8 border border-[#bfdbfe] flex flex-col justify-center items-center text-center">
                  <div className="text-5xl text-blue-600 mb-4">🏛️</div>
                  <h4 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">
                    Bölük Çözümlemesi
                  </h4>
                  {showAnswerState[4] ? (
                    <div className="space-y-2 animate-in fade-in">
                      <p className="text-base sm:text-lg font-bold text-blue-950">
                        342 (Milyonlar) + 105 (Binler) = <span className="text-2xl text-blue-600 font-black">447</span>
                      </p>
                      <p className="text-xs text-blue-800">
                        Sayımız: <strong>342.105.008</strong> (Birler: 008)
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800">
                      Sayıyı rakamla yazıp sağdan sola üçerli gruplayarak bölükleri bulun.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              🎯 Erdem: Kültürel Mirası Koruma • Rozet: Basamak Ustası
            </div>
          </div>
        )}

        {/* Slide 5: Task 2 */}
        {currentSlideIndex === 4 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 5 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Görev 2: En Yakın Yüzlüğe Yuvarlama & Bütçe
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-2">
                      MAARİF MODELİ BAĞLAMI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-4">
                      Kütüphane Kitap Bağışı
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                      "Okulumuz kütüphanesine bağışlanan <strong>4.876 kitap</strong> en yakın yüzlüğe yuvarlanarak tasnif edilecektir."
                    </p>
                    <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                      <p className="text-sm sm:text-base font-bold text-emerald-950">
                        AI Soru: 4.876 sayısı en yakın yüzlüğe yuvarlandığında hangi sayı elde edilir ve aradaki fark ne kadardır?
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => onGoToTask('round')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg transition shadow flex items-center gap-2"
                    >
                      <span>📚</span>
                      Sayı Doğrusunda Gör
                    </button>
                    <button
                      onClick={() => toggleAnswer(5)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg transition"
                    >
                      {showAnswerState[5] ? 'Cevabı Gizle' : 'Çözümü Göster'}
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-[#f0fdf4] rounded-2xl p-6 sm:p-8 border border-[#bbf7d0] flex flex-col justify-center items-center text-center">
                  <div className="text-5xl text-emerald-600 mb-4">📖</div>
                  <h4 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2">
                    Yuvarlama Modeli
                  </h4>
                  {showAnswerState[5] ? (
                    <div className="space-y-2 animate-in fade-in">
                      <p className="text-base sm:text-lg font-bold text-emerald-950">
                        Onlar basamağı 7 olduğu için üst yüzlüğe yuvarlanır: <span className="text-2xl text-emerald-600 font-black">4.900</span>
                      </p>
                      <p className="text-xs text-emerald-800">
                        Fark: <strong>4.900 - 4.876 = 24 kitap</strong>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-800">
                      Yüzlüğe yuvarlarken onlar basamağındaki 7 rakamı 5'ten büyük mü?
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              🎯 Erdem: Tasarruf ve Kitap Sevgisi • Rozet: Tasarruf Elçisi
            </div>
          </div>
        )}

        {/* Slide 6: Task 3 */}
        {currentSlideIndex === 5 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 6 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Görev 3: Zihinden İşlem Stratejileri
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block mb-2">
                      MAARİF MODELİ BAĞLAMI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-4">
                      Gezginin Alışveriş Planı
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                      "Esnaf kermesinden <strong>450 TL'lik</strong> yöresel ürün alınacaktır. 10 ve 100 ile kısa yoldan çarpma ve bölme kuralları uygulanacaktır."
                    </p>
                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                      <p className="text-sm sm:text-base font-bold text-amber-950">
                        AI Soru: 450 sayısını 50 ile kısa yoldan (önce 100 ile çarpıp 2'ye bölerek) zihinden çarparsak sonuç kaç olur?
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => onGoToTask('mental')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold rounded-lg transition shadow flex items-center gap-2"
                    >
                      <span>⚡</span>
                      Zihinden İşlem Tahtası
                    </button>
                    <button
                      onClick={() => toggleAnswer(6)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg transition"
                    >
                      {showAnswerState[6] ? 'Cevabı Gizle' : 'Çözümü Göster'}
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-[#fef3c7] rounded-2xl p-6 sm:p-8 border border-[#fde68a] flex flex-col justify-center items-center text-center">
                  <div className="text-5xl text-amber-600 mb-4">🧮</div>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">
                    Zihinden İşlem
                  </h4>
                  {showAnswerState[6] ? (
                    <div className="space-y-2 animate-in fade-in">
                      <p className="text-base sm:text-lg font-bold text-amber-950">
                        450 × 100 = 45.000
                        <br />
                        45.000 ÷ 2 = <span className="text-2xl text-amber-600 font-black">22.500</span>
                      </p>
                      <p className="text-xs text-amber-800">
                        50 sayısı 100'ün yarısıdır!
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-amber-800">
                      Önce iki sıfır ekleyip sonra ikiye bölerek zihinden hesaplayın.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              🎯 Erdem: Finansal Okuryazarlık ve Esnaf Dayanışması • Rozet: Zihin Cambazı
            </div>
          </div>
        )}

        {/* Slide 7: Task 4 */}
        {currentSlideIndex === 6 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 7 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-snug">
                Görev 4: Sayı Örüntüleri ve Kural Keşfi
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-fuchsia-600 font-bold uppercase tracking-wider block mb-2">
                      MAARİF MODELİ BAĞLAMI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-4">
                      Tarihi Mozaik Dizilimi
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                      "Antik sarayın yer karoları şu kurala göre dizilmiştir: <strong>5, 12, 19, 26, ...</strong>"
                    </p>
                    <div className="bg-fuchsia-50/70 p-4 rounded-xl border border-fuchsia-200">
                      <p className="text-sm sm:text-base font-bold text-fuchsia-950">
                        AI Soru: Bu örüntünün kuralı nedir ve dizideki 7. adımda yer alan sayı kaçtır?
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => onGoToTask('pattern')}
                      className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs sm:text-sm font-bold rounded-lg transition shadow flex items-center gap-2"
                    >
                      <span>🧩</span>
                      Mozaik Karolarını İncele
                    </button>
                    <button
                      onClick={() => toggleAnswer(7)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg transition"
                    >
                      {showAnswerState[7] ? 'Cevabı Gizle' : 'Çözümü Göster'}
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-[#fdf4ff] rounded-2xl p-6 sm:p-8 border border-[#f5d0fe] flex flex-col justify-center items-center text-center">
                  <div className="text-5xl text-fuchsia-600 mb-4">🧩</div>
                  <h4 className="text-lg sm:text-xl font-bold text-fuchsia-900 mb-2">
                    Örüntü Analizi
                  </h4>
                  {showAnswerState[7] ? (
                    <div className="space-y-2 animate-in fade-in">
                      <p className="text-base sm:text-lg font-bold text-fuchsia-950">
                        Her adımda 7'şer artmaktadır.
                        <br />
                        7. adım = <span className="text-2xl text-fuchsia-600 font-black">47</span>
                      </p>
                      <p className="text-xs text-fuchsia-800">
                        5 ➔ 12 ➔ 19 ➔ 26 ➔ 33 ➔ 40 ➔ 47
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-fuchsia-800">
                      Ardı ardına gelen sayılar arasındaki farkı hesaplayarak kuralı bulun.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              🎯 Erdem: Sanat ve Estetik Keşfi • Rozet: Mozaik Mimarı
            </div>
          </div>
        )}

        {/* Slide 8: Teacher Guide */}
        {currentSlideIndex === 7 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#f8fafc] text-[#0f172a] p-8 sm:p-14 flex flex-col justify-between relative">
            <div className="absolute top-6 right-8 bg-black/10 text-[#0f172a] rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 8 / 9
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mb-8 leading-snug">
                Öğretmenler İçin Uygulama Rehberi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">👥</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Akıllı Tahta Etkinliği
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Sınıfı takımlara ayırarak AI Studio yöneticisinin sorularını ortak tartışma ile yanıtlayın.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600">
                    Sınıf İçi İşbirlikli Öğrenme
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">💻</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Bireysel Tekrar
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Öğrencilerin evde kendi hızlarında doğal sayılar macerasını oynamasını sağlayın.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600">
                    Kişiselleştirilmiş Öğrenme Hızı
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl text-blue-600 mb-4">🎖️</div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-3">
                      Yetkinlik Rozetleri
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Her aşama sonunda öğrencilere "Basamak Ustası" ve "Sayı Avcısı" rozetleri takdim edin.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600">
                    Oyunlaştırma & Teşvik
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-6">
              📊 Değerlendirme: Öğrenciler başarı sertifikalarını yazdırıp portfolyolarına ekleyebilir.
            </div>
          </div>
        )}

        {/* Slide 9: Closing Slide */}
        {currentSlideIndex === 8 && (
          <div className="min-h-[540px] sm:min-h-[580px] bg-[#0f172a] p-8 sm:p-14 flex flex-col justify-center items-center text-center relative">
            <div className="absolute top-6 right-8 bg-white/10 text-slate-100 rounded-full px-4 py-1.5 text-xs font-semibold">
              Maarif Modeli • Slide 9 / 9
            </div>
            <p className="text-xs sm:text-sm text-sky-400 font-bold uppercase tracking-[2.5px] mb-4">
              Türkiye Yüzyılı Maarif Modeli
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 mb-6 max-w-3xl leading-tight">
              Matematik Artık Bir Macera!
            </h1>
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
              Google AI Studio ile sınıfınızda eğlenceli, yetkinlik ve değer odaklı doğal sayılar öğrenme deneyimini hemen başlatın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onGoToTask('mil')}
                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>🚀</span>
                Macerayı Şimdi Oyna!
              </button>
              <button
                onClick={() => setCurrentSlideIndex(0)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition"
              >
                Sunumu Baştan Başlat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide Thumbnails Rail */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1">
        {PRESENTATION_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => { setCurrentSlideIndex(idx); playSound('click'); }}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition text-left ${
              currentSlideIndex === idx
                ? 'bg-sky-900/60 border-sky-400 text-sky-200 ring-2 ring-sky-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] text-slate-500">Slayt {s.id}</div>
            <div className="truncate w-36 font-semibold">{s.title.split(':')[0]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
