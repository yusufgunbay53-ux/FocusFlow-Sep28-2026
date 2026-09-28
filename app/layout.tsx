import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow — AI Odak Asistanı",
  description: "Kanban, Pomodoro ve AI performans koçu ile odaklan.",
  manifest: "/manifest.json",
  applicationName: "FocusFlow",
};

export const viewport: Viewport = {
  themeColor: "#0b111e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="text-slate-100 antialiased">{children}</body>
    </html>
  );
}
