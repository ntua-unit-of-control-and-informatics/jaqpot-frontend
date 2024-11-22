'use client';

import Link from 'next/link';

import {
  ArrowLeftStartOnRectangleIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  QueueListIcon,
  ShieldCheckIcon,
  TableCellsIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { signIn, useSession } from 'next-auth/react';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import JLogo from '@/app/dashboard/components/Logo/JLogo';
import UserOrganizations from '@/app/dashboard/components/UserOrganizations';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';

interface NavElement {
  name: string;
  icon: ReactElement;
  href: string;
  after?: ReactElement;
}

export default function Sidebar() {
  const { data: session } = useSession();
  const userSettings = useUserSettingsStore((state) => state.userSettings);
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const navElement = (
    index: number,
    href: string,
    name: string,
    icon: ReactElement,
    after?: ReactElement,
  ) => (
    <li key={index}>
      <Link
        href={`/${href}`}
        className={`group flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700 ${pathname === `/${href}` ? 'bg-indigo-700' : ''}`}
      >
        {icon}

        <span className="ms-3">{name}</span>
        {/*<span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">*/}
        {/*  Pro*/}
        {/*</span>*/}
        {after}
      </Link>
    </li>
  );

  const pathname = usePathname();

  const iconClassName =
    'w-5 h-5 text-indigo-200 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white';

  const navElements: NavElement[] = [
    {
      href: 'dashboard/models',
      name: 'Your models',
      icon: <CircleStackIcon className={iconClassName} />,
    },
    {
      href: 'dashboard/results',
      name: 'Your results',
      icon: <TableCellsIcon className={iconClassName} />,
    },
    {
      href: 'dashboard/settings',
      name: 'Settings',
      icon: <Cog8ToothIcon className={iconClassName} />,
    },
  ];

  const ModalOverlay = () => (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 z-30 flex w-full items-start justify-end bg-black/50 p-4 md:hidden`}
      onClick={() => {
        updateUserSettings({ ...userSettings, collapseSidebar: true });
      }}
    >
      <XCircleIcon className="h-10 w-10 cursor-pointer text-white" />
    </div>
  );

  function getCollapsableStateClassname() {
    const shownClass = 'translate-x-0';
    const hiddenClass = '-translate-x-full';

    if (userSettings.collapseSidebar === undefined) {
      return '-translate-x-full sm:translate-x-0';
    } else if (userSettings.collapseSidebar) {
      return hiddenClass;
    } else if (!userSettings.collapseSidebar) {
      return shownClass;
    }
  }

  return (
    <>
      <button
        onClick={() =>
          updateUserSettings({ ...userSettings, collapseSidebar: false })
        }
        type="button"
        className="ms-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 bg-indigo-600 transition-transform dark:bg-gray-900 ${getCollapsableStateClassname()}`}
        aria-label="Sidebar"
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center px-4 py-4">
            <Tooltip content="Close sidebar">
              <Button
                isIconOnly
                className={'hidden bg-transparent text-white sm:block'}
                onClick={() => {
                  updateUserSettings({
                    ...userSettings,
                    collapseSidebar: true,
                  });
                }}
              >
                <ArrowLeftStartOnRectangleIcon className="size-6" />
              </Button>
            </Tooltip>
          </div>

          <div className="px-3 pb-4">
            <Link
              href={`/dashboard`}
              className={`flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700 ${pathname === `/dashboard` ? 'bg-indigo-700' : ''} group`}
            >
              <JLogo className="align-center flex size-6 items-center rounded-full bg-indigo-200 p-0.5" />
              <span className="ms-3">Jaqpot</span>
            </Link>
            <Link
              href={`/dashboard/explore`}
              className={`group flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700`}
            >
              <QueueListIcon className="size-6" />

              <span className="ms-3">Explore models</span>
            </Link>
          </div>
          <nav className="px-3 pb-4 pt-4">
            <ul className="space-y-2 font-medium">
              <div className="p-2 text-xs uppercase text-indigo-200 dark:text-white">
                Navigation
              </div>
              {navElements.map(({ href, name, icon, after }, index) =>
                navElement(index, href, name, icon, after),
              )}

              {!isAuthenticated(session) && (
                <button
                  onClick={async () => {
                    await signIn('keycloak');
                  }}
                  type="submit"
                  className="group flex w-full gap-x-3 rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-indigo-200 transition duration-75 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  Sign In
                </button>
              )}

              {(userSettings.isAdmin || userSettings.isUpci) && (
                <li>
                  <Link
                    href={`/dashboard/admin`}
                    className={`group flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700 ${pathname === `/admin` ? 'bg-indigo-700' : ''}`}
                  >
                    <ShieldCheckIcon className="size-5" />

                    <span className="ms-3">Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <nav className="overflow-y-auto px-3 pb-4 pt-4">
            <UserOrganizations />
          </nav>
        </div>
      </aside>
      {userSettings.collapseSidebar !== undefined &&
        !userSettings.collapseSidebar && <ModalOverlay />}
    </>
  );
}
