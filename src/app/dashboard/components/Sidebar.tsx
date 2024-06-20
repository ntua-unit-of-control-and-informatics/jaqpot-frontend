'use client';

import Logo from '@/app/dashboard/components/Logo/Logo';
import Link from 'next/link';

import {
  ArrowLeftStartOnRectangleIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  QueueListIcon,
  TableCellsIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import { Button } from '@nextui-org/button';
import {
  SidebarContext,
  SidebarContextType,
} from '@/app/dashboard/dashboard-layout';
import { Tooltip } from '@nextui-org/tooltip';
import JLogo from '@/app/dashboard/components/Logo/JLogo';
import UserOrganizations from '@/app/dashboard/components/UserOrganizations';

interface NavElement {
  name: string;
  icon: ReactElement;
  href: string;
  after?: ReactElement;
}

export default function Sidebar() {
  const { data: session } = useSession();
  const { isCollapsed, setIsCollapsed } =
    useContext<SidebarContextType>(SidebarContext);
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
        className={`flex items-center p-2 text-indigo-200 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 group ${pathname === `/${href}` ? 'bg-indigo-700' : ''}`}
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
      href: 'dashboard/datasets',
      name: 'Your datasets',
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
      className={`flex justify-end items-start w-full p-4 md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setIsCollapsed(true);
      }}
    >
      <XCircleIcon className="h-10 w-10 text-white cursor-pointer" />
    </div>
  );

  function getCollapsableStateClassname() {
    const shownClass = 'translate-x-0';
    const hiddenClass = '-translate-x-full';

    return isCollapsed ? hiddenClass : shownClass;
  }

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
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
        className={`fixed flex top-0 left-0 z-40 w-72 h-screen bg-indigo-600 dark:bg-gray-900 transition-transform ${getCollapsableStateClassname()}`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex px-4 py-4 items-center">
            <Tooltip content="Close sidebar">
              <Button
                isIconOnly
                className={'hidden sm:block bg-transparent text-white'}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ArrowLeftStartOnRectangleIcon className="size-6" />
              </Button>
            </Tooltip>
          </div>

          <div className="px-3 pb-4">
            <Link
              href={`/dashboard`}
              className={`flex items-center p-2 text-indigo-200 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 ${pathname === `/dashboard` ? 'bg-indigo-700' : ''} group`}
            >
              <JLogo />
              <span className="ms-3">Jaqpot</span>
            </Link>
            <Link
              href={`/dashboard/explore`}
              className={`flex items-center p-2 text-indigo-200 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 group`}
            >
              <QueueListIcon className="size-6" />

              <span className="ms-3">Explore models</span>
            </Link>
          </div>
          <nav className="px-3 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <div className="text-xs p-2 uppercase text-indigo-200 dark:text-white">
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
                  className="flex gap-x-3 w-full p-2 text-indigo-200 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-indigo-200 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white"
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
            </ul>
          </nav>

          <nav className="px-3 pt-4 pb-4 overflow-y-auto">
            <UserOrganizations />
          </nav>
        </div>
      </aside>
      {!isCollapsed && <ModalOverlay />}
    </>
  );
}
