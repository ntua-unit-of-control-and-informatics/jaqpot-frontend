'use client';

import Sidebar from '@/app/dashboard/components/Sidebar';
import { auth } from '@/auth';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import TopBar from '@/app/dashboard/components/TopBar';
import { SessionProvider } from 'next-auth/react';

export type SidebarContextType = {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
};

const isMobileSize = window.innerWidth < 768;
console.log(window.innerWidth);

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: isMobileSize,
  setIsCollapsed: () => {},
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(isMobileSize);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <Sidebar />
      <div
        className={`min-h-screen transition-all ml-0 ${isCollapsed ? 'sm:ml-0' : 'sm:ml-72'}`}
      >
        <TopBar />
        <main className="p-8">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
