import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';

const CourceIdPage = async ({
  params: { courseId }
} : {
  params: { courseId: string }
}) => {
  const { userId } = auth();
  if (!userId) {
    redirect('/');
  }

  const course = await db.course.findUnique({
    where: { 
      id: courseId,
    },
  });
  if (!course) {
    redirect('/');
  }

  const requiredFields = [
    course.title, 
    course.description, 
    course.imageUrl, 
    course.price, 
    course.categoryId
  ];

  const totalFieldsAmount = requiredFields.length;
  const completedFieldAmount = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFieldAmount}/${totalFieldsAmount})`;

  return ( 
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course Setup
          </h1>

          <span className="text-sm text-slate-700">
            Complete all field { completionText }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ LayoutDashboard } />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default CourceIdPage;