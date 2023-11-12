import { db } from '@/lib/db';
import { Category, Course } from '@prisma/client';
import { getProgress } from './get-dash-progress';

type CompilatedCourseData = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCoursesParams = {
  userId: string;
  search?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  search,
  categoryId,
}: GetCoursesParams): Promise<CompilatedCourseData[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: { contains: search },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const coursesWithProgress: CompilatedCourseData[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return { ...course, progress: null };
        }

        const progress = await getProgress(userId, course.id);
        return { ...course, progress };
      })
    );

    return coursesWithProgress;
  } catch (err) {
    console.error('[GET_COURSES]', err);
    return [];
  }
};
