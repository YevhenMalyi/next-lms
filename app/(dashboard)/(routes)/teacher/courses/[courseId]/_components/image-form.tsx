'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Course } from '@prisma/client';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ImageIcon, PencilIcon, PlusCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/file-upload';

const ButtonContent = ({
  isEditing,
  course,
}: {
  isEditing: boolean;
  course: Course;
}) => {
  if (!isEditing && !course?.imageUrl) {
    return (
      <>
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Add an image
      </>
    );
  }

  if (!isEditing && course?.imageUrl) {
    return (
      <>
        <PencilIcon className="h-4 w-4 mr-2" />
        Edit image
      </>
    );
  }

  return <>Cancel</>;
};

const ImageContainer = ({ course }: { course: Course }) => {
  return course.imageUrl ? (
    <div className="relative aspect-video mt-2">
      <Image
        alt="Uploaded image"
        fill
        className="object-cover rounded-md"
        src={course.imageUrl}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
      <ImageIcon className="h-10 w-10 text-slate-500" />
    </div>
  );
};

interface IImageFormProps {
  course: Course;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, 'Image is required'),
});

export const ImageForm = ({ course }: IImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
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
        Course Image
        <Button variant="ghost" onClick={toggleEditing}>
          <ButtonContent isEditing={isEditing} course={course} />
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            16:9 aspect ration is recommended
          </div>
        </div>
      ) : (
        <ImageContainer course={course} />
      )}
    </div>
  );
};
