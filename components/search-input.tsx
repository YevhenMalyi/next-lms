'use client';

import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import qs from 'query-string';

export const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState('');
  const deboucedValue = useDebounce(value);

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          search: deboucedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [router, pathname, deboucedValue, currentCategoryId]);

  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Seacrh for a course"
      />
    </div>
  );
};
