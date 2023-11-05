'use client';

import { useState } from 'react';
import type { Attachment, Course } from '@prisma/client';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { File, Loader2, PlusCircleIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/file-upload';

type CourseWithAttachments = Course & { attachments: Attachment[] };

const ButtonContent = ({
  isEditing,
}: {
  isEditing: boolean;
  course: Course;
}) => {
  if (!isEditing) {
    return (
      <>
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Add a file
      </>
    );
  }

  return <>Cancel</>;
};

const AttachmentsContainer = ({
  course,
  deletingIds,
  onDelete,
}: {
  course: CourseWithAttachments;
  deletingIds: string[];
  onDelete: (id: string) => void;
}) => {
  return course.attachments.length === 0 ? (
    <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
  ) : (
    <div className="space-y-2">
      {course.attachments.map(({ id, name }) => (
        <div
          key={`att-${id}`}
          className="flex items-center p-3 w-full bg-sky-100 border rounded-md border-sky-200  text-sky-700 "
        >
          <File className="h-4 w-4 mr-2 flex-shrink" />
          <p className="text-xs line-clamp-1">{name}</p>
          {deletingIds.includes(id) ? (
            <div className="ml-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <button
              className="ml-auto hover:opacity-75 transition"
              onClick={() => onDelete(id)}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

interface IAttachmentsFormProps {
  course: CourseWithAttachments;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentsForm = ({ course }: IAttachmentsFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const onDelete = async (id: string) => {
    try {
      setDeletingIds((prev) => [...prev, id]);
      await axios.delete(`/api/courses/${course.id}/attachments/${id}`);
      setDeletingIds((prev) => prev.filter((item) => item === id));
      toast.success('Attachment deleted');
      router.refresh();
    } catch (err) {
      setDeletingIds((prev) => prev.filter((item) => item === id));
      toast.error('Something went wrong');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${course.id}/attachments`, values);
      toast.success('Course updated');
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
        Course Attachments
        <Button variant="ghost" onClick={toggleEditing}>
          <ButtonContent isEditing={isEditing} course={course} />
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Add anythin your students might need to complete the course.
          </div>
        </div>
      ) : (
        <AttachmentsContainer
          course={course}
          deletingIds={deletingIds}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
