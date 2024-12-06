import { ReactNode } from 'react';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getProgress } from '@/actions/get-dash-progress';
import { CourseSidebar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';

const CourseLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId } } },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  const progressCount = await getProgress(userId, params.courseId);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default CourseLayout;
