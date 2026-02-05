'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Search } from 'lucide-react';

interface Course {
    id: number;
    code: string;
    title: string;
    credits: number;
    description?: string;
    department?: {
        name: string;
    }
}

export default function RegisterCoursePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableCourses();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredCourses(courses);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredCourses(courses.filter(c => 
                c.title.toLowerCase().includes(query) || 
                c.code.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, courses]);

    const fetchAvailableCourses = async () => {
        try {
            const response = await api.get('/student/available-courses');
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId: number) => {
        if(!confirm('Are you sure you want to register for this course?')) return;
        
        try {
            await api.post(`/student/courses/${courseId}/enroll`);
            alert('Enrolled successfully!');
            // Remove from list
            setCourses(current => current.filter(c => c.id !== courseId));
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to enroll');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Plus className="text-indigo-500" /> Register for Courses
            </h1>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search courses by code or name..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Available Courses ({filteredCourses.length})</p>
                    
                    {loading ? (
                        <div className="text-center py-8">Loading available courses...</div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No courses available for registration.</div>
                    ) : (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                                <div>
                                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {course.code} • {course.department?.name || 'General'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{course.description}</p>
                                    <div className="mt-2 flex gap-2">
                                         <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{course.credits} Credits</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleEnroll(course.id)}
                                    className="mt-4 md:mt-0 px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors"
                                >
                                    Add Course
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
