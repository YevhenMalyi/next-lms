import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import { ChapterAccessForm } from './_components/chapter-access-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { Banner } from '@/components/banner';
import { ChapterActions } from './_components/chapter-actions';

interface IChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({
  params: { courseId, chapterId },
}: IChapterPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const chapter = await db.chapter.findUnique({
    where: { courseId, id: chapterId },
    include: { muxData: true },
  });

  if (!chapter) {
    redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completion = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished ? (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      ) : null}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
              href={`/teacher/courses/${courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completion}
                </span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapter={chapter}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>

              <ChapterTitleForm courseId={courseId} chapter={chapter} />

              <ChapterDescriptionForm courseId={courseId} chapter={chapter} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access settings</h2>
              </div>
              <ChapterAccessForm courseId={courseId} chapter={chapter} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm courseId={courseId} chapter={chapter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterPage;
