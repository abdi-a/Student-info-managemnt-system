'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, FileText, ClipboardCheck, Clock } from 'lucide-react';

// --- Sub-Dashboards ---

const AdminDashboard = () => {
    const router = useRouter();
    const stats = [
        { title: 'Total Students', value: '1,234', icon: GraduationCap, color: 'bg-blue-500' },
        { title: 'Active Courses', value: '42', icon: BookOpen, color: 'bg-green-500' },
        { title: 'Instructors', value: '18', icon: Users, color: 'bg-purple-500' },
        { title: 'Depts', value: '6', icon: TrendingUp, color: 'bg-orange-500' },
      ];
    
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button 
                onClick={() => router.push('/dashboard/reports')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition">
                Generate Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white opacity-80`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Recent Activity Table (Simplified for brevity) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 mb-4">System Notices</h2>
             <p className="text-gray-500">System is running smoothly.</p>
          </div>
        </div>
      );
};

const StudentDashboard = () => {
    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-gray-800">Student Portal</h1>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><GraduationCap size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Current GPA</p>
                            <p className="text-2xl font-bold">3.85</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><BookOpen size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Registered Courses</p>
                            <p className="text-2xl font-bold">5</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Clock size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Completed Credits</p>
                            <p className="text-2xl font-bold">45</p>
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">My Schedule (Today)</h2>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">CS101 - Intro to Programming</h4>
                            <p className="text-sm text-gray-500">10:00 AM - 11:30 AM • Room 304</p>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Ongoing</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">ENG202 - Advanced Composition</h4>
                            <p className="text-sm text-gray-500">01:00 PM - 02:30 PM • Room 102</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

const InstructorDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><BookOpen size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Assigned Courses</p>
                            <p className="text-2xl font-bold">3</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full"><Users size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold">128</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full"><ClipboardCheck size={24}/></div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Grades</p>
                            <p className="text-2xl font-bold">24</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">My Courses</h2>
                    <ul className="divide-y divide-gray-100">
                        <li className="py-3 flex justify-between items-center">
                            <span>CS101 - Intro to Programming</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">Sec A</span>
                        </li>
                        <li className="py-3 flex justify-between items-center">
                            <span>CS101 - Intro to Programming</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">Sec B</span>
                        </li>
                        <li className="py-3 flex justify-between items-center">
                            <span>CS305 - Database Systems</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">Sec A</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const DepartmentDashboard = () => {
    const router = useRouter();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Department Overview</h1> 
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div onClick={() => router.push('/dashboard/courses')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><BookOpen size={24}/></div>
                        <div>
                            <p className="font-bold text-gray-800">Manage Courses</p>
                            <p className="text-sm text-gray-500">Create, edit & assign</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => router.push('/dashboard/students')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><Users size={24}/></div>
                        <div>
                            <p className="font-bold text-gray-800">Department Students</p>
                            <p className="text-sm text-gray-500">View registered students</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => router.push('/dashboard/reports')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><ClipboardCheck size={24}/></div>
                        <div>
                            <p className="font-bold text-gray-800">Reports & Stats</p>
                            <p className="text-sm text-gray-500">View analytics</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><TrendingUp size={24}/></div>
                        <div>
                            <p className="font-bold text-gray-800">Performance</p>
                            <p className="text-sm text-gray-500">Dept average: 3.2</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                     <button onClick={() => router.push('/dashboard/courses')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium">Add New Course</button>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }
  }, []);

  if (!user) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  switch(user.role) {
      case 'admin': return <AdminDashboard />;
      case 'student': return <StudentDashboard />;
      case 'instructor': return <InstructorDashboard />;
      case 'department': return <DepartmentDashboard />;
      default: return <div className="p-8 text-center text-red-500">Unknown Role. Please contact support.</div>;
  }
}
