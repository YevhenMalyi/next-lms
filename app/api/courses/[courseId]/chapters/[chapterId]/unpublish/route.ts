import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  {
    params: { courseId, chapterId },
  }: { params: { courseId: string; chapterId: string } }
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

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedChapter);
  } catch (err) {
    console.log(
      'api/courses/[courseId]/chapters/[chapterId]/publish PATCH:',
      err
    );
    return new NextResponse('Internal Error', { status: 500 });
  }
}
