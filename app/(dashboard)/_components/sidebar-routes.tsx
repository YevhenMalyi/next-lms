'use client';

import { Layout, Compass } from 'lucide-react';
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

const SidebarRoutes = () => {
  const routes = guestRoutes;

  return ( 
    <div className="flex flex-col w-full">
      { routes.map((route) => (<SidebarItem { ...route } key={ route.key }/>))}
    </div>
   );
}
 
export default SidebarRoutes;