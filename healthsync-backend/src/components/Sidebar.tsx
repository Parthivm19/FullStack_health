import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  HeartPulseIcon,
  FileTextIcon,
  TrendingUpIcon,
  UtensilsIcon,
  DumbbellIcon,
  UserIcon,
  LogOutIcon,
  ActivityIcon } from
'lucide-react';
const navItems = [
{
  path: '/',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
},
{
  path: '/health-insights',
  label: 'Health Insights',
  icon: HeartPulseIcon
},
{
  path: '/medical-history',
  label: 'Medical History',
  icon: FileTextIcon
},
{
  path: '/progress',
  label: 'Progress',
  icon: TrendingUpIcon
},
{
  path: '/diet-plan',
  label: 'Diet Plan',
  icon: UtensilsIcon
},
{
  path: '/exercise',
  label: 'Exercise',
  icon: DumbbellIcon
},
{
  path: '/profile',
  label: 'Profile',
  icon: UserIcon
}];

export function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a2e] text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ActivityIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">HealthSync</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) =>
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`
          }>
          
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
            SC
          </div>
          <div>
            <p className="font-medium text-sm">Sophie Carter</p>
            <p className="text-xs text-gray-400">sophie@email.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors w-full">
          
          <LogOutIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>);

}