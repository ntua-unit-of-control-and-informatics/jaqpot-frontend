import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import CustomErrorPage from '@/app/components/CustomErrorPage';

export default function NotFound() {
  return (
    <CustomErrorPage
      title="404 - Page Not Found"
      description="Oops! It looks like you are lost. Our mascot is empty-handed and sad
        because the page you are looking for does not exist."
    />
  );
}
