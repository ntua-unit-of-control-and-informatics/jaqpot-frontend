import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/app/components/GoogleAnalytics';
import { useRouter } from 'next/navigation';
import { Providers } from '@/app/providers';
import { openGraphImage } from '@/app/shared.metadata';
import CookiesConsent from '@/app/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jaqpot',
  description:
    "The Jaqpot project's frontend app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.",
  openGraph: {
    title: 'Jaqpot',
    description:
      "The Jaqpot project's frontend app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.",
    ...openGraphImage,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        className={`${inter.className} bg-white dark:bg-slate-800 dark:text-slate-400`}
      >
        <CookiesConsent />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
