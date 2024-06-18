import { auth } from '@/auth';
import { ModelDto } from '@/app/api.types';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  BeakerIcon,
  ChevronRightIcon,
  UserIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import ModelTabs from '@/app/dashboard/models/[modelId]/components/ModelTabs';
import { notFound } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import OrganizationBreadcrumbs from '@/app/dashboard/organizations/[orgName]/components/OrganizationBreadcrumbs';
import ModelBreadcrumbs from '@/app/dashboard/models/[modelId]/components/ModelBreadcrumbs';
import toast from 'react-hot-toast';

export async function getModel(modelId: string): Promise<ModelDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(`${process.env.API_URL}/v1/models/${modelId}`, {
    headers: {
      ...authorizationHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) return undefined;

  return res.json();
}

export default async function Page({
  params,
}: {
  params: { modelId: string };
}) {
  const model = await getModel(params.modelId);
  if (!model) {
    notFound();
  }

  return (
    <>
      <ModelBreadcrumbs model={model} />

      <div className="grid grid-cols-6 pl-2 sm:pl-0">
        {/* Title */}
        <div className="text-3xl font-semibold col-span-4 py-3">
          {model.name}
        </div>
        {/* model type */}
        <div className="text-sm inline-flex col-start-1 col-span-8 sm:col-span-4 py-3">
          {model.type && (
            <>
              <BeakerIcon className="size-5 text-gray-400" />
              <p className="ml-2 mr-4">{model.type}</p>
            </>
          )}

          {model.creator && (
            <>
              <UserIcon className="size-5 text-gray-400" />
              <p className="ml-2">{model.creator?.name}</p>
            </>
          )}
        </div>
      </div>

      <ModelTabs model={model} />
    </>
  );
}
