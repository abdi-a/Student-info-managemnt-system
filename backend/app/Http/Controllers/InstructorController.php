<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    public function index()
    {
        return Instructor::with('user', 'department')->get();
    }

    public function show($id)
    {
        return Instructor::with('user', 'department')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'employee_id' => 'required|string|unique:instructors,employee_id',
            'department_id' => 'required|exists:departments,id',
            'specialization' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'instructor'
            ]);

            $user->instructor()->create([
                'employee_id' => $validated['employee_id'],
                'department_id' => $validated['department_id'],
                'specialization' => $validated['specialization'] ?? null
            ]);
        });

        return response()->json(['message' => 'Instructor created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);
        $user = $instructor->user;

        $validated = $request->validate([
            'name' => 'string',
            'email' => 'email|unique:users,email,' . $user->id,
            'employee_id' => 'string|unique:instructors,employee_id,' . $instructor->id,
            'department_id' => 'exists:departments,id',
            'specialization' => 'nullable|string'
        ]);

        DB::transaction(function () use ($instructor, $user, $validated) {
            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
            ]);

            $instructor->update([
                'employee_id' => $validated['employee_id'] ?? $instructor->employee_id,
                'department_id' => $validated['department_id'] ?? $instructor->department_id,
                'specialization' => $validated['specialization'] ?? $instructor->specialization,
            ]);
        });

        return response()->json(['message' => 'Instructor updated successfully']);
    }

    public function destroy($id)
    {
        $instructor = Instructor::findOrFail($id);
        
        DB::transaction(function () use ($instructor) {
            $instructor->user->delete();
            $instructor->delete();
        });

        return response()->noContent();
    }

    // Instructor Specific Methods
    public function myCourses(Request $request)
    {
        $instructor = $request->user()->instructor;
        if (!$instructor) {
            return response()->json([], 200);
        }

        // Fetch courses using the relationship defined in Instructor model
        // Assuming 'courses' relationship exists on Instructor model (belongsToMany)
        // If not, we use the manual join approach but structured correctly
        
        $courses = DB::table('course_instructor')
            ->join('courses', 'course_instructor.course_id', '=', 'courses.id')
            ->join('departments', 'courses.department_id', '=', 'departments.id')
            ->where('course_instructor.instructor_id', $instructor->id)
            ->select(
                'courses.*', 
                'departments.name as department_name', 
                'departments.code as department_code',
                'course_instructor.section', 
                'course_instructor.id as assignment_id'
            )
            ->get()
            ->map(function($course) {
                // Transform to match standard Course resource structure if needed
                $course->department = [
                    'name' => $course->department_name,
                    'code' => $course->department_code
                ];
                return $course;
            });

        return response()->json($courses);
    }

    public function courseStudents(Request $request, $courseId)
    {
        $instructor = $request->user()->instructor;
        if (!$instructor) {
            return response()->json(['message' => 'Instructor profile not found'], 404);
        }

        // Verify instructor teaches this course
        $teachesCourse = $instructor->courses()->where('courses.id', $courseId)->exists();
        if (!$teachesCourse) {
            return response()->json(['message' => 'Unauthorized access to this course'], 403);
        }

        // Get students enrolled in this course
        $students = DB::table('enrollments')
            ->join('students', 'enrollments.student_id', '=', 'students.id')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->where('enrollments.course_id', $courseId)
            ->select(
                'students.id as student_id', 
                'users.name', 
                'students.student_id as student_code', 
                'enrollments.grade',
                'enrollments.id as enrollment_id'
            )
            ->get();

        return response()->json($students);
    }

    public function updateGrade(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'grade' => 'required|numeric|min:0|max:100'
        ]);

        $instructor = $request->user()->instructor;
        if (!$instructor) {
            return response()->json(['message' => 'Instructor profile not found'], 404);
        }

        // Get enrollment and verify instructor teaches this course
        $enrollment = DB::table('enrollments')
            ->where('enrollments.id', $validated['enrollment_id'])
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }

        $teachesCourse = $instructor->courses()->where('courses.id', $enrollment->course_id)->exists();
        if (!$teachesCourse) {
            return response()->json(['message' => 'Unauthorized to grade this course'], 403);
        }

        // Update grade
        DB::table('enrollments')
            ->where('id', $validated['enrollment_id'])
            ->update(['grade' => $validated['grade']]);

        return response()->json(['message' => 'Grade updated successfully']);
    }

    public function deleteGrade(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id'
        ]);

        $instructor = $request->user()->instructor;
        if (!$instructor) {
            return response()->json(['message' => 'Instructor profile not found'], 404);
        }

        $enrollment = DB::table('enrollments')->where('id', $validated['enrollment_id'])->first();

        // Check authorization
        $teachesCourse = DB::table('course_instructor')
            ->where('instructor_id', $instructor->id)
            ->where('course_id', $enrollment->course_id)
            ->exists();

        if (!$teachesCourse) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Set grade to null
        DB::table('enrollments')
            ->where('id', $validated['enrollment_id'])
            ->update(['grade' => null]);

        return response()->json(['message' => 'Grade deleted successfully']);
    }
}
