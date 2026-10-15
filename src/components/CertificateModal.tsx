import React, { useState } from 'react';
import { Badge } from '../types';
import { playSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  score: number;
  badges: Badge[];
}

export const CertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  studentName,
  score,
  badges,
}) => {
  const [name, setName] = useState(studentName || 'Başarılı Öğrenci');
  const [schoolName, setSchoolName] = useState('Cumhuriyet Ortaokulu 5/A Sınıfı');

  if (!isOpen) return null;

  const handlePrint = () => {
    playSound('badge');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-amber-600/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h3 className="font-bold text-white text-base sm:text-lg">
              Türkiye Yüzyılı Maarif Modeli Matematik Yetkinlik Belgesi
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Yazdır / PDF Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Input fields to customize name (hidden in print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Öğrenci Adı Soyadı:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Okul & Sınıf Bilgisi:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE SHEET */}
        <div className="relative bg-[#fffdfa] text-slate-900 p-8 sm:p-12 rounded-2xl border-8 border-double border-amber-800/80 shadow-2xl flex flex-col justify-between items-center text-center space-y-6">
          {/* Top Seal & Crest */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-3xl shadow-lg border-2 border-white mb-2">
              🇹🇷
            </div>
            <span className="text-xs font-extrabold uppercase tracking-[3px] text-amber-900">
              TÜRKİYE YÜZYILI MAARİF MODELİ
            </span>
            <span className="text-[11px] font-semibold text-slate-600 tracking-wider">
              MİLLİ EĞİTİM BAKANLIĞI • 5. SINIF MATEMATİK
            </span>
          </div>

          {/* Certificate Title */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-wide text-slate-900">
              DOĞAL SAYILAR VE ERDEM YETKİNLİK BELGESİ
            </h1>
            <div className="w-32 h-1 bg-amber-600 mx-auto mt-2 rounded-full" />
          </div>

          {/* Student Mention */}
          <div className="max-w-xl space-y-2">
            <p className="text-xs sm:text-sm text-slate-600">Bu belge, 5. sınıf matematik müfredatındaki başarılarından ötürü;</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-serif border-b-2 border-slate-300 pb-1 px-8 inline-block">
              {name}
            </div>
            <p className="text-xs text-slate-500 font-medium">({schoolName})</p>
          </div>

          {/* Citation Text */}
          <p className="text-xs sm:text-sm text-slate-700 max-w-lg leading-relaxed">
            Milyonlar ve basamak yapısını çözümleme, en yakın yüzlüğe yuvarlama ile tasarruf bilinci oluşturma, zihinden pratik işlem stratejileri uygulama ve tarihi mozaik örüntülerini keşfetme kazanımlarını üstün başarıyla tamamlamıştır.
          </p>

          {/* Earned Badges Row */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  b.unlocked
                    ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <span>{b.unlocked ? '⭐' : '🔒'}</span>
                <span>{b.name}</span>
              </div>
            ))}
          </div>

          {/* Bottom Signatures */}
          <div className="w-full pt-8 flex justify-between items-end text-xs text-slate-600 px-4 sm:px-12">
            <div className="text-center">
              <div className="font-bold text-slate-900 mb-1">Google AI Studio</div>
              <div className="text-[10px] text-slate-500">Sokratik Oyun Yöneticisi</div>
              <div className="w-32 border-b border-slate-400 mt-6" />
            </div>

            <div className="text-center">
              <div className="text-[11px] font-mono text-amber-800 font-bold mb-1">
                Yetkinlik Puanı: {score} Puan
              </div>
              <div className="w-16 h-16 rounded-full border border-amber-600/40 flex items-center justify-center text-xs font-serif text-amber-900 bg-amber-50 mx-auto">
                MÜHÜR
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-slate-900 mb-1">Matematik Öğretmeni</div>
              <div className="text-[10px] text-slate-500">İmza & Tasdik</div>
              <div className="w-32 border-b border-slate-400 mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
