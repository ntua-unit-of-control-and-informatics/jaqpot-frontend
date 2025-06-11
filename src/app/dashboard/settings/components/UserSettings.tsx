'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Switch } from '@nextui-org/switch';
import React, { useContext } from 'react';
import { useSession } from 'next-auth/react';
import {} from '@/app/dashboard/dashboard-layout';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';

export default function UserSettings() {
  const { data: session } = useSession();
  const userSettings = useUserSettingsStore((state) => state.userSettings);
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );

  return (
    <div>
      <Switch
        defaultSelected={userSettings?.darkMode}
        isSelected={userSettings?.darkMode ?? false}
        onValueChange={(isSelected) => {
          updateUserSettings({
            ...userSettings,
            darkMode: !userSettings?.darkMode,
          });
        }}
        size="lg"
        color="secondary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <MoonIcon className={className} />
          ) : (
            <SunIcon className={className} />
          )
        }
      >
        Dark mode
      </Switch>
    </div>
  );
}
