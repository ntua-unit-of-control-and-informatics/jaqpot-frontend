import React from 'react';
import SettingsBreadcrumbs from '@/app/dashboard/settings/components/SettingsBreadcrumbs';
import UserSettings from '@/app/dashboard/settings/components/UserSettings';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export const metadata: Metadata = generateSharedMetadata(
  'Settings',
  'Manage your preferences and customize your account settings for a personalized experience',
);

export default function Page() {
  return (
    <div>
      <SettingsBreadcrumbs />
      <h2 className="mb-10 scroll-m-20 border-b pb-2 text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
        Settings
      </h2>
      <UserSettings />
    </div>
  );
}
