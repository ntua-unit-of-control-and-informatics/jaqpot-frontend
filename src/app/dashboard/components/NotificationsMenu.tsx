import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface NotificationDto {
  title: string;
  href: string;
}

export default function NotificationsMenu() {
  const notifications: NotificationDto[] = [];

  return (
    <Dropdown
      classNames={{
        trigger: 'p-0 min-w-0 gap-0', // change arrow background
      }}
    >
      <DropdownTrigger>
        <Button variant="light" className="min-w-10 p-2" isIconOnly>
          <BellIcon className="size-6 text-gray-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="View notifications"
        emptyContent={'No notifications found'}
      >
        {notifications.map((notification) => (
          <DropdownItem
            key="new-model"
            textValue="New Model"
            href={notification.href}
          >
            {notification.title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
