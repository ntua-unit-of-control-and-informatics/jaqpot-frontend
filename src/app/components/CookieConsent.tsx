'use client';

import { useEffect, useState } from 'react';
import { Link } from '@nextui-org/link';

const LOCAL_STORAGE_KEY = 'jaqpotCookieConsent';

export default function CookiesConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    setShowConsent(!localStorage.getItem(LOCAL_STORAGE_KEY));
  }, []);

  const acceptCookie = () => {
    setShowConsent(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-700 bg-opacity-70">
      <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-gray-100 px-4 py-8">
        <span className="text-dark mr-16 text-base">
          This website uses cookies to improve user experience. By using our
          website you consent to all cookies in accordance with our{' '}
          <Link href="https://jaqpot.org/privacy-policy" isExternal>
            Cookie Policy
          </Link>
        </span>
        <button
          className="rounded bg-indigo-500 px-8 py-2 text-white hover:bg-indigo-700"
          onClick={() => acceptCookie()}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
