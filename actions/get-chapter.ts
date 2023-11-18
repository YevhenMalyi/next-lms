import { db } from '@/lib/db';
import { Chapter, Attachment } from '@prisma/client';

interface IGetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: IGetChapterProps) => {
  try {
    const [purchase, course, chapter] = await Promise.all([
      db.purchase.findUnique({
        where: { userId_courseId: { userId, courseId } },
      }),
      db.course.findUnique({
        where: { isPublished: true, id: courseId },
        select: {
          price: true,
        },
      }),
      db.chapter.findUnique({
        where: { id: chapterId, isPublished: true },
      }),
    ]);

    if (!chapter || !course) {
      throw new Error('Course/chapter not found');
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({ where: { courseId } });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({ where: { chapterId } });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (err) {
    console.error('[GET_CHAPTER] ', err);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
