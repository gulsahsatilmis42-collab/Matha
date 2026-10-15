import { MaarifTask, Badge, SlideData } from '../types';

export const INITIAL_TASKS: MaarifTask[] = [
  {
    id: 'task-1',
    type: 'mil',
    questNumber: 1,
    title: 'Milyonlar Bölüğü ve Tarihi Eser Koruma',
    subTitle: 'Müze Ziyaretçi Sayısı Analizi',
    contextText: "Kültürel mirasımızı koruma projesinde, tarihi saray ve müzemizin yıllık ziyaretçi sayısı 'Üç yüz kırk iki milyon yüz beş bin sekiz' olarak açıklandı. Bölükleri ve basamakları doğru analiz ederek eserlerin güvenliği için gerekli bütçeyi hesaplamalıyız.",
    storyImage: 'landmark',
    questionText: "Bu sayının milyonlar bölüğündeki sayı ile binler bölüğündeki sayının toplamı kaçtır?",
    correctAnswer: "447",
    options: ["447", "350", "442", "455"],
    explanation: "Sayımız: 342.105.008'dir. Milyonlar bölüğündeki sayı 342, Binler bölüğündeki sayı ise 105'tir. 342 + 105 = 447 eder.",
    socraticClues: [
      "Sayının okunuşunu rakamlara dökelim: 'Üç yüz kırk iki milyon' hangi bölükte yer alır?",
      "Bölükleri sağdan sola üçer üçer ayırırız: Birler (008), Binler (105), Milyonlar (342). Şimdi bu iki bölükteki sayıları toplayalım!",
      "342 ile 105 sayılarını topladığında birler basamağı 2 + 5 = 7 olur. Hangi seçenekte bu sonucu görüyorsun?"
    ],
    valueTitle: 'Kültürel Mirası Koruma Erdemi',
    valueDescription: 'Tarihi değerlerimizi ve müzelerimizi korumak, milli kimliğimizi geleceğe taşımaktır.',
    targetCompetency: 'En çok dokuz basamaklı doğal sayıları okur, yazar ve bölük-basamak ilişkisini çözümler.',
    interactiveTool: 'abacus',
    initialToolData: {
      millions: 342,
      thousands: 105,
      ones: 8,
      rawNumber: '342105008'
    }
  },
  {
    id: 'task-2',
    type: 'round',
    questNumber: 2,
    title: 'En Yakın Yüzlüğe Yuvarlama & Bütçe',
    subTitle: 'Kütüphane Kitap Bağışı Tasnifi',
    contextText: "Okulumuz kütüphanesine gönüllüler tarafından bağışlanan 4.876 adet kitap, yeni açılacak okuma salonlarına dengeli dağıtılmak üzere en yakın yüzlüğe yuvarlanarak kolilenecektir.",
    storyImage: 'book-open',
    questionText: "4.876 sayısı en yakın yüzlüğe yuvarlandığında hangi sayı elde edilir ve gerçek sayı ile aradaki fark ne kadardır?",
    correctAnswer: "4.900 (Fark: 24)",
    options: ["4.900 (Fark: 24)", "4.800 (Fark: 76)", "4.880 (Fark: 4)", "5.000 (Fark: 124)"],
    explanation: "Bir sayıyı en yakın yüzlüğe yuvarlarken onlar basamağına bakarız. Onlar basamağında 7 rakamı vardır. 7 sayısı 5'ten büyük olduğu için bir üst yüzlüğe yani 4.900'e yuvarlanır. Fark: 4.900 - 4.876 = 24'tür.",
    socraticClues: [
      "En yakın yüzlüğe yuvarlama yaparken gözlerimiz hangi basamağa odaklanmalıdır? Birler mi, onlar mı?",
      "Onlar basamağındaki 7 rakamı, 5'ten büyük mü yoksa küçük mü? 5 ve üzeri olduğunda yüzlük artar mı?",
      "4.876 sayısı 4.800'e mi daha yakındır yoksa 4.900'e mi? Sayı doğrusundaki yerine dikkatle bak!"
    ],
    valueTitle: 'Tasarruf ve Kitap Sevgisi',
    valueDescription: 'Kitapları korumak, paylaşmak ve kaynakları doğru planlamak tasarruf bilincinin temelidir.',
    targetCompetency: 'Doğal sayıları en yakın onluğa veya yüzlüğe yuvarlar; tahmin ve gerçek değer arasındaki farkı yorumlar.',
    interactiveTool: 'rounding',
    initialToolData: {
      targetNumber: 4876,
      min: 4800,
      max: 4900,
      mid: 4850
    }
  },
  {
    id: 'task-3',
    type: 'mental',
    questNumber: 3,
    title: 'Zihinden İşlem Stratejileri',
    subTitle: 'Gezginin Kermes Alışveriş Planı',
    contextText: "Okul aile birliğinin ihtiyaç sahibi öğrenciler yararına düzenlediği geleneksel esnaf kermesinden 450 TL'lik yöresel ürünler alınacaktır. Hızlı ve hatasız hesaplama için 10, 100 ve 50 ile kısa yoldan çarpma ve bölme kuralları uygulanacaktır.",
    storyImage: 'calculator',
    questionText: "450 sayısını 50 ile kısa yoldan (önce 100 ile çarpıp ardından 2'ye bölerek) zihinden çarparsak sonuç kaç olur?",
    correctAnswer: "22.500",
    options: ["22.500", "20.000", "24.500", "25.000"],
    explanation: "50 sayısı 100'ün yarısıdır. 450'yi önce 100 ile çarparız: 450 x 100 = 45.000. Sonra bu sonucu 2'ye böleriz: 45.000 / 2 = 22.500. Zihinden çok kolay!",
    socraticClues: [
      "Bir sayıyı 100 ile çarpmak demek o sayının sağına kaç tane sıfır eklemektir?",
      "450'nin yanına iki sıfır eklediğimizde 45.000 buluruz. Şimdi 45.000'in yarısını zihinden bulalım: 40.000'in yarısı 20.000, 5.000'in yarısı ise 2.500!",
      "20.000 ile 2.500'ü zihninde birleştirdiğinde hangi sonuca ulaşırsın?"
    ],
    valueTitle: 'Finansal Okuryazarlık ve Dayanışma',
    valueDescription: 'Alışverişte zihinden pratik hesaplama yapabilmek, bilinçli tüketici olmanın anahtarıdır.',
    targetCompetency: 'Doğal sayılarla 10, 100, 1000 ve 50 ile zihinden çarpma ve bölme stratejilerini kullanır.',
    interactiveTool: 'mental',
    initialToolData: {
      base: 450,
      multiplier: 50,
      step1: 45000,
      step2: 22500
    }
  },
  {
    id: 'task-4',
    type: 'pattern',
    questNumber: 4,
    title: 'Sayı Örüntüleri ve Kural Keşfi',
    subTitle: 'Tarihi Antik Mozaik Dizilimi',
    contextText: "Restorasyon arkeologları, antik bir medeniyet sarayının zemin mozaik karolarının belirli bir matematiksel kurala göre döşendiğini keşfetti: 5, 12, 19, 26, ... Restorasyonun eksik 7. adımını tamamlamamız gerekiyor.",
    storyImage: 'puzzle-piece',
    questionText: "Bu sayı örüntüsünün kuralı nedir ve dizideki 7. adımda yer alması gereken mozaik karo sayısı kaçtır?",
    correctAnswer: "7'şer artmaktadır, 7. adım = 47",
    options: [
      "7'şer artmaktadır, 7. adım = 47",
      "6'şar artmaktadır, 7. adım = 41",
      "7'şer artmaktadır, 7. adım = 40",
      "8'er artmaktadır, 7. adım = 49"
    ],
    explanation: "12 - 5 = 7, 19 - 12 = 7, 26 - 19 = 7. Kural: 'Her adımda 7 artar'. Adımlar: 1. adım (5), 2. adım (12), 3. adım (19), 4. adım (26), 5. adım (33), 6. adım (40), 7. adım: 40 + 7 = 47'dir.",
    socraticClues: [
      "İlk terim 5, ikinci terim 12. 12'den 5'i çıkardığında aradaki fark kaç çıkıyor?",
      "Üçüncü terim 19, dördüncü terim 26. Fark her seferinde aynı kalıyor mu?",
      "4. adım 26 olduğuna göre; 5. adım 26 + 7 = 33, 6. adım 33 + 7 = 40. O halde 7. adım kaçtır?"
    ],
    valueTitle: 'Estetik ve Geometrik Düşünce',
    valueDescription: 'Matematik doğada, mimaride ve sanatta bir uyum ve desen dili olarak var olur.',
    targetCompetency: 'Kuralı verilen veya kuralı belirlenen sayı örüntülerinin istenen adımlarını bulur.',
    interactiveTool: 'mosaic',
    initialToolData: {
      sequence: [5, 12, 19, 26],
      stepDifference: 7,
      targetStep: 7,
      targetValue: 47
    }
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Basamak Ustası',
    icon: 'landmark',
    color: 'from-blue-500 to-indigo-600',
    description: '9 basamaklı sayıları ve bölükleri eksiksiz çözümler.',
    criteria: '1. Görevi (Milyonlar Bölüğü) başarıyla tamamla.',
    unlocked: false
  },
  {
    id: 'badge-2',
    name: 'Tasarruf Elçisi',
    icon: 'book-open',
    color: 'from-emerald-500 to-teal-600',
    description: 'En yakın yüzlüğe yuvarlayarak kaynakları doğru planlar.',
    criteria: '2. Görevi (Yuvarlama & Kütüphane) başarıyla tamamla.',
    unlocked: false
  },
  {
    id: 'badge-3',
    name: 'Zihin Cambazı',
    icon: 'calculator',
    color: 'from-amber-500 to-orange-600',
    description: '10, 100 ve 50 ile kısa yoldan zihinden işlem stratejilerini ustaca uygular.',
    criteria: '3. Görevi (Zihinden İşlem) başarıyla tamamla.',
    unlocked: false
  },
  {
    id: 'badge-4',
    name: 'Mozaik Mimarı',
    icon: 'puzzle-piece',
    color: 'from-fuchsia-500 to-pink-600',
    description: 'Sayı dizilerindeki gizli kuralı keşfeder ve örüntüyü tamamlar.',
    criteria: '4. Görevi (Mozaik Örüntüsü) başarıyla tamamla.',
    unlocked: false
  },
  {
    id: 'badge-5',
    name: 'Sayı Avcısı Şampiyonu',
    icon: 'award',
    color: 'from-yellow-400 to-amber-500',
    description: 'Türkiye Yüzyılı Maarif Modeli 5. Sınıf Doğal Sayılar yetkinliğini tam puanla kanıtlar.',
    criteria: 'Tüm 4 temel görevi ve Maarif Yetkinlik Belgesi aşamasını tamamla.',
    unlocked: false
  }
];

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    slideLabel: 'Maarif Modeli • Slide 1 / 9',
    category: 'TÜRKİYE YÜZYILI MAARİF MODELİ • YAPAY ZEKA DESTEKLİ ÖĞRENME',
    title: 'Sayılar Ülkesi: Doğal Sayılarla Yetkinlik Temelli Dijital Macera',
    theme: 'dark',
  },
  {
    id: 2,
    slideLabel: 'Maarif Modeli • Slide 2 / 9',
    category: 'PEDAGOJİK TEMEL',
    title: 'Maarif Modeli Temel Yaklaşımı: Sayılar Ünitesi',
    theme: 'light',
  },
  {
    id: 3,
    slideLabel: 'Maarif Modeli • Slide 3 / 9',
    category: 'YAPAY ZEKA ENTEGRASYONU',
    title: 'Google AI Studio Sistem Talimatı (Prompt)',
    theme: 'light',
  },
  {
    id: 4,
    slideLabel: 'Maarif Modeli • Slide 4 / 9',
    category: '1. GÖREV UYGULAMASI',
    title: 'Görev 1: Milyonlar Bölüğü ve Tarihi Eser Koruma',
    theme: 'light',
    relatedTaskId: 'mil',
    badgeEarned: 'Basamak Ustası'
  },
  {
    id: 5,
    slideLabel: 'Maarif Modeli • Slide 5 / 9',
    category: '2. GÖREV UYGULAMASI',
    title: 'Görev 2: En Yakın Yüzlüğe Yuvarlama & Bütçe',
    theme: 'light',
    relatedTaskId: 'round',
    badgeEarned: 'Tasarruf Elçisi'
  },
  {
    id: 6,
    slideLabel: 'Maarif Modeli • Slide 6 / 9',
    category: '3. GÖREV UYGULAMASI',
    title: 'Görev 3: Zihinden İşlem Stratejileri',
    theme: 'light',
    relatedTaskId: 'mental',
    badgeEarned: 'Zihin Cambazı'
  },
  {
    id: 7,
    slideLabel: 'Maarif Modeli • Slide 7 / 9',
    category: '4. GÖREV UYGULAMASI',
    title: 'Görev 4: Sayı Örüntüleri ve Kural Keşfi',
    theme: 'light',
    relatedTaskId: 'pattern',
    badgeEarned: 'Mozaik Mimarı'
  },
  {
    id: 8,
    slideLabel: 'Maarif Modeli • Slide 8 / 9',
    category: 'ÖĞRETMEN UYGULAMA METODOLOJİSİ',
    title: 'Öğretmenler İçin Uygulama Rehberi',
    theme: 'light',
  },
  {
    id: 9,
    slideLabel: 'Maarif Modeli • Slide 9 / 9',
    category: 'TÜRKİYE YÜZYILI MAARİF MODELİ',
    title: 'Matematik Artık Bir Macera!',
    theme: 'dark',
    badgeEarned: 'Sayı Avcısı Şampiyonu'
  }
];
