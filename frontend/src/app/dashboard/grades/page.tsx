'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { ClipboardCheck, Search, Save, Trash2, Edit2, X, Plus } from 'lucide-react';
import { useSearch } from '../layout';

interface Course {
    id: number;
    title: string;
    code: string;
    section?: string;
    assignment_id?: number;
}

interface StudentGrade {
    enrollment_id: number;
    student_id: number;
    student_code: string;
    name: string;
    grade: number | null;
}

export default function InstructorGradesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [students, setStudents] = useState<StudentGrade[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentGrade[]>([]);
    const [loading, setLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempGrade, setTempGrade] = useState<string>('');
    const { searchQuery: globalSearch } = useSearch();

    const activeSearch = globalSearch || localSearch;

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (activeSearch.trim() === '') {
            setFilteredStudents(students);
        } else {
            const query = activeSearch.toLowerCase();
            const filtered = students.filter(student => 
                student.name.toLowerCase().includes(query) ||
                student.student_code.toLowerCase().includes(query)
            );
            setFilteredStudents(filtered);
        }
    }, [activeSearch, students]);

    useEffect(() => {
        if (!selectedCourse) return;
        fetchStudents();
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/instructor/my-courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/instructor/course/${selectedCourse}/students`);
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
            setStudents([]);
            setFilteredStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (enrollment_id: number, currentGrade: number | null) => {
        setEditingId(enrollment_id);
        setTempGrade(currentGrade !== null ? currentGrade.toString() : '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTempGrade('');
    };

    const saveGrade = async (enrollment_id: number) => {
        const gradeValue = parseFloat(tempGrade);
        
        if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
            alert('Please enter a valid grade between 0 and 100');
            return;
        }

        try {
            await api.post('/instructor/grades/update', {
                enrollment_id,
                grade: gradeValue
            });
            
            setStudents(current => current.map(s => 
                s.enrollment_id === enrollment_id ? { ...s, grade: gradeValue } : s
            ));
            
            setEditingId(null);
            setTempGrade('');
            // alert('Grade saved successfully!'); 
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save grade.');
        }
    };

    const deleteGrade = async (enrollment_id: number) => {
        if (!confirm('Are you sure you want to delete this grade?')) return;

        try {
            await api.post('/instructor/grades/delete', {
                enrollment_id
            });
            
            setStudents(current => current.map(s => 
                s.enrollment_id === enrollment_id ? { ...s, grade: null } : s
            ));
            
            // alert('Grade deleted successfully!');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to delete grade.');
        }
    };

    const getGradeColor = (grade: number | null) => {
        if (grade === null) return 'text-gray-400';
        if (grade >= 90) return 'text-green-600';
        if (grade >= 80) return 'text-blue-600';
        if (grade >= 70) return 'text-yellow-600';
        if (grade >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ClipboardCheck className="text-orange-500" /> Grade Management
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select 
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setLocalSearch('');
                        }}
                    >
                        <option value="">Select Course...</option>
                        {courses.map(course => (
                            <option key={course.assignment_id || course.id} value={course.id}>
                                {course.code} - {course.title} {course.section ? `(Sec ${course.section})` : ''}
                            </option>
                        ))}
                    </select>

                    {courses.length > 0 && (
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search students by name or ID..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={!selectedCourse}
                            />
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white border rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3">Student ID</th>
                                <th className="px-4 py-3">Student Name</th>
                                <th className="px-4 py-3 text-center">Final Grade</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-4 text-center">Loading students...</td></tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.enrollment_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-600">{student.student_code}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-4 py-3 text-center">
                                            {editingId === student.enrollment_id ? (
                                                <input 
                                                    type="number" 
                                                    max={100}
                                                    min={0}
                                                    step={0.01}
                                                    className="w-24 border-2 border-indigo-500 rounded px-2 py-1 text-center font-bold text-gray-700" 
                                                    value={tempGrade}
                                                    onChange={(e) => setTempGrade(e.target.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className={`font-bold text-lg ${getGradeColor(student.grade)}`}>
                                                    {student.grade !== null ? student.grade.toFixed(2) : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                {editingId === student.enrollment_id ? (
                                                    <>
                                                        <button 
                                                            onClick={() => saveGrade(student.enrollment_id)}
                                                            className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                                                            title="Save"
                                                        >
                                                            <Save className="h-4 w-4" /> Save
                                                        </button>
                                                        <button 
                                                            onClick={cancelEdit}
                                                            className="flex items-center gap-1 text-xs bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
                                                            title="Cancel"
                                                        >
                                                            <X className="h-4 w-4" /> Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => startEdit(student.enrollment_id, student.grade)}
                                                            className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition"
                                                            title="Edit / Add"
                                                        >
                                                             <Edit2 className="h-4 w-4" /> Edit
                                                        </button>
                                                        {student.grade !== null && (
                                                            <button 
                                                                onClick={() => deleteGrade(student.enrollment_id)}
                                                                className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        {selectedCourse 
                                            ? (activeSearch ? 'No students found matching your search.' : 'No students enrolled in this course.') 
                                            : 'Please select a course to view students.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
