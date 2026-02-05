<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Course;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@sims.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Departments
        $cs = Department::create([
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Department of Computer Science'
        ]);
        
        $eng = Department::create([
            'name' => 'Engineering',
            'code' => 'ENG',
            'description' => 'Department of Engineering'
        ]);

        // Course
        Course::create([
            'department_id' => $cs->id,
            'code' => 'CS101',
            'title' => 'Intro to Programming',
            'credits' => 3
        ]);
        
        // Student User
        User::create([
            'name' => 'John Student',
            'email' => 'student@sims.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        
        // Instructor User
        User::create([
            'name' => 'Dr. Smith',
            'email' => 'instructor@sims.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
        ]);

        // Department User
        User::create([
            'name' => 'Department Admin',
            'email' => 'department@sims.com',
            'password' => Hash::make('password'),
            'role' => 'department',
        ]);
    }
}
