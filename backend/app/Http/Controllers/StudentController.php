<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function myCourses(Request $request)
    {
        return response()->json(['message' => 'List of student courses']);
    }

    public function enroll(Request $request, $id)
    {
        return response()->json(['message' => "Enrolled in course $id"]);
    }

    public function transcript(Request $request)
    {
        return response()->json(['message' => 'Student transcript']);
    }
}
