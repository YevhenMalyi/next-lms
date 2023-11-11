'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface IActionsProps {
  course: Course;
  disabled: boolean;
}

export const Actions = ({ course, disabled }: IActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const changePublishStatus = async () => {
    try {
      setIsLoading(true);

      const action = course.isPublished ? 'unpublish' : 'publish';
      await axios.patch(`/api/courses/${course.id}/${action}`, {
        isPublished: !course.isPublished,
      });
      toast.success(
        `Course ${course.isPublished ? 'unpublished' : 'published'}`
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${course.id}`);
      toast.success('Course deleted');
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isLoading}
        onClick={changePublishStatus}
        variant="outline"
        size="sm"
      >
        {course.isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <ConfirmModal onConfirm={deleteCourse}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
