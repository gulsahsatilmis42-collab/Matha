import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Sen Türkiye Yüzyılı Maarif Modeli ilkelerine uygun tasarlanmış 5. sınıf matematik doğal sayılar oyun yöneticisi ve bilge rehberisin.
Temel ilkeler:
1. Öğrenciye ASLA doğrudan sonucu söyleme! Sokratik soru teknikleriyle basamak, bölük, basamak değeri, yuvarlama kuralı, zihinden işlem stratejileri veya örüntü kuralı ipuçları sun.
2. Öğrenci bir hata yaptığında onu cesaretlendir, hatasını fark ettirecek düşündürücü 1 soru sor.
3. Yanıtların 5. sınıf öğrencisine hitap eden sıcak, samimi, merak uyandırıcı ve en fazla 2-3 kısa cümle olsun.
4. Maarif modelinin Erdem-Değer-Eylem odaklı (kültürel miras, tasarruf, dayanışma, kütüphane, dürüstlük, bilim sevgisi) yaklaşımını pekiştir.`;

// API Endpoint: Socratic Hint for currently active game task
app.post('/api/socratic-hint', async (req, res) => {
  try {
    const { question, studentAnswer, taskTitle, hintCount = 1 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Pedagogical fallback when key is not configured
      const fallbacks: Record<string, string[]> = {
        default: [
          "Bölükleri sağdan sola üçerli gruplara ayırmayı denedin mi? Milyonlar, binler ve birler bölüğü nerede duruyor?",
          "Basamak tablosuna göz atalım! Onlar basamağındaki rakam 5 veya daha büyükse yüzlüğümüz nasıl değişir?",
          "Zihinden işlem yaparken sayıyı 100 ile çarpıp sonra ikiye bölmek sence hangi sayıyla çarpmakla aynı sonucu verir?",
        ],
      };
      return res.json({
        hint: "Harika bir çaba! Sayıların basamaklarına ve bölüklerine dikkatle bak. Hangi basamakta hangi değer saklı, bir kez daha kontrol edelim mi?",
        source: 'pedagogical-fallback',
      });
    }

    const prompt = `Öğrenci Görevi: "${taskTitle}"
Soru: "${question}"
Öğrencinin Yanıtı / Durumu: "${studentAnswer || 'Öğrenci ipucu istiyor'}"
İpucu Seviyesi: ${hintCount} (1 ise hafif merak uyandırıcı ipucu, 2 ise daha yönlendirici soru, 3 ise basamak adımlarını gösteren Sokratik yönlendirme).

Lütfen öğrenciye cevabı vermeden Sokratik bir ipucu ve yönlendirici bir soru ver.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      hint: response.text || "Basamak tablosunu incele ve bölükleri sağdan sola üçer üçer gruplandırmayı hatırla!",
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini Socratic hint error:', error?.message);
    res.json({
      hint: "Adım adım düşünelim: Önce hangi bölükten başlamamız gerektiğini ve basamak değerlerini hatırlayalım. Bir sonraki adım ne olabilir?",
      source: 'pedagogical-fallback',
    });
  }
});

// API Endpoint: Generate Custom Maarif Math Questions
app.post('/api/generate-question', async (req, res) => {
  try {
    const { taskType, difficulty } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Dynamic deterministic generator fallback
      return res.json({
        question: generateFallbackQuestion(taskType),
        source: 'template-generator',
      });
    }

    const typeDescriptions: Record<string, string> = {
      mil: '9 basamağa kadar milyonlar ve bölük çözümlemesi, kültürel miras/müze bağlamı',
      round: 'En yakın onluğa, yüzlüğe veya binliğe yuvarlama, tasarruf/kütüphane kitap bağışı bağlamı',
      mental: '10, 100, 1000 ve 50 ile kısa yoldan zihinden çarpma ve bölme, esnaf/pazar kermes bağlamı',
      pattern: 'Aritmetik sayı örüntüsü kuralı ve eksik adımı bulma, tarihi mozaik/mimari süsleme bağlamı',
    };

    const targetDesc = typeDescriptions[taskType] || '5. sınıf doğal sayılar kazanımı';

    const prompt = `Türkiye Yüzyılı Maarif Modeli 5. Sınıf Matematik dersi için yeni bir problem oluştur.
Kazanım Türü: ${targetDesc}
Zorluk: ${difficulty || 'orta'}

JSON formatında şu alanları döndür:
{
  "title": "Kısa ve ilgi çekici başlık",
  "context": "1-2 cümlelik günlük yaşam veya kültürel değer bağlamı",
  "questionText": "Öğrenciye yöneltilen net matematik sorusu",
  "correctAnswer": "Doğru sayısal veya kısa cevap (sadece sayı veya kısa metin)",
  "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
  "explanation": "Maarif modeline uygun adım adım çözüm açıklaması",
  "socraticClue": "Öğrenci takıldığında verilecek düşündürücü ipucu",
  "valueBadge": "Kazanılacak erdem (ör: Kültürel Mirası Koruma, Tasarruf Bilinci, vb.)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      data = generateFallbackQuestion(taskType);
    }

    res.json({ question: data, source: 'gemini' });
  } catch (error: any) {
    console.error('Generate question error:', error?.message);
    res.json({
      question: generateFallbackQuestion(req.body.taskType),
      source: 'template-generator',
    });
  }
});

// API Endpoint: Freeform Socratic Mentor Chat
app.post('/api/chat-mentor', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "Sayılar Ülkesi'nde her rakamın bir değeri ve her bölüğün bir sırrı vardır! Aklına takılan soruyu basamak basamak birlikte keşfedelim. Hangi bölükte ya da işlemde takıldın?",
        source: 'pedagogical-fallback',
      });
    }

    const conversationPrompt = history
      .map((h: any) => `${h.role === 'user' ? 'Öğrenci' : 'Bilge Rehber'}: ${h.text}`)
      .join('\n');

    const prompt = `${conversationPrompt}\nÖğrenci: ${message}\nBilge Rehber (Sokratik, sıcak, 5. sınıf matematik rehberi olarak cevapla):`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Birlikte adım adım bakalım. Basamak tablosunu gözünün önüne getir, önce hangi bölüğü inceliyoruz?",
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Chat mentor error:', error?.message);
    res.json({
      reply: "Çok güzel bir soru! Matematikte büyük sayılarla çalışırken bölükler bize harika bir harita sunar. Birlikte inceleyelim!",
      source: 'pedagogical-fallback',
    });
  }
});

function generateFallbackQuestion(taskType: string) {
  const seed = Math.floor(Math.random() * 4);
  if (taskType === 'mil') {
    const list = [
      {
        title: "Kültür Başkenti Ziyaretçi Rekoru",
        context: "Tarihi saray ve kaleleri bu yıl 584 milyon 620 bin 315 kişi ziyaret etti.",
        questionText: "584.620.315 sayısının Milyonlar Bölüğü ile Birler Bölüğündeki sayıların toplamı kaçtır?",
        correctAnswer: "899",
        options: ["899", "1204", "935", "740"],
        explanation: "Milyonlar bölüğündeki sayı 584'tür. Birler bölüğündeki sayı 315'tir. 584 + 315 = 899.",
        socraticClue: "Sayının solundaki ilk üç basamak milyonlar bölüğüdür, en sağdaki üç basamak ise birler bölüğüdür. Bu iki üç basamaklı sayıyı toplayalım.",
        valueBadge: "Kültürel Miras Bilinci"
      },
      {
        title: "Selçuklu Kervansarayı Arşiv Kaydı",
        context: "Tarihi kervansaray envanterine 409 milyon 80 bin 700 numaralı vakıf senedi işlenmiştir.",
        questionText: "Bu sayının binler bölüğündeki sayı kaçtır?",
        correctAnswer: "80",
        options: ["80", "800", "409", "8"],
        explanation: "409.080.700 sayısında binler bölüğü '080' yani 80'dir.",
        socraticClue: "Bölükler sağdan sola: Birler bölüğü (700), Binler bölüğü (080), Milyonlar bölüğü (409) şeklindedir.",
        valueBadge: "Tarih ve Medeniyet Yetkinliği"
      }
    ];
    return list[seed % list.length];
  } else if (taskType === 'round') {
    return {
      title: "Kardeş Okul Kırtasiye Kampanyası",
      context: "Okul yardımlaşma kulübü kardeş köy okulu için 3.648 parça kırtasiye malzemesi topladı.",
      questionText: "3.648 sayısı en yakın yüzlüğe yuvarlandığında hangi sayı elde edilir?",
      correctAnswer: "3.600",
      options: ["3.600", "3.700", "3.650", "4.000"],
      explanation: "Yüzlüğe yuvarlarken onlar basamağına bakarız. Onlar basamağında 4 vardır (5'ten küçük). Bu yüzden kendi yüzlüğüne yuvarlanır: 3.600.",
      socraticClue: "En yakın yüzlüğe yuvarlarken onlar basamağındaki rakama bakarız. 4 rakamı 5'ten küçük mü büyük mü?",
      valueBadge: "Sosyal Yardımlaşma Erdemi"
    };
  } else if (taskType === 'mental') {
    return {
      title: "Geleneksel Kermes Zihinden Hesap",
      context: "Okul kermesinde ihtiyaç sahibi öğrenciler yararına 640 TL'lik organik zeytinyağı satıldı.",
      questionText: "640 sayısını 50 ile zihinden çarpmak için hangi pratik yöntem uygulanmalıdır?",
      correctAnswer: "100 ile çarpıp 2'ye bölmek (32.000)",
      options: [
        "100 ile çarpıp 2'ye bölmek (32.000)",
        "10 ile çarpıp 5 eklemek (6.405)",
        "2 ile çarpıp 100'e bölmek (1.280)",
        "5 ile çarpıp sıfır silmek (3.200)"
      ],
      explanation: "50 sayısı 100'ün yarısıdır. Dolayısıyla 640 x 100 = 64.000, ardından 64.000 / 2 = 32.000 olur.",
      socraticClue: "50 sayısı 100'ün nesidir? 100 ile kolayca çarpıp sonra hangi işlemi yapmalıyız?",
      valueBadge: "Tasarruf ve Finansal Okuryazarlık"
    };
  } else {
    return {
      title: "Geleneksel Çini Deseni Örüntüsü",
      context: "Tarihi İznik çinilerinde motif sayıları şu kurala göre yerleştirilmiştir: 8, 15, 22, 29, ...",
      questionText: "Bu sayı örüntüsünün kuralı nedir ve 6. adımdaki çini sayısı kaçtır?",
      correctAnswer: "7'şer artar, 6. adım = 43",
      options: [
        "7'şer artar, 6. adım = 43",
        "6'şar artar, 6. adım = 38",
        "7'şer artar, 6. adım = 50",
        "8'er artar, 6. adım = 48"
      ],
      explanation: "15 - 8 = 7, 22 - 15 = 7. Kural: 7'şer artar. 5. adım: 29 + 7 = 36, 6. adım: 36 + 7 = 43.",
      socraticClue: "Ardı ardına gelen terimler arasındaki farkı bulalım: 15 ile 8 arasındaki fark kaçtır?",
      valueBadge: "Sanat ve Estetik Keşfi"
    };
  }
}

// Development and production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
