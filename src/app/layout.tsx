import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/app/components/GoogleAnalytics';
import { Providers } from '@/app/providers';
import { openGraphImage } from '@/app/shared.metadata';
import CookiesConsent from '@/app/components/CookieConsent';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { logger } from '@/logger';

const log = logger.child({ module: 'userOrganizations' });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jaqpot',
  description:
    "The Jaqpot project's app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.",
  openGraph: {
    title: 'Jaqpot',
    description:
      "The Jaqpot project's app serves as the interactive gateway for users to engage with our predictive modeling platform. Users can upload models and obtain predictions seamlessly.",
    ...openGraphImage,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let userSettings = { darkMode: false };
  if (isAuthenticated(session)) {
    try {
      const res = await fetch(`${process.env.API_URL}/v1/user/settings`, {
        headers: {
          Authorization: `Bearer ${session!.token}`,
        },
      });
      userSettings = await res.json();
    } catch (e) {
      log.warn('Failed to fetch user settings', e);
    }
  }

  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        className={`${inter.className} bg-white dark:bg-slate-800 dark:text-slate-400 ${userSettings.darkMode ? 'dark' : ''}`}
      >
        <CookiesConsent />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
