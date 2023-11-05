import { auth } from '@clerk/nextjs';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';

import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { PriceForm } from './_components/price-form';
import { AttachmentsForm } from './_components/attachments-form';

const CourceIdPage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
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
    course.categoryId,
  ];

  const totalFieldsAmount = requiredFields.length;
  const completedFieldAmount = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFieldAmount}/${totalFieldsAmount})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>

          <span className="text-sm text-slate-700">
            Complete all field {completionText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm course={course} />

          <DescriptionForm course={course} />

          <ImageForm course={course} />

          <CategoryForm
            course={course}
            options={categories.map(({ name, id }) => ({
              label: name,
              value: id,
            }))}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>

            <div>TODO: Chapters</div>
          </div>

          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign} />
            <h2 className="text-xl">Sell your course</h2>
          </div>

          <PriceForm course={course} />

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>

            <AttachmentsForm course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourceIdPage;
