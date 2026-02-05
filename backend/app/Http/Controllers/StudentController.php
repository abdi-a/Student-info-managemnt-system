<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // Admin: List all students
    public function index()
    {
        return Student::with('user', 'department')->get();
    }

    public function show($id)
    {
        return Student::with('user', 'department')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'student_id' => 'required|string|unique:students,student_id',
            'department_id' => 'nullable|exists:departments,id',
            'enrollment_year' => 'required|digits:4'
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'student'
            ]);

            $user->student()->create([
                'student_id' => $validated['student_id'],
                'department_id' => $validated['department_id'],
                'enrollment_year' => $validated['enrollment_year'],
                'gpa' => 0.00
            ]);
        });

        return response()->json(['message' => 'Student created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $user = $student->user;

        $validated = $request->validate([
            'name' => 'string',
            'email' => 'email|unique:users,email,' . $user->id,
            'student_id' => 'string|unique:students,student_id,' . $student->id,
            'department_id' => 'nullable|exists:departments,id',
            'enrollment_year' => 'digits:4'
        ]);

        DB::transaction(function () use ($student, $user, $validated) {
            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
            ]);

            $student->update([
                'student_id' => $validated['student_id'] ?? $student->student_id,
                'department_id' => $validated['department_id'] ?? $student->department_id,
                'enrollment_year' => $validated['enrollment_year'] ?? $student->enrollment_year,
            ]);
        });

        return response()->json(['message' => 'Student updated successfully']);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $user = $student->user;
        
        DB::transaction(function () use ($student, $user) {
            $student->delete();
            $user->delete();
        });

        return response()->noContent();
    }

    // Student Role Methods (For when logged in as student)
    public function myCourses(Request $request)
    {
        $student = $request->user()->student;
        if(!$student) return response()->json(['message' => 'Not a student'], 403);
        
        $courses = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->where('enrollments.student_id', $student->id)
            ->select('courses.*', 'enrollments.grade', 'enrollments.id as enrollment_id')
            ->get();
            
        return response()->json($courses); 
    }

    public function availableCourses(Request $request)
    {
        $student = $request->user()->student;
        if(!$student) return response()->json(['message' => 'Not a student'], 403);

        $enrolledCourseIds = DB::table('enrollments')
            ->where('student_id', $student->id)
            ->pluck('course_id');

        $courses = \App\Models\Course::with('department')
            ->whereNotIn('id', $enrolledCourseIds)
            ->get();

        return response()->json($courses);
    }

    public function enroll(Request $request, $id)
    {
        $student = $request->user()->student;
        if(!$student) return response()->json(['message' => 'Not a student'], 403);

        // Check if already enrolled
        $exists = DB::table('enrollments')
            ->where('student_id', $student->id)
            ->where('course_id', $id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already enrolled'], 400);
        }

        DB::table('enrollments')->insert([
            'student_id' => $student->id,
            'course_id' => $id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => "Enrolled in course successfully"]);
    }

    public function transcript(Request $request)
    {
        $student = $request->user()->student;
        if(!$student) return response()->json(['message' => 'Not a student'], 403);

        $transcript = DB::table('enrollments')
             ->join('courses', 'enrollments.course_id', '=', 'courses.id')
             ->where('enrollments.student_id', $student->id)
             ->whereNotNull('enrollments.grade')
             ->select('courses.code', 'courses.title', 'courses.credits', 'enrollments.grade')
             ->get();

        return response()->json($transcript);
    }
}
