import { OrganizationDto } from '@/app/api.types';

interface OrganizationEditTabProps {
  organization: OrganizationDto;
}

export default function OrganizationEditTab({
  organization,
}: OrganizationEditTabProps) {
  return <div>edit organization {organization.id}</div>;
}
