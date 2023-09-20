'use client';

import { usePathname } from 'next/navigation';
import { Layout, Compass, List, BarChart } from 'lucide-react';

import SidebarItem from './sidebar-item';

const guestRoutes = [
  {
    key: 'route-dashboard',
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    key: 'route-browse',
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
];

const teacherRoutes = [
  {
    key: 'route-teacher-courses',
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    key: 'route-dashboard',
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  
  const isTeacherPage = pathname?.includes('/teacher');
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return ( 
    <div className="flex flex-col w-full">
      { routes.map((route) => (<SidebarItem { ...route } key={ route.key }/>))}
    </div>
   );
}
 
export default SidebarRoutes;