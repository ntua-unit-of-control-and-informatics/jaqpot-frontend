'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { Session } from 'next-auth';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { signIn, signOut } from 'next-auth/react';
import { classNames } from '@/app/util/classname';
import { isAuthenticated } from '@/app/util/auth';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { User } from '@nextui-org/react';

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  onPress?: () => {};
}

export default function UserAvatar({ session }: { session: Session | null }) {
  const router = useRouter();

  const unauthenticatedMenuItems: MenuItem[] = [
    {
      key: 'signin',
      onPress: () => signIn('keycloak'),
      label: 'Sign in',
    },
  ];

  const authenticatedMenuItems: MenuItem[] = [
    {
      key: 'account',
      href: '/account',
      label: 'Account',
    },
    {
      key: 'settings',
      href: '/settings',
      label: 'Settings',
    },
    {
      key: 'signout',
      onPress: () => signOut(),
      label: 'Sign out',
    },
  ];

  return (
    <Dropdown
      backdrop="blur"
      classNames={{
        trigger: 'min-w-0 gap-0 px-0 pl-2', // change arrow background
      }}
    >
      <DropdownTrigger>
        <Button variant="light">
          <User
            avatarProps={{
              size: 'sm',
              showFallback: true,
              src: session?.user?.image || undefined,
            }}
            name={session?.user?.name}
          />
          <ChevronDownIcon
            className="ml-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User Actions"
        items={
          isAuthenticated(session)
            ? authenticatedMenuItems
            : unauthenticatedMenuItems
        }
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === 'delete' ? 'danger' : 'default'}
            className={item.key === 'logout' ? 'text-danger' : ''}
            href={item.href}
            onPress={item.onPress}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
