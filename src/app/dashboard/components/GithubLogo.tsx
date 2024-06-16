import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/button';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GithubLogo(props: any) {
  return (
    <Link
      href="https://github.com/ntua-unit-of-control-and-informatics/jaqpotpy"
      target="_blank"
      {...props}
    >
      <Button variant="light" isIconOnly className="p-2">
        <Image
          src="/github-mark.svg"
          alt="github logo"
          width={24}
          height={24}
          className="dark:invert"
        />
      </Button>
    </Link>
  );
}
