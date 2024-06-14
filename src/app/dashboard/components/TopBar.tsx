'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import UserAvatar from '@/app/dashboard/components/UserAvatar';
import { Session } from 'next-auth';
import SearchBar from '@/app/dashboard/components/SearchBar';
import { MoonIcon, PlusIcon, SunIcon } from '@heroicons/react/24/solid';
import React from 'react';
import CreateMenu from '@/app/dashboard/components/CreateMenu';
import { useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import GithubLogo from '@/app/dashboard/components/GithubLogo';

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <div className="w-full px-8 py-3 border-b border-b-gray-300 shadow-[rgba(0,0,0,0.05)_0_1px_2px_0px]">
      <div className="flex flex-row sm:gap-x-6 ">
        <SearchBar />
        <div className="flex gap-x-2 items-center">
          <CreateMenu />
          <Button variant="light" className="p-2 min-w-10">
            <BellIcon className="size-6 text-gray-400" />
          </Button>
          <GithubLogo />
          <Button
            variant="light"
            className="p-2 min-w-10"
            onClick={() => document.body.classList.toggle('dark')}
          >
            <MoonIcon className="size-6 text-violet-700 block dark:hidden" />
            <SunIcon className="size-6 text-yellow-500  hidden dark:block" />
          </Button>
          {/*DIVIDER*/}
          <div
            className="bg-gray-900 w-px h-6 bg-opacity-10"
            aria-hidden="true"
          ></div>
          <UserAvatar session={session} />
        </div>
      </div>
    </div>
  );
}
