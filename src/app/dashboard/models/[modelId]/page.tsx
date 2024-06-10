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

async function getModel(modelId: string): Promise<ModelDto | undefined> {
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
      <div className="grid grid-cols-6 pl-2 sm:pl-0">
        {/* Title */}
        <div className="text-3xl font-semibold col-span-4 py-3">
          {model.name}
        </div>
        {/* Predict */}
        {/*<div className="col-end-7 col-span-1 flex md:flex md:flex-grow flex-row justify-end space-x-1 py-3 items-center">*/}
        {/*  <Link*/}
        {/*    href={`/dashboard/models/${params.modelId}/predict`}*/}
        {/*    className="w-30 h-10 inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 dark:bg-gray-500 dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"*/}
        {/*  >*/}
        {/*    Predict{' '}*/}
        {/*    <svg*/}
        {/*      xmlns="http://www.w3.org/2000/svg"*/}
        {/*      fill="none"*/}
        {/*      viewBox="0 0 24 24"*/}
        {/*      strokeWidth={1.5}*/}
        {/*      stroke="currentColor"*/}
        {/*      className="ml-2 w-4 h-4 "*/}
        {/*    >*/}
        {/*      <path*/}
        {/*        strokeLinecap="round"*/}
        {/*        strokeLinejoin="round"*/}
        {/*        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"*/}
        {/*      />*/}
        {/*    </svg>*/}
        {/*  </Link>*/}
        {/*</div>*/}
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
