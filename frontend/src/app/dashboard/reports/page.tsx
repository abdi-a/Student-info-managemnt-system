'use client';

import { FileBarChart, Users, BookOpen, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ReportsPage() {
    const [enrollmentStats, setEnrollmentStats] = useState<any[]>([]);
    const [gradeStats, setGradeStats] = useState<any[]>([]);
    const [workloadStats, setWorkloadStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [enrollRes, gradeRes, workRes] = await Promise.all([
                    api.get('/admin/reports/enrollment'),
                    api.get('/admin/reports/grades'),
                    api.get('/admin/reports/workload')
                ]);
                setEnrollmentStats(enrollRes.data);
                setGradeStats(gradeRes.data);
                setWorkloadStats(workRes.data);
            } catch (error) {
                console.error('Failed to fetch reports', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileBarChart className="text-teal-500" /> Administrative Reports
            </h1>

            <div className="grid grid-cols-1 gap-6">
                {/* Enrollment Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <Users size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Enrollment Statistics</h3>
                    </div>
                    {enrollmentStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2">Department</th>
                                        <th className="px-4 py-2">Total Students</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {enrollmentStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3">{stat.name}</td>
                                            <td className="px-4 py-3 font-bold">{stat.total_students}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No enrollment data available.</p>
                    )}
                </div>

                {/* Grade Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Grade Distribution (Avg per Course)</h3>
                    </div>
                    {gradeStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2">Course</th>
                                        <th className="px-4 py-2">Graded Students</th>
                                        <th className="px-4 py-2">Average Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {gradeStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3">{stat.code} - {stat.title}</td>
                                            <td className="px-4 py-3">{stat.graded_students}</td>
                                            <td className="px-4 py-3 font-bold text-green-600">{parseFloat(stat.average_grade).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No grade data available.</p>
                    )}
                </div>

                {/* Instructor Workloads */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                            <User size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Instructor Workloads</h3>
                    </div>
                    {workloadStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2">Instructor</th>
                                        <th className="px-4 py-2">Assigned Courses</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {workloadStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3">{stat.name}</td>
                                            <td className="px-4 py-3 font-bold">{stat.total_courses}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No workload data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
