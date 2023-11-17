import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (!publishedChapters.length) {
      return new NextResponse('Mising required fields', { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);
  } catch (err) {
    console.log('api/courses/[courseId]/publish PATCH:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
