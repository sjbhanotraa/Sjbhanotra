import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sanjana Sharma — Portfolio Entry Experience',
  description: 'UI/UX Designer · Digital Experiences · Creative Development',
  icons: {
    icon: '/favicon.ico',
  },
};

import { CustomCursor } from '@/components/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600;1,700&family=Italiana&family=Playfair+Display:ital,wght@1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/assets/fonts/NeueMontreal-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
