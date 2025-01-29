import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  HelpCircle,
  Store,
  UserCog
} from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isCollapsed, toggleSidebar }: Props) {
  const location = useLocation();
  
  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/admin' },
    { icon: <Store />, label: 'POS', path: '/admin/pos' },
    { icon: <Users />, label: 'Vendors', path: '/admin/vendors' },
    { icon: <UserCog />, label: 'Users', path: '/admin/users' },
    { icon: <Calendar />, label: 'Events', path: '/admin/events' },
    { icon: <FileText />, label: 'Reports', path: '/admin/reports' },
    { icon: <BarChart3 />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings />, label: 'Settings', path: '/admin/settings' },
    { icon: <HelpCircle />, label: 'Support', path: '/admin/support' },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-screen fixed top-16 left-0 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary ${
              location.pathname === item.path ? 'bg-gray-50 text-primary' : ''
            }`}
          >
            <span className="h-5 w-5">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
