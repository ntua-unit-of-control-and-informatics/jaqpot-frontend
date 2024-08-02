'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Switch } from '@nextui-org/switch';
import React, { useContext } from 'react';
import useUserSettings from '@/app/hooks/useUserSettings';
import { useSession } from 'next-auth/react';
import {
  UserSettingsContext,
  UserSettingsContextType,
} from '@/app/dashboard/dashboard-layout';

export default function UserSettings() {
  const { data: session } = useSession();
  const { userSettings, setUserSettings } = useContext(UserSettingsContext);

  return (
    <div>
      <Switch
        defaultSelected={userSettings?.darkMode}
        isSelected={userSettings?.darkMode ?? false}
        onValueChange={(isSelected) => {
          setUserSettings({
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
