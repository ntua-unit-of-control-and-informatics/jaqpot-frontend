import { NextRequest } from 'next/server';

const PAGE_SIZE = '10';
export const SORT_DELIMITER = '|';

export function generatePaginationAndSortingSearchParams(request: NextRequest) {
  const requestParams = request.nextUrl.searchParams;
  const page = requestParams.get('page') || '0';
  const size = PAGE_SIZE;
  const sort = requestParams.get('sort') || `createdAt${SORT_DELIMITER}desc`;

  return new URLSearchParams({
    page,
    size,
    sort,
  });
}

export function convertSortDirection(direction: string) {
  return direction === 'ascending' ? 'asc' : 'desc';
}
