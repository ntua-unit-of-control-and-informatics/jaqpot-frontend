import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <Image
        src="/sad-mascot.png" // Ensure this image is in your public folder
        alt="Sad Mascot"
        width={200}
        height={200}
        className="mx-auto"
      />
      <h1 className="text-4xl font-bold text-gray-800 mt-5">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mt-4">
        Oops! It looks like you are lost. Our mascot is empty-handed and sad
        because the page you are looking for does not exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to the Dashboard
      </Link>
    </div>
  );
}
