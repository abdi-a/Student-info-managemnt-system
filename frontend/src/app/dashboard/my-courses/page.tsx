'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { BookOpen, Search } from 'lucide-react';
import { useSearch } from '../layout';

interface Course {
    id: number;
    code: string;
    title: string;
    credits: number;
    description: string;
    department: string;
    section: string;
    assignment_id: number;
}

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const { searchQuery: globalSearch } = useSearch();

    // Use global search if available, otherwise use local search
    const activeSearch = globalSearch || localSearch;

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (activeSearch.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const query = activeSearch.toLowerCase();
            const filtered = courses.filter(course => 
                course.code.toLowerCase().includes(query) ||
                course.title.toLowerCase().includes(query) ||
                course.department.toLowerCase().includes(query) ||
                course.section.toLowerCase().includes(query)
            );
            setFilteredCourses(filtered);
        }
    }, [activeSearch, courses]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/instructor/my-courses');
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-blue-500" /> My Assigned Courses
                </h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search courses by code, title, department, or section..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading courses...</div>
                ) : filteredCourses.length > 0 ? (
                    <div className="space-y-4">
                        {filteredCourses.map((course) => (
                            <div key={course.assignment_id} className="p-5 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                Section {course.section}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-semibold">{course.code}</span> • {course.credits} Credits • {course.department}
                                        </p>
                                        {course.description && (
                                            <p className="text-sm text-gray-500 mt-2">{course.description}</p>
                                        )}
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                        Teaching
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">
                            {activeSearch ? 'No courses found matching your search.' : 'No courses assigned yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
