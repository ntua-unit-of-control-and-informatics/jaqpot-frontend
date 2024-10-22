import Image from 'next/image';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

interface CustomErrorPageProps {
  title: string;
  description: string;
}

export default function CustomErrorPage({
  title,
  description,
}: CustomErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center p-5 text-center">
      <Image
        src="/sad-mascot.png" // Ensure this image is in your public folder
        alt="Sad Mascot"
        width={200}
        height={200}
        className="mx-auto"
      />
      <h1 className="mt-5 text-4xl font-bold">{title}</h1>
      <p className="mt-4 max-w-xl">{description}</p>
      <div className="mt-10 flex gap-5">
        <Button
          color="primary"
          onPress={
            // Attempt to recover by trying to re-render the segment
            () => window.location.reload()
          }
        >
          Try again
        </Button>
        <Button as={Link} color="primary" href="/dashboard">
          Go to the Dashboard
        </Button>
      </div>
    </div>
  );
}
