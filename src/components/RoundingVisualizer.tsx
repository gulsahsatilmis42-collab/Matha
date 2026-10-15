import React, { useState } from 'react';
import { playSound } from '../utils/audio';

interface Props {
  initialValue?: number;
}

export const RoundingVisualizer: React.FC<Props> = ({ initialValue = 4876 }) => {
  const [val, setVal] = useState<number>(initialValue);
  const [mode, setMode] = useState<'hundred' | 'ten' | 'thousand'>('hundred');

  let lowerBound = 4800;
  let upperBound = 4900;
  let midPoint = 4850;
  let roundedVal = 4900;
  let decidingDigitName = 'onlar';
  let decidingDigit = Math.floor((val % 100) / 10);

  if (mode === 'hundred') {
    lowerBound = Math.floor(val / 100) * 100;
    upperBound = lowerBound + 100;
    midPoint = lowerBound + 50;
    decidingDigit = Math.floor((val % 100) / 10);
    decidingDigitName = 'onlar';
    roundedVal = decidingDigit >= 5 ? upperBound : lowerBound;
  } else if (mode === 'ten') {
    lowerBound = Math.floor(val / 10) * 10;
    upperBound = lowerBound + 10;
    midPoint = lowerBound + 5;
    decidingDigit = val % 10;
    decidingDigitName = 'birler';
    roundedVal = decidingDigit >= 5 ? upperBound : lowerBound;
  } else if (mode === 'thousand') {
    lowerBound = Math.floor(val / 1000) * 1000;
    upperBound = lowerBound + 1000;
    midPoint = lowerBound + 500;
    decidingDigit = Math.floor((val % 1000) / 100);
    decidingDigitName = 'yüzler';
    roundedVal = decidingDigit >= 5 ? upperBound : lowerBound;
  }

  const range = upperBound - lowerBound;
  const progressPercent = Math.max(0, Math.min(100, ((val - lowerBound) / range) * 100));
  const diffFromRounded = Math.abs(roundedVal - val);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
            <span>📚</span>
            İnteraktif Sayı Doğrusu ve Yuvarlama Terazisi
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Kütüphane kitaplarını tasnif ederken sayının hangi yüzlüğe yakın olduğunu keşfedin.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { setMode('hundred'); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              mode === 'hundred'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yüzlüğe Yuvarla
          </button>
          <button
            onClick={() => { setMode('ten'); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              mode === 'ten'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Onluğa Yuvarla
          </button>
          <button
            onClick={() => { setMode('thousand'); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              mode === 'thousand'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Binliğe Yuvarla
          </button>
        </div>
      </div>

      {/* Main Comparative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Gerçek Kitap Sayısı</span>
          <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{val}</span>
          <span className="text-xs text-indigo-400 mt-1 inline-block">
            {decidingDigitName} basamağında <strong className="text-amber-300 font-bold">{decidingDigit}</strong> var
          </span>
        </div>

        <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/80 text-center">
          <span className="text-xs text-emerald-400 uppercase font-semibold block">En Yakın Yuvarlanan Değer</span>
          <span className="text-3xl font-extrabold text-emerald-300 font-mono mt-1 block">{roundedVal}</span>
          <span className="text-xs text-emerald-400 mt-1 inline-block font-semibold">
            {decidingDigit >= 5 ? '⬆️ Üst basamağa yuvarlandı' : '⬇️ Kendi basamağında kaldı'}
          </span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Tahmin - Gerçek Farkı</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">|{diffFromRounded}|</span>
          <span className="text-xs text-slate-400 mt-1 inline-block">
            {roundedVal > val ? `${diffFromRounded} fazla tahmin` : `${diffFromRounded} eksik tahmin`}
          </span>
        </div>
      </div>

      {/* Number Line Visualizer */}
      <div className="relative pt-8 pb-4 px-4 bg-slate-950/90 rounded-xl border border-slate-800">
        {/* Track Line */}
        <div className="relative h-3 bg-slate-800 rounded-full overflow-visible">
          {/* Progress fill towards rounded */}
          <div
            className={`absolute top-0 h-full rounded-full transition-all duration-300 ${
              roundedVal === upperBound ? 'right-0 bg-emerald-500/40' : 'left-0 bg-emerald-500/40'
            }`}
            style={{
              width: `${Math.abs(progressPercent - (roundedVal === upperBound ? 100 : 0))}%`,
              left: roundedVal === upperBound ? `${progressPercent}%` : 0,
            }}
          />

          {/* Lower bound mark */}
          <div className="absolute left-0 -top-7 text-xs font-mono font-bold text-slate-400 flex flex-col items-center">
            <span>{lowerBound}</span>
            <div className="w-0.5 h-3 bg-slate-600 mt-1" />
          </div>

          {/* Mid point mark */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 text-xs font-mono font-semibold text-amber-400/80 flex flex-col items-center">
            <span>{midPoint}</span>
            <div className="w-0.5 h-3 bg-amber-500/70 mt-1" />
          </div>

          {/* Upper bound mark */}
          <div className="absolute right-0 -top-7 text-xs font-mono font-bold text-slate-400 flex flex-col items-center">
            <span>{upperBound}</span>
            <div className="w-0.5 h-3 bg-slate-600 mt-1" />
          </div>

          {/* Value Pin Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150 z-10"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white shadow-lg shadow-emerald-500/50 flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 rounded-full bg-emerald-950" />
            </div>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold shadow">
              {val}
            </div>
          </div>
        </div>

        {/* Interactive Slider Input */}
        <div className="mt-12 flex items-center gap-3">
          <span className="text-xs text-slate-400">Sayıyı Değiştir:</span>
          <input
            type="range"
            min={lowerBound}
            max={upperBound}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => { setVal(4876); playSound('click'); }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-emerald-900 transition whitespace-nowrap"
          >
            4.876 Yap
          </button>
        </div>
      </div>

      {/* Maarif Pedagogical note */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-200/90 leading-relaxed">
        <strong>📌 Maarif Kuralı:</strong> Bir sayıyı en yakın yüzlüğe yuvarlarken, yüzler basamağının hemen sağındaki basamağa (onlar basamağı) bakarız.
        Onlar basamağındaki rakam <strong>{decidingDigit}</strong> olduğu ve 5'ten büyük veya eşit olduğu için sayı üst yüzlüğe (<strong>{roundedVal}</strong>) yuvarlanmıştır.
      </div>
    </div>
  );
};
