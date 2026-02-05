'use client';

import { Calendar } from 'lucide-react';

export default function TeachingSchedulePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-purple-500" /> Teaching Schedule
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    {['Monday', 'Wednesday', 'Friday'].map((day) => (
                        <div key={day}>
                            <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">{day}</h3>
                            <div className="space-y-3">
                                <div className="flex flex-col md:flex-row p-4 rounded-lg bg-purple-50 border-l-4 border-purple-500">
                                    <div className="w-32 font-bold text-purple-900">09:00 - 10:30</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">Introduction to Computer Science (Sec A)</h4>
                                        <p className="text-sm text-gray-600">Room 304 • Main Building</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
                                    <div className="w-32 font-bold text-gray-700">11:00 - 12:30</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">Office Hours</h4>
                                        <p className="text-sm text-gray-600">Faculty Office 102</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
