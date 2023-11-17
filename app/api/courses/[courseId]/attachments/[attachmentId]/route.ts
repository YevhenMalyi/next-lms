import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  {
    params: { courseId, attachmentId },
  }: { params: { courseId: string; attachmentId: string } }
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

    const attachment = await db.attachment.delete({
      where: {
        courseId,
        id: attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (err) {
    console.log(
      'api/courses/[courseId]/attachments/[attachmentId] DELETE:',
      err
    );
    return new NextResponse('Internal Error', { status: 500 });
  }
}
