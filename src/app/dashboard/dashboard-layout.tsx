'use client';

import Sidebar from '@/app/dashboard/components/Sidebar';
import { ReactNode } from 'react';
import TopBar from '@/app/dashboard/components/TopBar';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const userSettings = useUserSettingsStore((state) => state.userSettings);

  function getContentCollapsableStateClassname() {
    if (userSettings.collapseSidebar === undefined) {
      return 'ml-0 sm:ml-72';
    } else if (userSettings.collapseSidebar) {
      return 'ml-0 sm:ml-0';
    } else if (!userSettings.collapseSidebar) {
      return 'ml-0 sm:ml-72';
    }
  }

  return (
    <>
      <Sidebar />
      <div
        className={`transition-margin-left min-h-screen ${getContentCollapsableStateClassname()}`}
      >
        <TopBar />
        <main className="p-2 sm:p-8">{children}</main>
      </div>
    </>
  );
}
