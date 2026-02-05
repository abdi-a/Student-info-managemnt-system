'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Trash2, Edit, X } from 'lucide-react';

interface Department {
    id: number;
    name: string;
    code: string;
    description: string;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDept, setCurrentDept] = useState<Department | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/admin/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this department?')) return;
        try {
            await api.delete(`/admin/departments/${id}`);
            setDepartments(departments.filter(d => d.id !== id));
        } catch (error) {
            alert('Failed to delete department (might have related courses/students)');
        }
    };

    const handleEdit = (dept: Department) => {
        setCurrentDept(dept);
        setFormData({
            name: dept.name,
            code: dept.code,
            description: dept.description || ''
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentDept(null);
        setFormData({
            name: '',
            code: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentDept) {
                await api.put(`/admin/departments/${currentDept.id}`, formData);
                alert('Department updated successfully');
            } else {
                await api.post('/admin/departments', formData);
                alert('Department created successfully');
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (error: any) {
             console.error(error);
             alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
                <button 
                    onClick={openCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add Department
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Code</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Description</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {departments.map((dept) => (
                            <tr key={dept.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">#{dept.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{dept.code}</td>
                                <td className="px-6 py-4 text-gray-700">{dept.name}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{dept.description}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {departments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">No departments found.</td>
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
                            <h2 className="text-xl font-bold">{currentDept ? 'Edit Department' : 'Add New Department'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Code</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
        </div>
    );
}
