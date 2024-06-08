import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import CustomErrorPage from '@/app/components/CustomErrorPage';

export default function Unauthorized() {
  return (
    <CustomErrorPage
      title="401 - Unauthorized Access"
      description="Oops! It looks like you're trying to access something without the proper credentials. Our mascot is sad because you need to be logged in or have the right permissions."
    />
  );
}
