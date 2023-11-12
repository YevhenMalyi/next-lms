import { Category, Course } from '@prisma/client';
import { CourseCard } from './course-card';

type CompilatedCourseData = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface ICoursesListProps {
  courses: CompilatedCourseData[];
}

export const CoursesList = ({ courses }: ICoursesListProps) => {
  return (
    <div>
      {courses.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {courses.map(
            ({ title, id, imageUrl, chapters, price, progress, category }) => (
              <CourseCard
                key={`course-${id}`}
                id={id}
                title={title}
                imageUrl={imageUrl!}
                chaptersLength={chapters.length}
                price={price!}
                progress={progress!}
                category={category!.name}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No curses found
        </div>
      )}
    </div>
  );
};
