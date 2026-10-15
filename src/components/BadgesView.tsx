import React from 'react';
import { Badge } from '../types';
import { playSound } from '../utils/audio';

interface Props {
  badges: Badge[];
  score: number;
  onOpenCertificate: () => void;
  onGoToTask: (type: string) => void;
}

export const BadgesView: React.FC<Props> = ({
  badges,
  score,
  onOpenCertificate,
  onGoToTask,
}) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-900 border border-sky-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            TÜRKİYE YÜZYILI MAARİF MODELİ • BAŞARI VE DEĞER PANELİ
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Yetkinlik Rozetleri ve Erdem Karnesi
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Her görev, sadece matematiksel bir kazanımı değil; tasarruf, kültürel mirası koruma, finansal bilinç ve estetik algı gibi temel insani değerleri de kazandırır.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-6 py-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block font-semibold">Kazanılan Puan</span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
              {score} Puan
            </span>
            <span className="text-xs text-sky-400 block mt-1">
              {unlockedCount} / {badges.length} Rozet Açıldı
            </span>
          </div>

          <button
            onClick={() => { onOpenCertificate(); playSound('badge'); }}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <span>🎓</span>
            <span>Maarif Yetkinlik Belgesini Al</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, idx) => {
          const taskTypes = ['mil', 'round', 'mental', 'pattern', 'mil'];
          const targetTask = taskTypes[idx] || 'mil';

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all relative flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-slate-900 border-amber-500/60 shadow-xl shadow-amber-950/20'
                  : 'bg-slate-950/60 border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {badge.unlocked ? (idx === 0 ? '🏛️' : idx === 1 ? '📚' : idx === 2 ? '⚡' : idx === 3 ? '🧩' : '🏆') : '🔒'}
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      badge.unlocked
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {badge.unlocked ? 'Kazanıldı ✓' : 'Kilitli 🔒'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-3">
                  Hedef: {badge.criteria}
                </span>

                {!badge.unlocked && (
                  <button
                    onClick={() => onGoToTask(targetTask)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    Görevi Oyna & Rozeti Aç ➔
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Maarif Values Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🌱</span>
          <span>Türkiye Yüzyılı Maarif Modeli: Erdem-Değer-Eylem Matrisi</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Görev</th>
                <th className="py-3 px-4">Matematiksel Kazanım</th>
                <th className="py-3 px-4">Maarif Erdem & Değeri</th>
                <th className="py-3 px-4">Eylem Çıktısı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr>
                <td className="py-3.5 px-4 font-bold text-sky-400">1. Müzeler & Miras</td>
                <td className="py-3.5 px-4">9 Basamaklı Doğal Sayılar ve Bölükler</td>
                <td className="py-3.5 px-4 text-emerald-400">Kültürel Mirası Koruma</td>
                <td className="py-3.5 px-4">Müze verilerini hatasız analiz etme</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-sky-400">2. Kitap Bağışı</td>
                <td className="py-3.5 px-4">En Yakın Yüzlüğe Yuvarlama & Fark</td>
                <td className="py-3.5 px-4 text-emerald-400">Tasarruf & Kitap Sevgisi</td>
                <td className="py-3.5 px-4">Kütüphane kaynaklarını doğru planlama</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-sky-400">3. Esnaf Kermesi</td>
                <td className="py-3.5 px-4">50, 100 ile Zihinden Çarpma/Bölme</td>
                <td className="py-3.5 px-4 text-emerald-400">Finansal Okuryazarlık & Dayanışma</td>
                <td className="py-3.5 px-4">Zihinden hızlı ve doğru hesap yapabilme</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-sky-400">4. Antik Mozaik</td>
                <td className="py-3.5 px-4">Aritmetik Sayı Örüntüleri</td>
                <td className="py-3.5 px-4 text-emerald-400">Sanat & Estetik Düşünce</td>
                <td className="py-3.5 px-4">Mimarideki matematiksel uyumu fark etme</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
