import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

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

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const position = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position,
      },
    });

    return NextResponse.json(chapter);
  } catch (err) {
    console.log('api/courses/[courseId]/chapters POST:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
