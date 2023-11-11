'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface IChapterActionsProps {
  courseId: string;
  chapter: Chapter;
  disabled: boolean;
}

export const ChapterActions = ({
  courseId,
  chapter,
  disabled,
}: IChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const deleteChapter = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapter.id}`);
      toast.success('Chapter deleted');
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled || isLoading} variant="outline" size="sm">
        {chapter.isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <ConfirmModal onConfirm={deleteChapter}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
