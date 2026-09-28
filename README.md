# FocusFlow

AI destekli görev ve odaklanma asistanı.

- Dark neon UI (`#00d2ff` / `#0b111e`), glassmorphism
- Sürükle-bırak Kanban (Yapılacaklar / Yapılıyor / Tamamlandı)
- 25/5 Pomodoro, tarayıcı bildirimi + ses
- Procedural Lo-Fi ve yağmur sesi (Web Audio)
- Mock AI performans koçu (`lib/aiCoach.ts` — API’ye hazır)
- `localStorage` kalıcılığı
- PWA manifest

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı: http://localhost:3000

## Veri modeli

`lib/types.ts` içindeki `Task` ve `PomodoroLog` yapıları Supabase / Firebase’e taşınacak şekilde düz JSON’dur.
