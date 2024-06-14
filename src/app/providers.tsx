'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <NextUIProvider navigate={router.push}>
        <div>
          <Toaster toastOptions={{ duration: 7500 }} />
        </div>
        {children}
      </NextUIProvider>
    </>
  );
}
