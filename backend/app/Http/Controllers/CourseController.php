<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function instructorSchedule(Request $request)
    {
        return response()->json(['message' => 'Instructor schedule']);
    }

    public function updateGrades(Request $request)
    {
        return response()->json(['message' => 'Grades updated']);
    }
}
