<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:departments,code|max:10',
            'description' => 'nullable|string'
        ]);

        return Department::create($validated);
    }

    public function show(Department $department)
    {
         return $department;
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|max:10|unique:departments,code,' . $department->id,
            'description' => 'nullable|string'
        ]);

        $department->update($validated);
        return $department;
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->noContent();
    }
}
