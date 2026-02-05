'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  Building2,
  Calendar,
  FileBarChart,
  ClipboardCheck,
  Settings,
  Plus
} from 'lucide-react';
import api from '@/lib/axios';

interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'department' | 'instructor' | 'student';
}

// Create a context for global search
const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useSearch = () => useContext(SearchContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for user data
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        fetchNotifications();
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  // Fetch notifications periodically
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: any) => !n.is_read).length);
    } catch (error) {
    //   console.error('Failed to fetch notifications', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
        await api.post(`/notifications/${id}/read`);
        setNotifications(notifications.map(n => n.id === id ? {...n, is_read: 1} : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
        console.error(error);
    }
  };

  const handleCreateTestNotification = async () => {
    try {
        await api.post('/notifications/test');
        fetchNotifications();
    } catch (error) {
        console.error(error);
    }
  };

  // Reset search when route changes
  useEffect(() => {
    setSearchQuery('');
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const getMenuItems = (role?: string) => {
    const common = [
       { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    switch(role) {
      case 'admin':
        return [
          ...common,
          { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
          { name: 'Instructors', href: '/dashboard/instructors', icon: Users },
          { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
          { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
          { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
        ];
      case 'department':
        return [
          ...common,
          { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
          { name: 'Students', href: '/dashboard/students', icon: Users },
          // { name: 'Instructors', href: '/dashboard/instructors', icon: Users }, // Removed as requested
          { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
        ];
      case 'instructor':
        return [
          ...common,
          { name: 'My Courses', href: '/dashboard/my-courses', icon: BookOpen },
          { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
          { name: 'Grades', href: '/dashboard/grades', icon: ClipboardCheck },
        ];
      case 'student':
        return [
          ...common,
          { name: 'My Courses', href: '/dashboard/my-courses', icon: BookOpen },
          { name: 'Register Course', href: '/dashboard/register-course', icon: Plus },
          { name: 'Transcript', href: '/dashboard/transcript', icon: GraduationCap },
          { name: 'Profile', href: '/dashboard/profile', icon: User },
        ];
      default:
        return common;
    }
  };

  const menuItems = getMenuItems(user?.role);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Sidebar */}
        <aside 
          className={`bg-indigo-900 text-white transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } hidden md:flex flex-col shadow-xl`}
        >
          <div className="p-4 flex items-center justify-between border-b border-indigo-800 h-16">
            {isSidebarOpen ? (
              <h1 className="text-2xl font-bold tracking-wider">SIMS<span className="text-indigo-400">.Portal</span></h1>
            ) : (
              <h1 className="text-xl font-bold mx-auto">S</h1>
            )}
          </div>

          <nav className="flex-1 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive 
                      ? 'bg-indigo-800 text-white border-l-4 border-indigo-400' 
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-indigo-800">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded transition-colors"
              >
                <LogOut className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && <span>Logout</span>}
              </button>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
               {/* Global Search Bar */}
              <div className="relative hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-indigo-500 w-64 text-gray-700"
                />
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none"
                >
                   <Bell className="h-6 w-6" />
                   {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                   )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        <button onClick={handleCreateTestNotification} className="text-xs text-indigo-600 hover:underline">
                           Test
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                           notifications.map((notification) => (
                              <div 
                                key={notification.id} 
                                className={`p-3 border-b last:border-0 hover:bg-gray-50 transition cursor-pointer ${
                                   !notification.is_read ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                                }`}
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                 <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-indigo-900' : 'font-medium text-gray-800'}`}>
                                   {notification.title}
                                 </h4>
                                 <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                 <p className="text-xs text-gray-400 mt-2 text-right">
                                   {new Date(notification.created_at).toLocaleDateString()}
                                 </p>
                              </div>
                           ))
                        ) : (
                           <div className="p-4 text-center text-gray-500 text-sm">
                              No notifications yet.
                           </div>
                        )}
                      </div>
                      <div className="p-2 border-t bg-gray-50 text-center">
                         <button 
                            onClick={() => setShowNotifications(false)}
                            className="text-xs text-gray-500 hover:text-gray-800"
                         >
                            Close
                         </button>
                      </div>
                   </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 border-l pl-4 ml-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                   {user?.name?.[0] || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SearchContext.Provider>
  );
}
