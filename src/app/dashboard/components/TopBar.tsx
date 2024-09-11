'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import UserAvatar from '@/app/dashboard/components/UserAvatar';
import { Session } from 'next-auth';
import SearchBar from '@/app/dashboard/components/SearchBar';
import {
  ArrowRightStartOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/solid';
import React, { useContext } from 'react';
import CreateMenu from '@/app/dashboard/components/CreateMenu';
import { useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import GithubLogo from '@/app/dashboard/components/GithubLogo';
import {
  SidebarContext,
  SidebarContextType,
} from '@/app/dashboard/dashboard-layout';
import { Tooltip } from '@nextui-org/tooltip';
import { UserSettingsContext } from '@/app/dashboard/contexts';

export default function TopBar() {
  const { data: session } = useSession();
  const { isCollapsed, setIsCollapsed } =
    useContext<SidebarContextType>(SidebarContext);
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);

  return (
    <div className="w-full border-b border-b-gray-300 px-4 py-3 shadow-[rgba(0,0,0,0.05)_0_1px_2px_0px] sm:px-8">
      <div className="flex flex-row gap-2 sm:gap-x-6">
        <div className={`hidden ${isCollapsed ? 'sm:flex' : ''} items-center`}>
          <Tooltip content="Open sidebar">
            <Button
              isIconOnly
              className="justify-start bg-transparent"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ArrowRightStartOnRectangleIcon className="size-6" />
            </Button>
          </Tooltip>
        </div>

        <SearchBar />
        <div className="flex items-center gap-0 sm:gap-x-2">
          <CreateMenu />
          <Button variant="light" className="min-w-10 p-2">
            <BellIcon className="size-6 text-gray-400" />
          </Button>
          <GithubLogo className="hidden sm:block" />
          <Button
            variant="light"
            className="hidden min-w-10 p-2 sm:block"
            onClick={() =>
              setUserSettings({
                ...userSettings,
                darkMode: !userSettings?.darkMode,
              })
            }
          >
            <MoonIcon className="block size-6 text-violet-700 dark:hidden" />
            <SunIcon className="hidden size-6 text-yellow-500 dark:block" />
          </Button>
          {/*DIVIDER*/}
          <div
            className="h-6 w-px bg-gray-900 bg-opacity-10"
            aria-hidden="true"
          ></div>
          <UserAvatar session={session} />
        </div>
      </div>
    </div>
  );
}
