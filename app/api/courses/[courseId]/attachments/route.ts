import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params: { courseId } }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

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

    const attachment = await db.attachment.create({
      data: {
        name: url.split('/').pop(),
        courseId,
        url,
      }
    });

    return NextResponse.json(attachment);
  } catch (err) {
    console.log('api/courses/[courseId]/attachments POST:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}