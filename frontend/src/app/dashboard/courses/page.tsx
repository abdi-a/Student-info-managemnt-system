'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Trash2, Edit, X, UserPlus } from 'lucide-react';

interface Course {
    id: number;
    code: string;
    title: string;
    credits: number;
    department_id: number;
    department: {
        id: number;
        name: string;
        code: string;
    };
    description: string;
    instructors?: any[];
}

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Instructor {
    id: number;
    user: {
        name: string;
    };
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<any>(null);
    const [userRole, setUserRole] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        credits: 3,
        department_id: '',
        description: ''
    });

    const [assignData, setAssignData] = useState({
        course_id: '',
        instructor_id: '',
        section: 'A'
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const u = JSON.parse(userStr);
                setUserRole(u.role);
            }
        }
        fetchData();
    }, []);

    const getApiPrefix = () => {
        if (typeof window === 'undefined') return '/admin';
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role === 'instructor' ? '/instructor' : '/admin';
    };

    const fetchData = async () => {
        const prefix = getApiPrefix();
        try {
            const [coursesRes, deptsRes] = await Promise.all([
                api.get(`${prefix}/courses`),
                api.get(`${prefix}/departments`)
            ]);
            setCourses(coursesRes.data);
            setDepartments(deptsRes.data);

            if (userRole !== 'instructor') {
                const instRes = await api.get('/admin/instructors');
                setInstructors(instRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignClick = (course: Course) => {
        setAssignData({ ...assignData, course_id: course.id.toString() });
        setIsAssignModalOpen(true);
    };

    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/courses/assign', assignData);
            alert('Instructor assigned successfully');
            setIsAssignModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert('Assignment failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        const prefix = getApiPrefix();
        try {
            await api.delete(`${prefix}/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            alert('Failed to delete course');
        }
    };

    const handleEdit = (course: Course) => {
        setCurrentCourse(course);
        setFormData({
            code: course.code,
            title: course.title,
            credits: course.credits,
            department_id: course.department_id.toString(),
            description: course.description
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentCourse(null);
        setFormData({
            code: '',
            title: '',
            credits: 3,
            department_id: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const prefix = getApiPrefix();
        try {
            const payload = { ...formData };
            if (currentCourse) {
                await api.put(`${prefix}/courses/${currentCourse.id}`, payload);
                alert('Course updated successfully');
            } else {
                await api.post(`${prefix}/courses`, payload);
                alert('Course created successfully');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
                {(userRole === 'admin' || userRole === 'department') && (
                    <button 
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Course
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Code</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Department</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Credits</th>
                            {(userRole === 'admin' || userRole === 'department') && <th className="px-6 py-4 font-medium text-gray-500">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{course.code}</td>
                                <td className="px-6 py-4 text-gray-700">{course.title}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {course.department?.code || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{course.credits}</td>
                                {(userRole === 'admin' || userRole === 'department') && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAssignClick(course)} className="text-purple-600 hover:text-purple-800" title="Assign Instructor"><UserPlus size={18} /></button>
                                            {(userRole === 'admin' || userRole === 'department') && (
                                                <>
                                                    <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

             {/* Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{currentCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Course Code</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Course Title</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Credits</label>
                                <input type="number" required className="w-full border rounded p-2" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select required className="w-full border rounded p-2" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">Assign Instructor</h2>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Instructor</label>
                                <select required className="w-full border rounded p-2" value={assignData.instructor_id} onChange={e => setAssignData({...assignData, instructor_id: e.target.value})}>
                                    <option value="">Select Instructor</option>
                                    {instructors.map(i => <option key={i.id} value={i.id}>{i.user.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Section</label>
                                <input type="text" required className="w-full border rounded p-2" value={assignData.section} onChange={e => setAssignData({...assignData, section: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
