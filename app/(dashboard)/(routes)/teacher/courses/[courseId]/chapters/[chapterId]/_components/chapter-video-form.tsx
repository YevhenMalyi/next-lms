'use client';

import { useState } from 'react';
import type { Chapter, MuxData } from '@prisma/client';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PencilIcon, PlusCircleIcon, VideoIcon } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/file-upload';

const ButtonContent = ({
  isEditing,
  chapter,
}: {
  isEditing: boolean;
  chapter: Chapter & { muxData?: MuxData | null };
}) => {
  if (!isEditing && !chapter?.videoUrl) {
    return (
      <>
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Add an video
      </>
    );
  }

  if (!isEditing && chapter?.videoUrl) {
    return (
      <>
        <PencilIcon className="h-4 w-4 mr-2" />
        Edit video
      </>
    );
  }

  return <>Cancel</>;
};

const VideoContainer = ({
  chapter,
}: {
  chapter: Chapter & { muxData?: MuxData | null };
}) => {
  return chapter.videoUrl ? (
    <div className="relative aspect-video mt-2">
      <MuxPlayer playbackId={chapter?.muxData?.playbackId || ''} />
    </div>
  ) : (
    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
      <VideoIcon className="h-10 w-10 text-slate-500" />
    </div>
  );
};

interface IChapterVideoFormProps {
  chapter: Chapter & { muxData?: MuxData | null };
  courseId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  courseId,
  chapter,
}: IChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

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
        Chapter Video
        <Button variant="ghost" onClick={toggleEditing}>
          <ButtonContent isEditing={isEditing} chapter={chapter} />
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-sm text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      ) : (
        <VideoContainer chapter={chapter} />
      )}

      {chapter.videoUrl && !isEditing ? (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      ) : null}
    </div>
  );
};
