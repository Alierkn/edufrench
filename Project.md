# EduFrancais — Fransız Liselerine Özel Akademik Modül Sistemi

**EduFrancais**, Türkiye’de Fransız liselerinde (Saint Joseph, Saint Benoît, Notre Dame de Sion vb.) okuyan öğrenciler için özel olarak tasarlanmış dijital bir akademik çalışma platformudur.

## Ana Misyon
Fransız liselerinde okuyan öğrencilerin CE, CO, PE, PO, grammaire ve vocabulaire alanlarında sistemli, tekrar edilebilir, seviyeye uygun ve sınav odaklı şekilde gelişmesini sağlamak.

## Pedagojik Omurga
1. **Ana Çekirdek Modüller:**
   - **CE** — Compréhension Écrite
   - **CO** — Compréhension Orale
   - **PE** — Production Écrite
   - **PO** — Production Orale
2. **Destekleyici Temel Modüller:**
   - Grammaire
   - Vocabulaire

## Tasarım Dili (UI/UX)
**Neo-Brutalist Academic Learning UI** 
Eğlenceli olmak yerine, motive edici, sıkı bir yapı. Siyah kalın sınırlar, pastel/canlı arka planlar, sert kutu gölgeleri ile öğrencilerin odaklı kalması hedeflenir. Tailwind CSS `globals.css` içerisinde özel class'lar ile tasarlanmıştır (`.neo-box`, `.neo-btn` vb).

## Teknik Katman (Sprint 1)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (V4 PostCSS bazlı kurulum + Custom tokens)
- **State & Animations:** Zustand & Framer Motion (gelecekteki mantıklar için altyapı)
- **Navigasyon:** `(learning)` route parantezi ile bağımsız layout kurularak Dashboard ve Modül isolate edilmiştir.

## Komutlar
- Geliştirme (Lokal Sunucu): `npm run dev`
- Üretim Derlemesi: `npm run build`
