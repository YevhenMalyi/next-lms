import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';
import { CourseSidebarItem } from './course-sidebar-item';

interface ICourseSidebarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: ICourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {/* check purchase and add progress */}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map(({ id, title, userProgress, isFree }) => (
          <CourseSidebarItem
            key={`sidebar-item-${id}`}
            id={id}
            label={title}
            isCompleted={!!userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
