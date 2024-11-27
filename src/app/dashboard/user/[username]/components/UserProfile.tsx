'use client';

import { Card, CardBody, Image } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import { getAvatarImg } from '@/app/util/avatar';
import { Button } from '@nextui-org/button';
import { Badge } from '@nextui-org/badge';
import { ChangeEvent, useRef } from 'react';
import { UserDto } from '@/app/api.types';
import { PencilSquareIcon, PhotoIcon } from '@heroicons/react/24/solid';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { fromBase64ToImage, toBase64 } from '@/app/util/base64';

interface UserProfileProps {
  user: UserDto;
}

export default function UserProfile({ user }: UserProfileProps) {
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const rawAvatar = await toBase64(file);
      updateUserSettings({ rawAvatar });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <div className="relative">
            <Image
              src={fromBase64ToImage(user?.avatar) || getAvatarImg(user.email)}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-48 w-48 text-large"
              radius="full"
            />

            {user.canEdit && (
              <div className="absolute -bottom-2 -right-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      startContent={<PencilSquareIcon className="size-5" />}
                    >
                      Edit
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      key="new"
                      onPress={() => inputRef?.current?.click()}
                    >
                      Upload a photo...
                    </DropdownItem>
                    <DropdownItem key="copy">Remove photo</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <input
                  ref={inputRef}
                  id="avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <Badge className="w-fit">@{user.username}</Badge>
          </div>
        </CardHeader>

        <CardBody className="p-6 pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-500">First Name</label>
                <p className="text-lg font-medium">{user.firstName}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Last Name</label>
                <p className="text-lg font-medium">{user.lastName}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Email</label>
                <p className="break-all text-lg font-medium">{user.email}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Username</label>
                <p className="text-lg font-medium">@{user.username}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
