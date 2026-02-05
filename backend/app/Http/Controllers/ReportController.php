<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Department;
use App\Models\Instructor;
use App\Models\Course;

class ReportController extends Controller
{
    public function enrollmentStats()
    {
        // Count students per department
        $stats = DB::table('students')
            ->join('departments', 'students.department_id', '=', 'departments.id')
            ->select('departments.name', DB::raw('count(students.id) as total_students'))
            ->groupBy('departments.name')
            ->get();
            
        return response()->json($stats);
    }

    public function gradeDistribution()
    {
        // Average grade per course
        $stats = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->whereNotNull('enrollments.grade')
            ->select('courses.code', 'courses.title', DB::raw('AVG(enrollments.grade) as average_grade'), DB::raw('COUNT(enrollments.id) as graded_students'))
            ->groupBy('courses.code', 'courses.title')
            ->get();

        return response()->json($stats);
    }

    public function instructorWorkloads()
    {
        // Courses per instructor
        $stats = DB::table('course_instructor')
            ->join('instructors', 'course_instructor.instructor_id', '=', 'instructors.id')
            ->join('users', 'instructors.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('count(course_instructor.course_id) as total_courses'))
            ->groupBy('users.name')
            ->get();

        return response()->json($stats);
    }
}
