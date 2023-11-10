import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      }
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: { ...values }
    });

    // TODO: upload video

    return NextResponse.json(chapter);
  } catch (err) {
    console.log('api/courses/[courseId]/chapters/[chapterId] PUT:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}