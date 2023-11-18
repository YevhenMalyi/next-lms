import { db } from '@/lib/db';

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });

    const publishedChaptersIds = publishedChapters.map(({ id }) => id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: publishedChaptersIds },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChaptersIds.length) * 100;
    return progressPercentage;
  } catch (err) {
    console.error('[GET_PROGRESS]: ', err);
    return 0;
  }
};
