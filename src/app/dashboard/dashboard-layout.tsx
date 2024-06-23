'use client';

import Sidebar from '@/app/dashboard/components/Sidebar';
import { auth } from '@/auth';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import TopBar from '@/app/dashboard/components/TopBar';
import { SessionProvider } from 'next-auth/react';

type SidebarCollapseStatus = boolean | undefined;

export type SidebarContextType = {
  isCollapsed: SidebarCollapseStatus;
  setIsCollapsed: Dispatch<SetStateAction<SidebarCollapseStatus>>;
};

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState<SidebarCollapseStatus>();

  // useEffect(() => {
  //   const isMobileSize = global.window && global.window.innerWidth < 768;
  //
  //   setIsCollapsed(isMobileSize);
  // }, []);

  function getContentCollapsableStateClassname() {
    if (isCollapsed === undefined) {
      return 'ml-0 sm:ml-72';
    } else if (isCollapsed) {
      return 'ml-0 sm:ml-0';
    } else if (!isCollapsed) {
      return 'ml-0 sm:ml-72';
    }
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <Sidebar />
      <div
        className={`min-h-screen transition-margin-left ${getContentCollapsableStateClassname()}`}
      >
        <TopBar />
        <main className="p-2 sm:p-8">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
