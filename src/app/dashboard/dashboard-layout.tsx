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
import { SessionProvider, useSession } from 'next-auth/react';
import { getItemFromLocalStorage } from '@/app/util/local-storage';
import { Session } from 'next-auth';
import {
  UserSettingsContext,
  UserSettingsType,
} from '@/app/dashboard/contexts';

type SidebarCollapseStatus = boolean | undefined;

export type SidebarContextType = {
  isCollapsed: SidebarCollapseStatus;
  setIsCollapsed: Dispatch<SetStateAction<SidebarCollapseStatus>>;
};

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

function generateUserSettingsKey(session: Session | null) {
  return `jaqpot-user-settings-${session?.user?.id ?? ''}`;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState<SidebarCollapseStatus>();
  const [userSettings, setUserSettings] = useState<
    UserSettingsType | undefined
  >();

  useEffect(() => {
    if (!userSettings) {
      setUserSettings(
        getItemFromLocalStorage(generateUserSettingsKey(session)),
      );
      return;
    }
    if (userSettings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem(
      generateUserSettingsKey(session),
      JSON.stringify(userSettings),
    );
  }, [userSettings]);

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
        className={`transition-margin-left min-h-screen ${getContentCollapsableStateClassname()}`}
      >
        <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
          <TopBar />
          <main className="p-2 sm:p-8">{children}</main>
        </UserSettingsContext.Provider>
      </div>
    </SidebarContext.Provider>
  );
}
