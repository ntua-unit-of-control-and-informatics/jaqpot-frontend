'use client';

import Logo from '@/app/dashboard/components/Logo/Logo';
import Link from 'next/link';

import {
  CircleStackIcon,
  Cog8ToothIcon,
  HomeIcon,
  InboxIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { signIn, signOut } from 'next-auth/react';
import { ReactElement, useState } from 'react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';

export default function Sidebar({ session }: { session: Session | null }) {
  const [showSidebarOnMobile, setShowSideBarOnMobile] = useState(false);
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

  const navElements = [
    {
      href: 'dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className={iconClassName} />,
    },
    {
      href: 'dashboard/models',
      name: 'Models',
      icon: <CircleStackIcon className={iconClassName} />,
    },
    {
      href: 'inbox',
      name: 'Inbox',
      icon: <InboxIcon className={iconClassName} />,
      after: (
        <>
          <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            3
          </span>
        </>
      ),
    },
    {
      href: 'settings',
      name: 'Settings',
      icon: <Cog8ToothIcon className={iconClassName} />,
    },
  ];

  const sidebarClassName = () => {
    const sidebarDefaultClassnames =
      'fixed top-0 left-0 z-40 w-72 h-screen bg-indigo-600 dark:bg-gray-900 transition-transform sm:translate-x-0';
    if (showSidebarOnMobile) {
      return sidebarDefaultClassnames;
    } else {
      return `${sidebarDefaultClassnames} -translate-x-full`;
    }
  };

  const ModalOverlay = () => (
    <div
      className={`flex justify-end items-start w-full p-4 md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setShowSideBarOnMobile(false);
      }}
    >
      <XCircleIcon className="h-10 w-10 text-white cursor-pointer" />
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowSideBarOnMobile(!showSidebarOnMobile)}
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
        className={sidebarClassName()}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <nav className="h-full px-3 pb-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {navElements.map(({ href, name, icon, after }, index) =>
                navElement(index, href, name, icon, after),
              )}

              {!session?.user && (
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
        </div>
      </aside>
      {showSidebarOnMobile && <ModalOverlay />}
    </>
  );
}
