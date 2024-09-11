'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { isAuthenticated } from '@/app/util/auth';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { User } from '@nextui-org/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  external?: boolean;
  onPress?: () => {};
}

export default function UserAvatar({ session }: { session: Session | null }) {
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
      href: `${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/account`,
      label: 'Account',
      external: true,
    },
    {
      key: 'settings',
      href: '/dashboard/settings',
      label: 'Settings',
    },
    {
      key: 'signout',
      onPress: async () => {
        await signOut();
        const logoutUrl = new URL(
          `${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
        );

        logoutUrl.searchParams.set(
          'client_id',
          process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID!,
        );
        logoutUrl.searchParams.set(
          'post_logout_redirect_uri',
          window.location.href,
        );
        window.location.href = logoutUrl.href;
      },
      label: 'Sign out',
      external: true,
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
              src:
                session?.user?.image ||
                `https://api.dicebear.com/9.x/bottts/svg?seed=${session?.user?.email?.replace(
                  ' ',
                  '',
                )}`,
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
            endContent={
              item.external === true && (
                <ArrowTopRightOnSquareIcon className="size-5" />
              )
            }
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
