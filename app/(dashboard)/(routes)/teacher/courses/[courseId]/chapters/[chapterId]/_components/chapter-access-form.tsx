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
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface IChapterAccessFormProps {
  chapter: Chapter;
  courseId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  chapter,
  courseId,
}: IChapterAccessFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: chapter.isFree },
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
        Chapter Access Settings
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit access
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
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      all users
                    </FormDescription>
                  </div>
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
            !chapter.isFree && 'text-slate-500 italic'
          )}
        >
          {chapter.isFree ? (
            <>This is chapter is free for preview</>
          ) : (
            <>This chapter is not free</>
          )}
        </div>
      )}
    </div>
  );
};
