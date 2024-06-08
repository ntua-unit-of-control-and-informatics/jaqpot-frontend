import {
  BuildingOfficeIcon,
  PlusIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { classNames } from '@/app/util/classname';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';

export default function CreateMenu() {
  return (
    <>
      <Menu as="div" className="relative inline-block">
        <Tooltip showArrow={true} content="Create new...">
          <MenuButton className="inline-flex  items-center w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold">
            <PlusIcon className="size-6 text-gray-400" />
            <ChevronDownIcon
              className="-mr-1 size-4 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>
        </Tooltip>

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
                  <Link
                    href="/dashboard/organizations/create"
                    type="submit"
                    className={classNames(
                      focus
                        ? 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-slate-400'
                        : 'text-gray-700 dark:text-slate-400',
                      'flex justify-left w-full px-4 py-2',
                    )}
                  >
                    <BuildingOfficeIcon className="size-6 mr-2" />
                    New Organization
                  </Link>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </>

    // <button type="button" className="p-2.5">
    //   <PlusIcon className="size-6 text-gray-400" />
    // </button>
  );
}
