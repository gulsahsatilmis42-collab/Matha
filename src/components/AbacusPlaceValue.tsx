import React, { useState } from 'react';
import { playSound } from '../utils/audio';

interface Props {
  initialNumber?: string;
  onNumberChange?: (val: string) => void;
}

export const AbacusPlaceValue: React.FC<Props> = ({
  initialNumber = '342105008',
  onNumberChange,
}) => {
  // Normalize to 9 digits with leading zeros
  const [digits, setDigits] = useState<number[]>(() => {
    const padded = initialNumber.padStart(9, '0').slice(-9);
    return padded.split('').map(Number);
  });

  const columns = [
    { name: 'Yüz Milyonlar', short: 'YM', period: 'Milyonlar Bölüğü', value: 100000000, color: 'text-sky-400 bg-sky-950/40 border-sky-800' },
    { name: 'On Milyonlar', short: 'OM', period: 'Milyonlar Bölüğü', value: 10000000, color: 'text-sky-400 bg-sky-950/40 border-sky-800' },
    { name: 'Milyonlar', short: 'M', period: 'Milyonlar Bölüğü', value: 1000000, color: 'text-sky-400 bg-sky-950/40 border-sky-800' },
    { name: 'Yüz Binler', short: 'YB', period: 'Binler Bölüğü', value: 100000, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
    { name: 'On Binler', short: 'OB', period: 'Binler Bölüğü', value: 10000, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
    { name: 'Binler', short: 'B', period: 'Binler Bölüğü', value: 1000, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
    { name: 'Yüzler', short: 'Y', period: 'Birler Bölüğü', value: 100, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { name: 'Onlar', short: 'O', period: 'Birler Bölüğü', value: 10, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { name: 'Birler', short: 'BR', period: 'Birler Bölüğü', value: 1, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
  ];

  const updateDigit = (index: number, delta: number) => {
    const next = [...digits];
    const newVal = (next[index] + delta + 10) % 10;
    next[index] = newVal;
    setDigits(next);
    playSound('click');
    if (onNumberChange) {
      onNumberChange(next.join(''));
    }
  };

  const setPreset = (numStr: string) => {
    const padded = numStr.padStart(9, '0').slice(-9);
    const next = padded.split('').map(Number);
    setDigits(next);
    playSound('success');
    if (onNumberChange) {
      onNumberChange(next.join(''));
    }
  };

  const millionsPart = digits.slice(0, 3).join('');
  const thousandsPart = digits.slice(3, 6).join('');
  const onesPart = digits.slice(6, 9).join('');

  const formattedWithDots = `${parseInt(millionsPart, 10)}.${thousandsPart}.${onesPart}`;
  const totalVal = digits.reduce((acc, d, idx) => acc + d * columns[idx].value, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-sky-400 flex items-center gap-2">
            <span>🏛️</span>
            İnteraktif 9 Basamaklı Bölük & Abaküs Tablosu
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Boncukları artırıp azaltarak milyonlar ve binler bölüklerinin değerini inceleyin.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Örnek Sayılar:</span>
          <button
            onClick={() => setPreset('342105008')}
            className="px-2.5 py-1 bg-sky-900/50 hover:bg-sky-800 text-sky-200 rounded border border-sky-700 transition"
          >
            342.105.008 (Müze)
          </button>
          <button
            onClick={() => setPreset('584620315')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          >
            584.620.315
          </button>
        </div>
      </div>

      {/* Number Badge Display */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-400 block">
            MİLYONLAR BÖLÜĞÜ
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-300">
            {parseInt(millionsPart, 10)}
          </span>
        </div>
        <span className="text-2xl font-bold text-slate-600">.</span>
        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400 block">
            BİNLER BÖLÜĞÜ
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-300">
            {thousandsPart}
          </span>
        </div>
        <span className="text-2xl font-bold text-slate-600">.</span>
        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400 block">
            BİRLER BÖLÜĞÜ
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-300">
            {onesPart}
          </span>
        </div>

        <div className="sm:ml-auto text-right pl-4 sm:border-l sm:border-slate-800">
          <span className="text-xs text-slate-400 block">Bölükler Toplamı:</span>
          <div className="text-sm font-semibold text-amber-300">
            {parseInt(millionsPart, 10)} (Milyonlar) + {parseInt(thousandsPart, 10)} (Binler) ={' '}
            <span className="text-base font-bold text-amber-400 underline decoration-sky-500">
              {parseInt(millionsPart, 10) + parseInt(thousandsPart, 10)}
            </span>
          </div>
        </div>
      </div>

      {/* Abacus Columns (9 Columns) */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2 overflow-x-auto py-2">
        {columns.map((col, idx) => {
          const val = digits[idx];
          return (
            <div
              key={idx}
              className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl border ${col.color}`}
            >
              <button
                onClick={() => updateDigit(idx, 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center transition active:scale-95"
                title="1 Artır"
              >
                +
              </button>

              {/* Digit Box */}
              <div className="font-mono text-xl sm:text-2xl font-black my-1 text-white">
                {val}
              </div>

              {/* Beads container (renders val beads) */}
              <div className="w-full h-24 sm:h-28 bg-slate-950/60 rounded-lg flex flex-col-reverse items-center justify-start p-1 gap-1 border border-slate-800/50">
                {Array.from({ length: 9 }).map((_, bIdx) => {
                  const isActive = bIdx < val;
                  return (
                    <div
                      key={bIdx}
                      className={`w-4 sm:w-5 h-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? idx < 3
                            ? 'bg-sky-400 shadow-sm shadow-sky-500/50'
                            : idx < 6
                            ? 'bg-indigo-400 shadow-sm shadow-indigo-500/50'
                            : 'bg-emerald-400 shadow-sm shadow-emerald-500/50'
                          : 'bg-slate-800/30'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => updateDigit(idx, -1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center transition active:scale-95 mt-1"
                title="1 Azalt"
              >
                -
              </button>

              <span className="text-[10px] sm:text-xs font-bold mt-1 text-center truncate w-full text-slate-300">
                {col.short}
              </span>
              <span className="text-[8px] text-slate-500 hidden sm:block text-center leading-tight">
                {col.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg flex items-center justify-between">
        <span>💡 <strong>Maarif Modeli Kuralı:</strong> Bir sayıda bölükler sağdan sola üçerli gruplanır; her bölük kendi adıyla okunur (birler bölüğü hariç).</span>
        <span className="font-mono text-sky-400 font-bold">{formattedWithDots}</span>
      </div>
    </div>
  );
};
