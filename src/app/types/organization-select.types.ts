import { OrganizationDto } from '@/app/api.types';

export interface OrganizationVisibilityValue {
  key: OrganizationDto['visibility'];
  label: string;
  description: string;
}

export const organizationVisibilitySelectValues: OrganizationVisibilityValue[] =
  [
    {
      key: 'PUBLIC',
      label: 'Public',
      description: 'Anyone can view your organization and share models with it',
    },
    {
      key: 'PRIVATE',
      label: 'Private',
      description:
        'Only you and the organization member can see this organization',
    },
  ];
