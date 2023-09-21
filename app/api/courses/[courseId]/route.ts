import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });
    return NextResponse.json(course);
  } catch (err) {
    console.log('api/courses/[courseId] PATCH:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}