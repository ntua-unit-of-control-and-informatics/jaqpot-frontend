'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import UserAvatar from '@/app/dashboard/components/UserAvatar';
import { Session } from 'next-auth';
import SearchBar from '@/app/dashboard/components/SearchBar';
import { MoonIcon, PlusIcon, SunIcon } from '@heroicons/react/24/solid';
import React from 'react';
import CreateMenu from '@/app/dashboard/components/CreateMenu';

export default function TopBar({ session }: { session: Session | null }) {
  return (
    <div className="w-full px-8 py-3 border-b border-b-gray-300 shadow-[rgba(0,0,0,0.05)_0_1px_2px_0px]">
      <div className="flex flex-row sm:gap-x-6 ">
        <SearchBar />
        <div className="flex gap-x-2 items-center">
          <CreateMenu />
          <button type="button" className="p-2.5">
            <BellIcon className="size-6 text-gray-400" />
          </button>
          <button
            onClick={() => document.body.classList.toggle('dark')}
            className="h-12 w-12 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoonIcon className="text-violet-700 block dark:hidden" />
            <SunIcon className="text-yellow-500  hidden dark:block" />
          </button>
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
