import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Storyify Anime • Cinematic Anime Visual Novel Learning',
  description:
    'Transform dense textbook chapters into cinematic Makoto Shinkai & Studio Ghibli style interactive visual novels with gated boss battles and concept codexes.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a13] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
