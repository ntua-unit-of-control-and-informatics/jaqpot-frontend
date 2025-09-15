'use client';

import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { usePathname, useRouter } from 'next/navigation';
import PageHeading from '@/app/components/PageHeading';
import { CardHeader } from "@heroui/card";
import {
  EXPLORE_PAGE_CATEGORIES,
  ExplorePageCategory,
  ExplorePageModel,
  ExplorePageOrganization,
} from '@/app/dashboard/explore/exploreModelCategories';
import { Link } from "@heroui/link";

function traverse(
  categoriesFromPath: string[],
  currentCategory:
    | ExplorePageCategory
    | undefined = EXPLORE_PAGE_CATEGORIES.categories.find(
    (cat) => cat.name === categoriesFromPath[0],
  ),
  depth = 0,
): ExplorePageCategory | undefined {
  if (!currentCategory) {
    return undefined;
  }

  if (depth === categoriesFromPath.length) {
    return currentCategory;
  }

  return traverse(
    categoriesFromPath,
    currentCategory.categories?.find(
      (cat) => cat.name === categoriesFromPath[depth],
    ),
    depth + 1,
  );
}

interface ModelCategoriesProps {
  categories: string[];
}

const getModelHref = (item: ExplorePageModel): string => {
  if ('href' in item) return item.href;
  if ('id' in item) return `/dashboard/models/${item.id}/description`;
  return '#'; // Fallback
};

export default function ModelCategories({ categories }: ModelCategoriesProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentCategory = traverse(categories) || EXPLORE_PAGE_CATEGORIES;

  return (
    <>
      <PageHeading title={currentCategory.name} className={'my-3'} />

      <p>{currentCategory.description}</p>

      {currentCategory.categories.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-5 text-xl font-bold underline underline-offset-8">
            Categories
          </h2>
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentCategory.categories.map((item, index) => (
              <Card
                shadow="sm"
                key={index}
                isPressable
                as={Link}
                href={`${pathname}/${item.name}`}
                className={'min-h-[250px] min-w-[250px]'}
                isBlurred
              >
                <CardHeader className="absolute top-0 z-10 flex-col !items-start bg-white/50 backdrop-blur-sm dark:bg-black/50">
                  <p className="text-base font-bold uppercase">{item.name}</p>
                  <h4 className="line-clamp-2 text-sm font-medium">
                    {item.description}
                  </h4>
                </CardHeader>
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 h-full w-full object-cover"
                  src={item.imageUrl}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
      {currentCategory.models && currentCategory.models.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-5 text-xl font-bold underline underline-offset-8">
            Models
          </h2>

          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {currentCategory.models?.map((item, index) => (
              <Card
                shadow="sm"
                key={index}
                as={Link}
                isPressable
                href={getModelHref(item)}
                isExternal={'href' in item}
                className={'min-h-[250px] min-w-[250px]'}
              >
                <CardHeader className="absolute top-0 z-10 flex-col !items-start bg-white/50 backdrop-blur-sm dark:bg-black/50">
                  <p className="text-base font-bold uppercase">{item.name}</p>
                  <h4 className="line-clamp-2 text-sm font-medium">
                    {item.description}
                  </h4>
                </CardHeader>
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 h-full w-full object-cover"
                  src={item.imageUrl}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
      {currentCategory.organizations &&
        currentCategory.organizations.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-5 text-xl font-bold underline underline-offset-8">
              Organizations
            </h2>
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {currentCategory.organizations?.map((item, index) => (
                <Card
                  shadow="sm"
                  key={index}
                  isPressable
                  as={Link}
                  href={`/dashboard/organizations/${item.name}/description`}
                  className={'min-h-[250px] min-w-[250px]'}
                >
                  <CardHeader className="absolute top-0 z-10 flex-col !items-start bg-white/50 backdrop-blur-sm dark:bg-black/50">
                    <p className="text-base font-bold uppercase">{item.name}</p>
                    <h4 className="line-clamp-3 text-sm font-medium">
                      {item.description}
                    </h4>
                  </CardHeader>
                  <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 h-full w-full object-cover"
                    src={item.imageUrl}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
    </>
  );
}
