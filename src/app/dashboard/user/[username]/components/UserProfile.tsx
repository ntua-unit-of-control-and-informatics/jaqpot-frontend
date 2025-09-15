'use client';

import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { CardHeader } from '@heroui/card';
import { getAvatarFallbackImg } from '@/app/util/avatar';
import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import React, { ChangeEvent, useRef, useState } from 'react';
import { UserDto } from '@/app/api.types';
import {
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { useUserSettingsStore } from '@/app/stores/userSettingsStore';
import { ApiResponse } from '@/app/util/response';
import toast from 'react-hot-toast';
import { Skeleton } from '@heroui/skeleton';
import { Link } from '@heroui/link';

interface UserProfileProps {
  user: UserDto;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user.avatarUrl,
  );
  const updateUserSettings = useUserSettingsStore(
    (state) => state.updateUserSettings,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteUserAvatar = async () => {
    setIsLoading(true);
    const res = await fetch('/api/user/avatar', {
      method: 'DELETE',
    });
    const { success, message }: ApiResponse = await res.json();
    if (success) {
      setAvatarUrl(undefined);
      updateUserSettings({ avatarUrl: undefined }, false);
    } else {
      toast.error(`Error deleting avatar:  ${message}`);
    }
    setIsLoading(false);
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
      const { success, data, message }: ApiResponse<{ avatarUrl: string }> =
        await res.json();
      if (success) {
        setAvatarUrl(data!.avatarUrl);
        updateUserSettings({ avatarUrl: data!.avatarUrl }, false);
      } else {
        toast.error(`Error uploading avatar:  ${message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <div className="relative">
            <Skeleton isLoaded={!isLoading}>
              <Image
                src={avatarUrl || getAvatarFallbackImg(user.email)}
                alt={`${user.firstName} ${user.lastName}`}
                className="text-large h-48 w-48"
                radius="full"
              />
            </Skeleton>

            {user.canEdit && (
              <div className="absolute -right-2 -bottom-2">
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
                    <DropdownItem key="copy" onPress={() => deleteUserAvatar()}>
                      Remove photo
                    </DropdownItem>
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
                <p className="text-lg font-medium break-all">{user.email}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Username</label>
                <p className="text-lg font-medium">@{user.username}</p>
              </div>
            </div>
            {user.canEdit && (
              <Button
                as={Link}
                href={`${process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER}/account`}
                startContent={<PencilSquareIcon className="size-5" />}
                endContent={<ArrowTopRightOnSquareIcon className="size-5" />}
                isExternal
              >
                Edit
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
