'use client';

import { BellIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
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
import { Tooltip } from '@nextui-org/tooltip';
import NotificationsMenu from '@/app/dashboard/components/NotificationsMenu';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { Link } from '@nextui-org/link';
import { isAuthenticated } from '@/app/util/auth';

export default function TopBar() {
  const { data: session } = useSession();
  const userSettings = useUserSettingsStore((state) => state.userSettings);
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );

  return (
    <div className="w-full border-b border-b-gray-300 px-4 py-3 shadow-[rgba(0,0,0,0.05)_0_1px_2px_0px] sm:px-8">
      <div className="flex flex-row gap-x-4 sm:gap-x-6">
        <div
          className={`hidden ${userSettings.collapseSidebar ? 'sm:flex' : ''} items-center`}
        >
          <Tooltip content="Open sidebar">
            <Button
              isIconOnly
              className="justify-start bg-transparent"
              onClick={() =>
                updateUserSettings({
                  ...userSettings,
                  collapseSidebar: !userSettings.collapseSidebar,
                })
              }
            >
              <ArrowRightStartOnRectangleIcon className="size-6" />
            </Button>
          </Tooltip>
        </div>

        <SearchBar />
        <div className="flex items-center gap-x-1">
          <CreateMenu />
          <NotificationsMenu />
          <GithubLogo className="hidden text-foreground/50 sm:block" />
          <Button
            variant="light"
            isIconOnly
            as={Link}
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/docs`}
            className={`hidden sm:flex`}
            isExternal
          >
            <QuestionMarkCircleIcon className="size-7 text-gray-400" />
          </Button>
          <Button
            variant="light"
            className="hidden min-w-10 p-2 sm:block"
            onClick={() =>
              updateUserSettings({
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
