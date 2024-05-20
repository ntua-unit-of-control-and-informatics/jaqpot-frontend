'use client';

import { Fragment } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { Session } from 'next-auth';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UserAvatar({ session }: { session: Session | null }) {
  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <MenuButton className="inline-flex  items-center w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold">
          {session?.user?.image ? (
            <Image
              alt="user avatar"
              src={session?.user?.image}
              width={40}
              height={40}
              className="rounded-full w-8 h-8 aspect-square object-cover"
            />
          ) : (
            <UserCircleIcon className="size-6 text-gray-300" />
          )}

          <span className="hidden md:block">{session?.user?.name}</span>
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-white dark:bg-gray-600 dark:text-gray-100">
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  className={classNames(
                    focus
                      ? 'bg-gray-100 text-gray-900  dark:bg-slate-800 dark:text-slate-400'
                      : 'text-gray-700 dark:text-slate-400',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  Account settings
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  className={classNames(
                    focus
                      ? 'bg-gray-100 text-gray-900  dark:bg-slate-800 dark:text-slate-400'
                      : 'text-gray-700 dark:text-slate-400',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  Support
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href="#"
                  className={classNames(
                    focus
                      ? 'bg-gray-100 text-gray-900  dark:bg-slate-800 dark:text-slate-400'
                      : 'text-gray-700 dark:text-slate-400',
                    'block px-4 py-2 text-sm',
                  )}
                >
                  License
                </a>
              )}
            </MenuItem>
            <form method="POST" action="#">
              <MenuItem>
                {({ focus }) => (
                  <button
                    type="submit"
                    className={classNames(
                      focus
                        ? 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-slate-400'
                        : 'text-gray-700 dark:text-slate-400',
                      'block w-full px-4 py-2 text-left text-sm',
                    )}
                  >
                    Sign out
                  </button>
                )}
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
