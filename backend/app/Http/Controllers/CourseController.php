<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    // Admin Methods
    public function index()
    {
        return Course::with('department')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'code' => 'required|string|unique:courses,code',
            'title' => 'required|string',
            'credits' => 'required|integer',
            'description' => 'nullable|string'
        ]);

        return Course::create($validated);
    }

    public function show(Course $course)
    {
        return $course->load('department');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'department_id' => 'exists:departments,id',
            'code' => 'string|unique:courses,code,' . $course->id,
            'title' => 'string',
            'credits' => 'integer',
            'description' => 'nullable|string'
        ]);

        $course->update($validated);
        return $course;
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->noContent();
    }

    // Instructor Methods
    public function instructorSchedule(Request $request)
    {
        return response()->json(['message' => 'Instructor schedule']);
    }

    public function updateGrades(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'grade' => 'required|numeric|min:0|max:100'
        ]);

        // In a real app, verify the instructor teaches this course
        
        DB::table('enrollments')
            ->where('id', $validated['enrollment_id'])
            ->update([
                'grade' => $validated['grade'],
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Grade updated successfully']);
    }
}
