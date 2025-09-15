'use client';

import { Card, CardBody, CardFooter } from '@heroui/card';
import {
  CircleStackIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from '@heroui/link';

const actionImgClassname = 'size-16 text-gray-400';

const dashboardActionsList = [
  {
    title: 'Create a model',
    description: 'Learn how to deploy your ML models using our SDKs',
    img: <PencilSquareIcon className={actionImgClassname} />,
    href: `${process.env.NEXT_PUBLIC_SITE_URL}/docs/getting-started`,
  },
  {
    title: 'Explore models',
    description:
      'Discover a wide range of pre-built models across various categories',
    img: <MagnifyingGlassIcon className={actionImgClassname} />,
    href: `/dashboard/explore`,
  },
  {
    title: 'My Models',
    description:
      'Access and manage your uploaded models or models that others shared with you',
    img: <CircleStackIcon className={actionImgClassname} />,
    href: '/dashboard/models',
  },
  {
    title: 'My Results',
    description: 'View and analyze your past experiments and results',
    img: <TableCellsIcon className={actionImgClassname} />,
    href: '/dashboard/results',
  },
];

export default function DashboardActions() {
  return (
    <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-10 sm:mt-10 sm:grid-cols-2">
      {dashboardActionsList.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          className="p-4"
          as={Link}
          href={item.href}
        >
          <CardBody className="overflow-visible p-0">
            <b>{item.title}</b>
            <p className="text-default-500">{item.description}</p>
          </CardBody>
          <CardFooter className="flex items-center justify-center">
            {item.img}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
