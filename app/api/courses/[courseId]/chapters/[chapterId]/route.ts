import Mux from '@mux/mux-node';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
  req: Request,
  { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();
    delete values.isPublished;

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

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst(
        { where: { chapterId } }
      );

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({ where: { chapterId } });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: 'public',
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (err) {
    console.log('api/courses/[courseId]/chapters/[chapterId] PUT:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { courseId, chapterId } }: { params: { courseId: string, chapterId: string } }
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
      }
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

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst(
        { where: { chapterId } }
      );

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({ where: { chapterId } });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true }
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false }
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (err) {
    console.log('api/courses/[courseId]/chapters/[chapterId] DELETE:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}