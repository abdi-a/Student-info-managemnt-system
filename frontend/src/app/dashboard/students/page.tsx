'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Trash2, Edit, Search, X } from 'lucide-react';

interface Student {
    id: number;
    student_id: string;
    gpa: string;
    enrollment_year: string;
    department_id: number;
    user_id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    department: {
        id: number;
        name: string;
    };
}

interface Department {
    id: number;
    name: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<any>(null); // For Edit
    const [userRole, setUserRole] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        student_id: '',
        department_id: '',
        enrollment_year: new Date().getFullYear().toString()
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

    const fetchData = async () => {
        try {
            const [studentsRes, deptsRes] = await Promise.all([
                api.get('/admin/students'),
                api.get('/admin/departments')
            ]);
            setStudents(studentsRes.data);
            setDepartments(deptsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/admin/students/${id}`);
            setStudents(students.filter(s => s.id !== id));
        } catch (error) {
            alert('Failed to delete student');
        }
    };

    const handleEdit = (student: Student) => {
        setCurrentStudent(student);
        setFormData({
            name: student.user.name,
            email: student.user.email,
            password: '', // Leave empty to keep unchanged
            student_id: student.student_id,
            department_id: student.department_id.toString(),
            enrollment_year: student.enrollment_year
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentStudent(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            student_id: '',
            department_id: '',
            enrollment_year: new Date().getFullYear().toString()
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.password) delete (payload as any).password; // Don't send empty password on update

            if (currentStudent) {
                await api.put(`/admin/students/${currentStudent.id}`, payload);
                alert('Student updated successfully');
            } else {
                await api.post('/admin/students', payload);
                alert('Student created successfully');
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Students</h1>
                
                {userRole !== 'department' && (
                    <div className="flex gap-2">
                        <button 
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Student
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Student ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Department</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Email</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Joined</th>
                            {userRole !== 'department' && <th className="px-6 py-4 font-medium text-gray-500">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {student.user?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{student.student_id}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    {student.department?.name || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{student.user?.email}</td>
                                <td className="px-6 py-4 text-gray-500">{student.enrollment_year}</td>
                                {userRole !== 'department' && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{currentStudent ? 'Edit Student' : 'Add New Student'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" required className="w-full border rounded p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password {currentStudent && '(Leave blank to keep)'}</label>
                                <input type="password" className="w-full border rounded p-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Student ID</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select required className="w-full border rounded p-2" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Enrollment Year</label>
                                <input type="number" required className="w-full border rounded p-2" value={formData.enrollment_year} onChange={e => setFormData({...formData, enrollment_year: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

