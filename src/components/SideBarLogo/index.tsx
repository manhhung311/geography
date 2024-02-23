// @flow
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const SideBarLogo = ({ collapsed, className }: { collapsed?: boolean; className?: string }) => {
  if (collapsed) {
    return (
      <Link href={'/'} className={className ?? ''}>
        <Image
          src={'/logo.webp'}
          alt="/logo.webp"
          width={48}
          height={48}
        />
      </Link>
    );
  }

  return (
    <Link href={'/'} className={className ?? ''}>
      <Image
        src={'/logo.webp'}
        alt="/logo.webp"
        width={212}
        height={32}
      />
    </Link>
  );
};

export default SideBarLogo;
