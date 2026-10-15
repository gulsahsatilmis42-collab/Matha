import React, { useState } from 'react';
import { playSound } from '../utils/audio';

interface Props {
  initialStart?: number;
  initialDiff?: number;
}

export const MosaicPatternLab: React.FC<Props> = ({
  initialStart = 5,
  initialDiff = 7,
}) => {
  const [startVal, setStartVal] = useState<number>(initialStart);
  const [diffVal, setDiffVal] = useState<number>(initialDiff);
  const [selectedStep, setSelectedStep] = useState<number>(7);

  // Generate sequence up to 8 steps
  const steps = Array.from({ length: 8 }, (_, i) => {
    const stepNum = i + 1;
    const value = startVal + i * diffVal;
    return { stepNum, value };
  });

  const targetStepData = steps.find((s) => s.stepNum === selectedStep) || steps[6];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-fuchsia-400 flex items-center gap-2">
            <span>🧩</span>
            Tarihi Antik Mozaik & Sayı Örüntüsü Keşfi
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Karoların dizilim kuralını keşfedin ve eksik restorasyon adımlarını hesaplayın.
          </p>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 px-2">Adım Seç:</span>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              onClick={() => { setSelectedStep(num); playSound('click'); }}
              className={`w-7 h-7 rounded font-bold transition flex items-center justify-center ${
                selectedStep === num
                  ? 'bg-fuchsia-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Sequence Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {steps.slice(0, 7).map((step, idx) => {
          const isTarget = step.stepNum === 7;
          const isCurrent = step.stepNum === selectedStep;
          return (
            <div
              key={step.stepNum}
              onClick={() => { setSelectedStep(step.stepNum); playSound('click'); }}
              className={`p-3 rounded-xl border transition-all cursor-pointer text-center relative ${
                isCurrent
                  ? 'bg-fuchsia-950/60 border-fuchsia-500 ring-2 ring-fuchsia-500/40 shadow-lg'
                  : isTarget
                  ? 'bg-slate-950/80 border-dashed border-amber-500/60'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-bold text-fuchsia-400 uppercase">
                {step.stepNum}. Adım
              </div>
              <div className="text-2xl font-black font-mono text-white my-1">
                {step.value}
              </div>

              {idx > 0 && (
                <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 py-0.5 px-1.5 rounded inline-block border border-emerald-800/40">
                  +{diffVal}
                </div>
              )}

              {isTarget && (
                <span className="absolute -top-2.5 right-2 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                  GÖREV ADIMI
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Tile Representation for Selected Step */}
      <div className="bg-slate-950/90 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-300">
            {targetStepData.stepNum}. Adımdaki Antik Mozaik Karoları:
            <span className="font-mono text-fuchsia-300 font-bold ml-2 text-base">
              ({targetStepData.value} Karo)
            </span>
          </div>

          <div className="text-xs text-slate-400">
            Kural Formülü: <strong className="text-fuchsia-300">{startVal} + ({targetStepData.stepNum} - 1) × {diffVal} = {targetStepData.value}</strong>
          </div>
        </div>

        {/* Mosaic Tiles Grid Preview */}
        <div className="flex flex-wrap gap-1.5 p-3 bg-slate-900/80 rounded-lg border border-slate-800 max-h-44 overflow-y-auto">
          {Array.from({ length: targetStepData.value }).map((_, idx) => {
            const isOriginal = idx < 5;
            const stepBatch = Math.floor((idx - 5) / diffVal) + 2;
            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all duration-200 transform hover:scale-110 shadow-sm ${
                  isOriginal
                    ? 'bg-sky-500 text-slate-950'
                    : stepBatch === 7
                    ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                    : 'bg-fuchsia-500/80 text-white'
                }`}
                title={`Karo #${idx + 1}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Maarif Pedagogical summary */}
      <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-800/40 rounded-xl text-xs text-fuchsia-200/90 leading-relaxed flex items-center justify-between">
        <div>
          <strong>📌 Maarif Örüntü Kuralı:</strong> Ardışık terimler arasındaki fark sabittir (12 - 5 = 7, 19 - 12 = 7).
          <br />
          Örüntü <strong>"7'şer artar"</strong> kuralına sahiptir. 7. adımdaki değer: <strong>40 + 7 = 47</strong>'dir.
        </div>
        <button
          onClick={() => { setSelectedStep(7); playSound('success'); }}
          className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded font-bold text-xs whitespace-nowrap ml-4 transition shadow"
        >
          7. Adımı Çöz (47)
        </button>
      </div>
    </div>
  );
};
