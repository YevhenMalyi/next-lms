'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface ICourseEnrollBtnProps {
  price: number;
  courseId: string;
}

export const CourseEnrollBtn = ({ price, courseId }: ICourseEnrollBtnProps) => {
  return (
    <Button size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
};
