'use client';

import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import React from 'react';
import { ArrowPathIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/solid';
import InviteUsersButton from '@/app/dashboard/organizations/[orgName]/components/tabs/InviteUsersButton';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';
import useSWR, { Fetcher } from 'swr';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { ApiResponse } from '@/app/util/response';
import { CustomError } from '@/app/types/CustomError';
import { getUserFriendlyDate } from '@/app/util/date';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import toast from 'react-hot-toast';
import PageTitle from '@/app/components/PageTitle';
import OrganizationInvitations from '@/app/dashboard/organizations/[orgName]/components/OrganizationInvitations';
import OrganizationMembers from '@/app/dashboard/organizations/[orgName]/components/OrganizationMembers';

interface OrganizationPeopleTabProps {
  organization: OrganizationDto;
}

export default function OrganizationPeopleTab({
  organization,
}: OrganizationPeopleTabProps) {
  return (
    <div>
      <PageTitle title={'Members'} className={'my-3'} />
      <div className="mb-10">
        <OrganizationMembers organization={organization} />
      </div>
      {organization.canEdit && (
        <>
          <PageTitle title={'Invitations'} className={'my-3'} />
          <OrganizationInvitations organization={organization} />
        </>
      )}
    </div>
  );
}