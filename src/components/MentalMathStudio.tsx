import React, { useState } from 'react';
import { playSound } from '../utils/audio';

interface Props {
  initialBase?: number;
  initialMultiplier?: number;
}

export const MentalMathStudio: React.FC<Props> = ({
  initialBase = 450,
  initialMultiplier = 50,
}) => {
  const [base, setBase] = useState<number>(initialBase);
  const [strategy, setStrategy] = useState<'x50' | 'x5' | 'x25' | 'x100'>('x50');
  const [activeStep, setActiveStep] = useState<number>(2);

  let step1Text = '';
  let step1Val = 0;
  let step2Text = '';
  let step2Val = 0;
  let ruleDesc = '';

  if (strategy === 'x50') {
    ruleDesc = "50 sayısı 100'ün yarısıdır. Bir sayıyı 50 ile çarpmak yerine önce 100 ile çarpıp ardından 2'ye böleriz.";
    step1Text = `${base} × 100 (Sağına 2 sıfır ekle)`;
    step1Val = base * 100;
    step2Text = `${step1Val.toLocaleString('tr-TR')} ÷ 2 (Yarısını al)`;
    step2Val = step1Val / 2;
  } else if (strategy === 'x5') {
    ruleDesc = "5 sayısı 10'un yarısıdır. Bir sayıyı 5 ile çarpmak yerine önce 10 ile çarpıp sonra 2'ye böleriz.";
    step1Text = `${base} × 10 (Sağına 1 sıfır ekle)`;
    step1Val = base * 10;
    step2Text = `${step1Val.toLocaleString('tr-TR')} ÷ 2 (Yarısını al)`;
    step2Val = step1Val / 2;
  } else if (strategy === 'x25') {
    ruleDesc = "25 sayısı 100'ün çeyreğidir (dörtte biri). Önce 100 ile çarpıp sonra 4'e böleriz.";
    step1Text = `${base} × 100 (Sağına 2 sıfır ekle)`;
    step1Val = base * 100;
    step2Text = `${step1Val.toLocaleString('tr-TR')} ÷ 4 (Dörtte birini al)`;
    step2Val = step1Val / 4;
  } else {
    ruleDesc = "100 ile kısa yoldan çarparken sayının sağına iki adet sıfır '00' eklenir.";
    step1Text = `${base} sayısını yaz`;
    step1Val = base;
    step2Text = `Sağına iki sıfır '00' ekle`;
    step2Val = base * 100;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-2">
            <span>⚡</span>
            Zihinden İşlem Stratejileri Laboratuvarı
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Esnaf kermesi alışverişinde kalem kağıt olmadan hızlı ve zekice hesap yapın!
          </p>
        </div>

        {/* Strategy Badges */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { setStrategy('x50'); setActiveStep(2); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              strategy === 'x50' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            50 ile Çarpma (Ödev)
          </button>
          <button
            onClick={() => { setStrategy('x5'); setActiveStep(2); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              strategy === 'x5' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            5 ile Çarpma
          </button>
          <button
            onClick={() => { setStrategy('x25'); setActiveStep(2); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              strategy === 'x25' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            25 ile Çarpma
          </button>
          <button
            onClick={() => { setStrategy('x100'); setActiveStep(2); playSound('click'); }}
            className={`px-3 py-1 rounded font-medium transition ${
              strategy === 'x100' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            100 ile Çarpma
          </button>
        </div>
      </div>

      {/* Input Number Controller */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-sm">
        <span className="text-slate-400">Çarpılacak Sayı:</span>
        <input
          type="number"
          value={base}
          onChange={(e) => setBase(Number(e.target.value) || 0)}
          className="bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold px-3 py-1 rounded-lg w-28 text-center focus:outline-none focus:border-amber-500"
        />
        <div className="flex gap-2">
          {[450, 240, 180, 84].map((num) => (
            <button
              key={num}
              onClick={() => { setBase(num); playSound('click'); }}
              className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Step by Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Step 1 */}
        <div
          onClick={() => setActiveStep(1)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeStep >= 1
              ? 'bg-slate-950/90 border-amber-500/50 shadow-md shadow-amber-950/20'
              : 'bg-slate-950/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
            <span>1. ADIM</span>
            <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
              Kısa Yoldan Çarpma
            </span>
          </div>
          <p className="text-sm text-slate-300">{step1Text}</p>
          <div className="text-2xl font-black font-mono text-white mt-2">
            = {step1Val.toLocaleString('tr-TR')}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex justify-center text-slate-500 text-xl font-bold">
          ➔
        </div>

        {/* Step 2 */}
        <div
          onClick={() => setActiveStep(2)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeStep >= 2
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500'
              : 'bg-slate-950/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-2">
            <span>2. ADIM (SONUÇ)</span>
            <span className="bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded">
              Zihinden Sonuç
            </span>
          </div>
          <p className="text-sm text-amber-100">{step2Text}</p>
          <div className="text-3xl font-black font-mono text-amber-300 mt-2">
            = {step2Val.toLocaleString('tr-TR')} TL
          </div>
        </div>
      </div>

      {/* Maarif Pedagogical summary */}
      <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 leading-relaxed">
        <strong>💡 Maarif Strateji Notu:</strong> {ruleDesc}
        <br />
        <span className="font-mono text-amber-300 font-semibold">
          {base} × {strategy === 'x50' ? 50 : strategy === 'x5' ? 5 : strategy === 'x25' ? 25 : 100} = {step2Val.toLocaleString('tr-TR')}
        </span>
      </div>
    </div>
  );
};
