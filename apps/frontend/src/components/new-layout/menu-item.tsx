'use client';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

export const MenuItem: FC<{ label: string; icon: ReactNode; path: string }> = ({
  label,
  icon,
  path,
}) => {
  const currentPath = usePathname();
  const isActive = currentPath.indexOf(path) === 0;

  return (
    <Link
      prefetch={true}
      href={path}
      className={clsx(
        'w-full h-[54px] py-[8px] px-[6px] gap-[6px] flex flex-col text-[10px] font-[600] items-center justify-center rounded-[12px] transition-all',
        isActive
          ? 'text-textItemFocused bg-boxFocused shadow-sm'
          : 'text-textItemBlur hover:text-textItemFocused hover:bg-boxFocused/50'
      )}
    >
      <div className="flex items-center justify-center w-[20px] h-[20px]">{icon}</div>
      <div className="text-[10px] leading-tight">{label}</div>
    </Link>
  );
};
