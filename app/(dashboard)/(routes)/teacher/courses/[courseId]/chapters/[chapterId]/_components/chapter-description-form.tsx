'use client';

import { useState } from 'react';
import type { Chapter } from '@prisma/client';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { PencilIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';

interface IChapterDescriptionFormProps {
  chapter: Chapter;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
});

export const ChapterDescriptionForm = ({
  chapter,
  courseId,
}: IChapterDescriptionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: chapter.description || '' },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );
      toast.success('Chapter updated');
      toggleEditing();
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit desciption
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div
          className={cn(
            'text-sm mt-2',
            !chapter.description && 'text-slate-500 italic'
          )}
        >
          {!chapter.description ? (
            'No description'
          ) : (
            <Preview value={chapter.description} />
          )}
        </div>
      )}
    </div>
  );
};
