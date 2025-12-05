import "./globals.css";
import type { Metadata } from "next";

import { Web3Provider } from "@/providers/Web3Provider";

import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Match&Learn - Gamificação e Web3",
  description: "Aprenda, batalhe e ganhe recompensas reais. A plataforma de educação gamificada com integração Web3 invisível.",
  openGraph: {
    title: "Match&Learn - Gamificação e Web3",
    description: "Aprenda, batalhe e ganhe recompensas reais.",
    url: "https://matchlearn.com",
    siteName: "Match&Learn",
    images: [
      {
        url: "https://matchlearn.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Match&Learn",
    description: "Aprenda, batalhe e ganhe recompensas reais.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AuthProvider>
          <Web3Provider>
            {children}
            <Toaster />
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
