import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { text, level, promptTitle } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
       return NextResponse.json({ 
         score: "API Eksik", 
         feedback: "Sistemde OpenAI (ChatGPT) entegrasyon şifresi bulunamadı. Lütfen kuruluma .env ile `OPENAI_API_KEY` ekleyin ki asistanınız çalışsın." 
       });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
          role: "system", 
          content: "Sen Paris'te yaşayan, son derece disiplinli, profesyonel bir DELF / DALF lise öğretmenisin. Öğrencinin sana yolladığı kompozisyonu okuyacak, gramer ve kelime dağarcığını acımasız ama inanılmaz eğitici bir tonla eleştireceksin. Cevabın kısa, madde madde ve net olmalı (Maksimum 3-4 cümle). Yanlış yazılan bir cümleyi doğrusuyla değiştirerek göster. Türkçe ağırlıklı konuş ama Fransızca terimleri serpiştir. En sonda 10 üzerinden bir puan ver." 
        },
        { 
          role: "user", 
          content: `Sınav Konusu: ${promptTitle}\nHedef Seviye: ${level}\n\nÖğrenci Yazısı:\n"${text}"` 
        }
      ]
    });

    return NextResponse.json({ 
       score: "AI Analizi", 
       feedback: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error("AI Hatası", error);
    return NextResponse.json({ error: "Yapay zeka analizinde hata oluştu." }, { status: 500 });
  }
}
