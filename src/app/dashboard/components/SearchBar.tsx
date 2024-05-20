import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  return (
    <form className="flex-1">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="size-6 text-gray-400" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full h-full p-4 ps-10 text-gray-900 outline-none dark:placeholder-gray-400 dark:text-white"
          placeholder="Search..."
          required
        />
      </div>
    </form>
  );
}
