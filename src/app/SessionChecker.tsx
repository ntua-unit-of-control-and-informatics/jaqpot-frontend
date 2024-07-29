'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SessionChecker() {
  useEffect(() => {
    fetch(`/api/auth/validate`)
      .then(async (res) => {
        if (!res.ok && res.status === 401) {
          await signOut({ redirect: false });
        }
      })
      .catch(() => signOut({ redirect: false }));
  });

  return null;
}
