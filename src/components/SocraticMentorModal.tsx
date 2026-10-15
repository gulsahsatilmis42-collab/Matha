import React, { useState } from 'react';
import { playSound, speakTurkish, stopSpeech } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTaskTitle?: string;
  currentQuestion?: string;
  defaultClues?: string[];
}

export const SocraticMentorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTaskTitle,
  currentQuestion,
  defaultClues = [],
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string }>>([
    {
      role: 'assistant',
      text: "Merhaba Genç Matematik Kaşifi! Ben Maarif Modeli Sokratik Rehberinim. Sana asla doğrudan cevabı söylemem; çünkü en büyük başarı kendi aklınla keşfetmektir! Aklına takılan nedir?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const userMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    playSound('click');

    try {
      const res = await fetch('/api/chat-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-4),
        }),
      });
      const data = await res.json();
      const replyText = data.reply || "Birlikte adım adım bakalım! Basamak tablosuna ve bölük yapısına tekrar dikkatlice göz atalım mı?";
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: replyText, source: data.source },
      ]);
      playSound('hint');
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Bölükleri sağdan sola üçer üçer ayırmayı ve basamak değerlerini hatırlayalım. Bir adım geriye çekilip sorudaki ipuçlarını tekrar oku!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSocraticHint = async () => {
    if (isLoading) return;
    setIsLoading(true);
    playSound('hint');

    // If local predefined clues exist, offer them first or request dynamic Gemini hint
    if (defaultClues.length > 0 && hintIndex < defaultClues.length) {
      const localClue = defaultClues[hintIndex];
      setHintIndex((prev) => prev + 1);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: `Bu görev için bana düşündürücü bir Sokratik ipucu verir misin? (${hintIndex + 1}. İpucu)` },
        { role: 'assistant', text: localClue, source: 'maarif-curriculum' },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/socratic-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: currentTaskTitle || '5. Sınıf Doğal Sayılar',
          question: currentQuestion || 'Doğal Sayılar Macerası',
          hintCount: hintIndex + 1,
        }),
      });
      const data = await res.json();
      setHintIndex((prev) => prev + 1);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: "Görevi çözmekte zorlanıyorum, bana yol gösterir misin?" },
        { role: 'assistant', text: data.hint, source: data.source },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Bölükleri ve basamakları dikkatle inceleyelim. Sayının en büyük basamağından başlayarak adım adım ilerle!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-sky-800/80 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-950 to-indigo-950 border-b border-sky-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-xl shadow-inner">
              🧙‍♂️
            </div>
            <div>
              <h3 className="font-bold text-sky-200 text-sm sm:text-base flex items-center gap-2">
                Bilge Sayı Rehberi (Sokratik AI)
                <span className="text-[10px] bg-sky-900 text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-700">
                  Maarif Modeli
                </span>
              </h3>
              <p className="text-xs text-sky-400/80">
                Ezber yok; adım adım düşünme ve keşfetme var!
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopSpeech(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm ${
                  m.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300/80">
                    {m.role === 'user' ? 'Sen (Öğrenci)' : 'Bilge Rehber'}
                  </span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => speakTurkish(m.text)}
                      className="text-slate-400 hover:text-sky-300 text-xs px-1"
                      title="Sesli Oku"
                    >
                      🔊
                    </button>
                  )}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-sky-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700 w-fit">
              <span className="animate-spin text-sm">🌀</span>
              <span>Bilge Rehber senin için düşündürücü bir soru hazırlıyor...</span>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="p-2 sm:px-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={requestSocraticHint}
            disabled={isLoading}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <span>💡</span>
            <span>Sokratik İpucu İste</span>
          </button>

          <button
            onClick={() => {
              setInputText("Basamak değeri ile sayı değeri arasındaki fark nedir?");
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            Basamak Değeri Nedir?
          </button>
          <button
            onClick={() => {
              setInputText("50 ile çarparken neden 100 ile çarpıp 2'ye bölüyoruz?");
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            50 İle Çarpma Mantığı?
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bilge Rehbere bir soru sor (ör: 'Yuvarlama yaparken 5 neden önemli?')..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};
