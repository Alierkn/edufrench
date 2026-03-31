import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Database, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';

// SEED ACTION
async function seedDatabase() {
  "use server";
  
  // Clear existing data
  await prisma.exerciseOption.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.module.deleteMany();

  console.log("Database cleared! Injecting DELF / DALF Data (A1, A2, B1, B2)...");

  // CE - A1
  await prisma.module.create({
    data: {
      title: "Se Présenter (Kendini Tanıtma)", type: "CE", level: "A1", isActive: true,
      description: "Basit bilgilendirici bir mektubu anlama.",
      exercises: {
        create: {
          title: "Soru 1 (A1)", content: "Bonjour, je m'appelle Julien. J'habite à Paris avec ma femme. Je travaille dans une banque.\n\nSoru: Où habite Julien?", type: "MCQ",
          options: { create: [ { text: "À Lyon", isCorrect: false }, { text: "À Paris", isCorrect: true }, { text: "À Marseille", isCorrect: false } ] }
        }
      }
    }
  });

  // CE - B1
  await prisma.module.create({
    data: {
      title: "L'Éducation en France", type: "CE", level: "B1", isActive: true,
      description: "Fransa'daki not sistemini anlama makalesi.",
      exercises: {
        create: {
          title: "Not Sistemi B1", content: "En France, les notes sur 20 sont souvent très sévères. Avoir un 12/20 est déjà considéré comme une bonne note dans plusieurs matières, contrairement à d'autres pays.\n\nSoru: Est-il facile d'obtenir 20/20 au lycée français?", type: "MCQ",
          options: { create: [ { text: "Oui, c'est très facile.", isCorrect: false }, { text: "Non, les notes sont souvent sévères.", isCorrect: true } ] }
        }
      }
    }
  });

  // PE - A2
  await prisma.module.create({
    data: {
      title: "Raconter ses Vacances", type: "PE", level: "A2", isActive: true,
      description: "Tatil anılarınızı anlatan kısa bir metin yazınız.",
      exercises: {
        create: { title: "Görev: Tatil Maili", content: "Vous écrivez un email à votre ami français pour raconter vos vacances en Turquie (60-80 mots).", type: "TEXT" }
      }
    }
  });

  // PO - B1
  await prisma.module.create({
    data: {
      title: "Technologie et Société", type: "PO", level: "B1", isActive: true,
      description: "Monolog: Akıllı telefonlar bizi uzaklaştırıyor mu?",
      exercises: {
        create: { title: "Sujet 1: Les Smartphones", content: "Les smartphones nous éloignent-ils les uns des autres ? Préparez un monologue de 2 minutes.", type: "RECORDING" }
      }
    }
  });

  // CO - B2
  await prisma.module.create({
    data: {
      title: "L'Intelligence Artificielle", type: "CO", level: "B2", isActive: true,
      description: "Radyo Programı: Yapay Zekanın İş Dünyasına Etkisi.",
      exercises: {
        create: { 
          title: "Ana Fikir", 
          content: "Spiker, AI'nin iş gücünü nasıl etkileyeceğinden bahsediyor.\nSoru: Quel est le ton du journaliste concernant l'IA ?", type: "MCQ",
          options: { create: [ { text: "Enthousiaste", isCorrect: false }, { text: "Inquiet", isCorrect: false }, { text: "Nuancé (Dengeli)", isCorrect: true } ] }
        }
      }
    }
  });
  
  // Vocabulaire
  await prisma.module.create({
    data: {
      title: "Connecteurs Logiques (Set 1)", type: "Vocabulaire", level: "B1", isActive: true,
      description: "En çok kullanılan bağlaçlar listesi.",
      exercises: {
         create: [
             { title: "Cependant", content: "Bununla birlikte, ancak|Il a étudié, cependant il a échoué.", type: "FLASHCARD" },
             { title: "Démarche", content: "Yöntem, adım|La démarche scientifique est essentielle.", type: "FLASHCARD" }
         ]
      }
    }
  });

  // Grammaire
  await prisma.module.create({
    data: {
      title: "Les Pronoms Relatifs", type: "Grammaire", level: "B1", isActive: true,
      description: "Qui, Que, Où, Dont kullanımı.",
      exercises: {
         create: [
            { title: "Boşluk Doldurma 1", content: "La ville ___ j'habite est très belle.", type: "FILL", options: { create: [{text: "où", isCorrect: true}] } },
            { title: "Boşluk Doldurma 2", content: "Le livre ___ j'ai besoin est sur la table.", type: "FILL", options: { create: [{text: "dont", isCorrect: true}] } }
         ]
      }
    }
  });

  revalidatePath('/admin');
  revalidatePath('/ce');
}

export default async function AdminPage() {
  const modules = await prisma.module.findMany({
    include: { exercises: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center bg-white p-8 neo-box !border-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-neo-border)]">Veritabanı Yönetimi (CMS)</h1>
          <p className="text-xl font-bold text-gray-500 mt-2">({modules.length}) Modül ve İçerik Bulunuyor</p>
        </div>
        <form action={seedDatabase}>
           <button type="submit" className="neo-btn neo-bg-green !text-[var(--color-neo-border)] flex items-center gap-2 px-6 py-3">
             <RefreshCw /> Sistemi (A1-B2) ile Doldur
           </button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="neo-box p-6 bg-white hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-center mb-4">
               <span className="font-bold font-mono bg-black text-white px-2 py-1">{mod.type}</span>
               <span className={`font-black text-lg px-2 border-2 ${mod.level === 'A1' || mod.level === 'A2' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>{mod.level}</span>
             </div>
             <h3 className="text-2xl font-black font-sans mb-2 text-[var(--color-neo-border)]">{mod.title}</h3>
             <p className="text-gray-500 font-medium mb-4">{mod.description}</p>
             
             <div className="bg-gray-100 p-3 neo-box !border-2 flex items-center gap-3 font-bold text-gray-600">
                <Layers size={18} /> {mod.exercises.length} İçerik (Soru/Görev)
             </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="col-span-full neo-box p-12 bg-yellow-50 text-center flex flex-col items-center">
            <Database size={64} className="text-orange-400 mb-6" />
            <h2 className="text-3xl font-black mb-4">Veritabanınız Şu An Boş</h2>
            <p className="text-xl font-medium text-gray-600">Yukarıdaki "Sistemi Doldur" butonuna basarak profesyonel DELF içeriklerini aktarabilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
