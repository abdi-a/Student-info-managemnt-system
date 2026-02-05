'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Trash2, Edit, Mail, X } from 'lucide-react';

interface Instructor {
    id: number;
    employee_id: string;
    specialization: string;
    department_id: number;
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

export default function InstructorsPage() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInstructor, setCurrentInstructor] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        employee_id: '',
        department_id: '',
        specialization: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch instructors
            try {
                const instRes = await api.get('/admin/instructors');
                setInstructors(instRes.data);
            } catch (err) {
                console.error("Error fetching instructors:", err);
            }

            // Fetch departments
            try {
                const deptsRes = await api.get('/admin/departments');
                // Handle possible wrapped response or direct array
                const data = Array.isArray(deptsRes.data) ? deptsRes.data : deptsRes.data?.data || [];
                setDepartments(data);
            } catch (err) {
                console.error("Error fetching departments:", err);
            }
            
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this instructor?')) return;
        try {
            await api.delete(`/admin/instructors/${id}`);
            setInstructors(instructors.filter(i => i.id !== id));
        } catch (error) {
            alert('Failed to delete instructor');
        }
    };

    const handleEdit = (instructor: Instructor) => {
        setCurrentInstructor(instructor);
        setFormData({
            name: instructor.user.name,
            email: instructor.user.email,
            password: '', 
            employee_id: instructor.employee_id,
            department_id: instructor.department_id.toString(),
            specialization: instructor.specialization
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentInstructor(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            employee_id: '',
            department_id: '',
            specialization: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.password) delete (payload as any).password;

            if (currentInstructor) {
                await api.put(`/admin/instructors/${currentInstructor.id}`, payload);
                alert('Instructor updated successfully');
            } else {
                await api.post('/admin/instructors', payload);
                alert('Instructor created successfully');
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
                <h1 className="text-2xl font-bold text-gray-800">Instructors</h1>
                <button 
                    onClick={openCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add Instructor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor) => (
                    <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
                        <button onClick={() => handleDelete(instructor.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={18} />
                        </button>
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4">
                            {instructor.user?.name?.[0]}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{instructor.user?.name}</h3>
                        <p className="text-indigo-600 text-sm font-medium mb-1">{instructor.specialization || 'Instructor'}</p>
                        <p className="text-gray-500 text-sm mb-4">{instructor.department?.name}</p>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                            <Mail size={16} />
                            <span>{instructor.user?.email}</span>
                        </div>

                        <div className="flex gap-3 w-full mt-auto">
                            <button className="flex-1 py-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium">Profile</button>
                            <button onClick={() => handleEdit(instructor)} className="flex-1 py-2 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 text-sm font-medium">Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{currentInstructor ? 'Edit Instructor' : 'Add New Instructor'}</h2>
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
                                <label className="block text-sm font-medium mb-1">Password {currentInstructor && '(Leave blank to keep)'}</label>
                                <input type="password" className="w-full border rounded p-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee ID</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select required className="w-full border rounded p-2" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Specialization</label>
                                <input type="text" className="w-full border rounded p-2" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
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
