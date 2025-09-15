import { Metadata } from 'next';
import { generateSharedMetadata, openGraphImage } from '@/app/shared.metadata';
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import {
  ArrowLongRightIcon,
  CircleStackIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import React from 'react';
import DashboardActions from '@/app/dashboard/results/components/DashboardActions';
import { Divider } from "@heroui/divider";

export const metadata: Metadata = generateSharedMetadata(
  'Dashboard: Manage your machine learning models and predictions',
  '',
);

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="relative isolate min-h-screen px-6 py-5 sm:py-0 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 left-20 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(20%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-3xl py-2 sm:py-6">
          {/*<div className="hidden sm:mb-8 sm:flex sm:justify-center">*/}
          {/*  <div className="relative rounded-full px-3 py-1 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">*/}
          {/*    Announcing our next round of funding.{' '}*/}
          {/*    <a href="#" className="font-semibold text-indigo-600">*/}
          {/*      <span aria-hidden="true" className="absolute inset-0" />*/}
          {/*      Read more <span aria-hidden="true">&rarr;</span>*/}
          {/*    </a>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to Jaqpot!
            </h1>
            <p className="dark:text-400 mt-6 text-lg leading-8">
              Jaqpot is your all-in-one, open-source platform for creating,
              exploring, and deploying machine learning models. Whether you{"'"}
              re a data scientist, researcher, or developer, we{"'"}ve got the
              tools you need to bring your models to life.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                color="primary"
                as={Link}
                isExternal
                href={`${process.env.NEXT_PUBLIC_SITE_URL}/docs/getting-started`}
              >
                Getting started
              </Button>
              <Link
                color="foreground"
                href="https://jaqpot.org"
                isExternal
                className="text-sm font-semibold leading-6"
              >
                Learn more <ArrowLongRightIcon className="ml-1 size-4" />
              </Link>
            </div>

            <Divider className="my-8" />

            <div className="sm:justify-center">
              <div className="relative text-tiny leading-6">
                Developed by the{' '}
                <Link
                  href="https://www.chemeng.ntua.gr/labs/control_lab/"
                  isExternal
                  className="text-tiny"
                >
                  Unit of Process Control and Informatics
                </Link>{' '}
                at the{' '}
                <Link
                  href="https://www.ntua.gr/en/"
                  isExternal
                  className="text-tiny"
                >
                  National Technical University of Athens
                </Link>
              </div>
            </div>
          </div>
        </div>

        <DashboardActions />

        {/*GRADIENT BACKGROUND*/}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-10 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-10"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(10%+3rem)] top-[calc(10%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:-top-40 sm:left-[calc(20%+36rem)] sm:left-[calc(50%+3rem)] sm:w-144.75"
          />
        </div>
      </div>

      {/*<div className="grid min-h-screen grid-cols-1 gap-x-10 md:grid-cols-2">*/}
      {/*  <div>*/}
      {/*    <h2 className="my-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">*/}
      {/*      Model predictions per day*/}
      {/*    </h2>*/}

      {/*    <DashboardStats width={'100%'} height={400} />*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <h2 className="my-5 text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">*/}
      {/*      Most popular models last 7 days*/}
      {/*    </h2>*/}

      {/*    <DashboardMostPopularModels width={'100%'} height={400} />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
