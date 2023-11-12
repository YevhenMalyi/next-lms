import { Category } from '@prisma/client';
import { CategoryItem } from './category-item';

interface ICategoriesProps {
  categories: Category[];
}

export const Categories = ({ categories }: ICategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map(({ id, name }) => (
        <CategoryItem key={`category-${id}`} label={name} value={id} />
      ))}
    </div>
  );
};
