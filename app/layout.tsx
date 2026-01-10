import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Inno - Gestion d\'Événements',
  description: 'Inno - Système intelligent de gestion des invités pour vos événements',
  icons: {
    icon: '/inno1.png',
    shortcut: 'inno1.png',
    apple: '/inno1.png',
  },
  openGraph: {
    title: 'Inno - Gestion d\'Événements',
    description: 'Inno - Système intelligent de gestion des invités pour vos événements',
    images: ['/inno1.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" async />
      </head>
      <body className="font-outfit">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}