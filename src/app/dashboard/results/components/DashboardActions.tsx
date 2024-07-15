'use client';

import { Card, CardBody, CardFooter } from '@nextui-org/react';
import {
  CircleStackIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const actionImgClassname = 'size-16 text-gray-400';

const dashboardActionsList = [
  {
    title: 'Create a model',
    description:
      'Learn how to upload and deploy your ML models using our Python SDK',
    img: <PencilSquareIcon className={actionImgClassname} />,
  },
  {
    title: 'Explore models',
    description:
      'Discover a wide range of pre-built models across various categories',
    img: <MagnifyingGlassIcon className={actionImgClassname} />,
  },
  {
    title: 'My Models',
    description:
      'Access and manage your uploaded models or models that others shared with you',
    img: <CircleStackIcon className={actionImgClassname} />,
  },
  {
    title: 'My Results',
    description: 'View and analyze your past experiments and results',
    img: <TableCellsIcon className={actionImgClassname} />,
  },
];

export default function DashboardActions() {
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-10 sm:mt-20 sm:grid-cols-2">
      {dashboardActionsList.map((item, index) => (
        <Card shadow="sm" key={index} isPressable className="p-4">
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
