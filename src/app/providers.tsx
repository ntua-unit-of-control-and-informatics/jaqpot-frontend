'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import SessionChecker from '@/app/SessionChecker';
import { useEffect } from 'react';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import UserSettingsManager from '@/app/UserSettingsManager';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userSettings = useUserSettingsStore((state) => state.userSettings);

  useEffect(() => {
    if (userSettings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [userSettings]);

  return (
    <>
      <NextUIProvider navigate={router.push}>
        <SessionChecker />
        <UserSettingsManager />
        <div>
          <Toaster toastOptions={{ duration: 7500 }} />
        </div>
        {children}
      </NextUIProvider>
    </>
  );
}
