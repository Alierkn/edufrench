import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 NeonDB PostgreSQL tohumlanıyor...');

  // --- A1 MODÜLLERİ ---
  const a1Vocabulaire = await prisma.module.create({
    data: {
      title: "Les Salutations et Présentations",
      type: "Vocabulaire",
      level: "A1",
      description: "Günlük selamlama ve tanışma ifadeleri. Okul hayatının temel dil yapıları.",
      exercises: {
        create: [
          { title: "Bonjour vs Bonsoir", content: JSON.stringify({ word: "Enchanté(e)", translation: "Memnun oldum", context: "— Bonjour, je m'appelle Marie. — Enchanté(e)!", type: "VOCABULARY" }), type: "TEXT" },
          { title: "Çok Temel Fiiller", content: JSON.stringify({ word: "S'appeler", translation: "Adı olmak / Kendini tanıtmak", context: "Je m'appelle Thomas. Et toi, comment tu t'appelles?", type: "VOCABULARY" }), type: "TEXT" },
        ]
      }
    }
  });

  const a1Grammaire = await prisma.module.create({
    data: {
      title: "Les Pronoms Personnels Sujets",
      type: "Grammaire",
      level: "A1",
      description: "Je, Tu, Il/Elle, Nous, Vous, Ils/Elles — Fransızcadaki özne zamirlerin temeli.",
      exercises: {
        create: [
          {
            title: "Présent de l'indicatif — Être",
            content: "Choisissez la forme correcte du verbe 'être'.",
            type: "MCQ",
            options: {
              create: [
                { text: "Je suis étudiant.", isCorrect: true },
                { text: "Je est étudiant.", isCorrect: false },
                { text: "Tu suis étudiant.", isCorrect: false },
                { text: "Elle sont étudiante.", isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  });

  // --- A2 MODÜLLERİ ---
  const a2CE = await prisma.module.create({
    data: {
      title: "Ma Journée Scolaire",
      type: "CE",
      level: "A2",
      description: "Okul hayatını anlatan kısa bir okuma metni.",
      exercises: {
        create: [
          {
            title: "Compréhension Générale",
            content: `Je m'appelle Léa. J'ai quinze ans et je suis au lycée Saint-Joseph à Istanbul. Chaque matin, je me lève à 6h30. Je prends le bus avec mon amie Selin. Nos cours commencent à 8h. J'aime les cours de français et de mathématiques. À midi, je mange à la cantine avec mes camarades.

Léa hangi okulda okuyor?`,
            type: "MCQ",
            options: {
              create: [
                { text: "Saint Benoît Lisesi", isCorrect: false },
                { text: "Saint Joseph Lisesi", isCorrect: true },
                { text: "Notre Dame de Sion", isCorrect: false },
                { text: "Charles de Gaulle Lisesi", isCorrect: false },
              ]
            }
          },
        ]
      }
    }
  });

  // --- B1 MODÜLLERİ ---
  const b1CE = await prisma.module.create({
    data: {
      title: "L'Environnement et le Réchauffement Climatique",
      type: "CE",
      level: "B1",
      description: "DELF B1 hazırlık: Çevre kirliliği ve iklim değişikliği üzerine bir gazete makalesi.",
      exercises: {
        create: [
          {
            title: "Lecture — Idée Principale",
            content: `Selon les scientifiques du GIEC, la planète se réchauffe à une vitesse alarmante. En 2023, la température moyenne mondiale a dépassé de 1,4°C le niveau préindustriel. Cette hausse est principalement due aux émissions de gaz à effet de serre, résultant de la combustion des énergies fossiles et de la déforestation massive.

Bu makaleye göre iklim değişikliğinin ana sebebi nedir?`,
            type: "MCQ",
            options: {
              create: [
                { text: "Güneş patlamaları ve doğal iklim döngüleri", isCorrect: false },
                { text: "Fosil yakıtların yakılması ve ormansızlaşma", isCorrect: true },
                { text: "Nükleer enerji santrallerinin artması", isCorrect: false },
                { text: "Okyanus sıcaklıklarındaki döngüsel değişimler", isCorrect: false },
              ]
            }
          },
        ]
      }
    }
  });

  const b1Pe = await prisma.module.create({
    data: {
      title: "Production Écrite B1 — Expression d'Opinion",
      type: "PE",
      level: "B1",
      description: "Görüş bildirme ve argüman yapısı. AI destekli kompozisyon değerlendirmesi.",
      exercises: {
        create: [
          {
            title: "Réseaux Sociaux : Pour ou contre ?",
            content: "Les réseaux sociaux ont complètement transformé notre façon de communiquer. Selon vous, sont-ils plutôt bénéfiques ou néfastes pour les jeunes ? Donnez votre opinion et justifiez-la avec des exemples précis. (150-180 mots)",
            type: "TEXT"
          }
        ]
      }
    }
  });

  const b1Vocabulaire = await prisma.module.create({
    data: {
      title: "Connecteurs Logiques B1",
      type: "Vocabulaire",
      level: "B1",
      description: "DELF B1'de olmaz olmaz; tartışma ve kompozisyon metinlerinde kullanılan mantık bağlaçları.",
      exercises: {
        create: [
          { title: "Cependant", content: JSON.stringify({ word: "Cependant", translation: "Bununla birlikte, ancak", context: "Il a bien travaillé. Cependant, il n a pas réussi son examen.", type: "VOCABULARY" }), type: "TEXT" },
          { title: "De plus", content: JSON.stringify({ word: "De plus / En outre", translation: "Ayrıca, bunun yanı sıra", context: "Ce projet est innovant. De plus, il est économique et écologique.", type: "VOCABULARY" }), type: "TEXT" },
          { title: "Par conséquent", content: JSON.stringify({ word: "Par conséquent", translation: "Bu nedenle, sonuç olarak", context: "Il a oublié son passeport. Par conséquent, il n a pas pu prendre l avion.", type: "VOCABULARY" }), type: "TEXT" },
          { title: "Néanmoins", content: JSON.stringify({ word: "Néanmoins", translation: "Yine de, buna rağmen", context: "La situation est difficile. Néanmoins, nous devons trouver une solution.", type: "VOCABULARY" }), type: "TEXT" },
          { title: "En revanche", content: JSON.stringify({ word: "En revanche", translation: "Buna karşın, öte yandan", context: "Mon frère aime le sport. En revanche, ma soeur préfère la lecture.", type: "VOCABULARY" }), type: "TEXT" },
        ]
      }
    }
  });

  // --- B2 MODÜLLERİ ---
  const b2CE = await prisma.module.create({
    data: {
      title: "Intelligence Artificielle et Société",
      type: "CE",
      level: "B2",
      description: "DELF B2 / Terminal sınav hazırlık: Yapay zeka ve toplum üzerine ileri düzey analitik okuma.",
      exercises: {
        create: [
          {
            title: "Analyse du Texte",
            content: `L'intelligence artificielle représente l'une des révolutions technologiques les plus profondes de notre époque. Ses applications s'étendent à des domaines aussi variés que la médecine, le droit, l'éducation et les arts. Si ses partisans y voient un formidable outil d'émancipation humaine, ses détracteurs s'inquiètent des dérives potentielles : surveillance de masse, renforcement des inégalités, et perte d'autonomie intellectuelle.

Yazara göre yapay zekanın temel paradoksu nedir?`,
            type: "MCQ",
            options: {
              create: [
                { text: "Çok pahalı olması ama verimsiz kalması", isCorrect: false },
                { text: "İnsan zekasını taklit etmesi ama gerçek bir bilince sahip olmaması", isCorrect: true },
                { text: "Yalnızca zengin ülkelere hizmet etmesi", isCorrect: false },
                { text: "Sanat ve edebiyatta başarısız olması", isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  });

  const b2Grammaire = await prisma.module.create({
    data: {
      title: "Le Subjonctif et la Condition",
      type: "Grammaire",
      level: "B2",
      description: "B2 seviyesi için zorunlu: Subjonctif Présent kullanımı, dilek ve koşul cümleleri.",
      exercises: {
        create: [
          {
            title: "Subjonctif Présent — Doğru Formu Seç",
            content: "Il faut que tu ___ à l'heure demain. (venir)",
            type: "MCQ",
            options: {
              create: [
                { text: "viens", isCorrect: false },
                { text: "viennes", isCorrect: true },
                { text: "venez", isCorrect: false },
                { text: "aller", isCorrect: false },
              ]
            }
          },
        ]
      }
    }
  });

  console.log('✅ NeonDB başarıyla tohumlandı!');
  console.log(`Oluşturulan Modüller: A1 Vocabulaire, A1 Grammaire, A2 CE, B1 CE, B1 PE, B1 Vocabulaire, B2 CE, B2 Grammaire`);
  console.log(`Toplam: 8 modül, çok sayıda egzersiz ve MCQ seçeneği.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
