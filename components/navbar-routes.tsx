'use client';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname.includes('/courses');
  const isSearchPage = pathname === '/search';

  return (
    <>
      {isSearchPage ? (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      ) : null}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit {isTeacherPage ? ` from Teacher Mode` : null}
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
