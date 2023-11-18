import NavbarRoutes from '@/components/navbar-routes';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { CourseMobileSidebar } from './course-mobile-sidebar';

interface ICourseNavbarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: ICourseNavbarProps) => {
  return (
    <div className="p-5 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
