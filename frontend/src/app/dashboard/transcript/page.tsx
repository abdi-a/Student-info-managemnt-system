'use client';

import { GraduationCap } from 'lucide-react';

export default function TranscriptPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <GraduationCap className="text-green-500" /> Academic Transcript
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-2">GPA Summary</h2>
                    <div className="text-4xl font-bold text-indigo-600">3.85</div>
                    <p className="text-gray-500 text-sm">Cumulative GPA</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-2">Credits Earned</h2>
                    <div className="text-4xl font-bold text-indigo-600">45</div>
                    <p className="text-gray-500 text-sm">Total Credits</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Semester 1 (Fall 2023)</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="pb-2">Course Code</th>
                            <th className="pb-2">Course Title</th>
                            <th className="pb-2">Grade</th>
                            <th className="pb-2">Points</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b last:border-0">
                            <td className="py-3">CS101</td>
                            <td className="py-3">Intro to Programming</td>
                            <td className="py-3 font-bold text-green-600">A</td>
                            <td className="py-3">4.0</td>
                        </tr>
                        <tr className="border-b last:border-0">
                            <td className="py-3">MAT101</td>
                            <td className="py-3">Calculus I</td>
                            <td className="py-3 font-bold text-green-600">A-</td>
                            <td className="py-3">3.7</td>
                        </tr>
                         <tr className="border-b last:border-0">
                            <td className="py-3">ENG101</td>
                            <td className="py-3">English Comp</td>
                            <td className="py-3 font-bold text-blue-600">B+</td>
                            <td className="py-3">3.3</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
