<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Require Token)
Route::group(['middleware' => ['auth:sanctum']], function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    
    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/test', [\App\Http\Controllers\NotificationController::class, 'createDemoNotification']);

    // Admin & Department Management Routes
    Route::group(['prefix' => 'admin', 'middleware' => ['role:admin|department']], function () {
        // Only actual Admin can manage users and departments generally
        Route::apiResource('users', AdminController::class)->middleware('role:admin'); 
        
        // Departments: Index is shared, others are admin only
        Route::get('departments', [\App\Http\Controllers\DepartmentController::class, 'index']);
        Route::apiResource('departments', \App\Http\Controllers\DepartmentController::class)
            ->except(['index'])
            ->middleware('role:admin');
        
        // Shared Resources (Admin + Department)
        Route::apiResource('courses', \App\Http\Controllers\CourseController::class);
        Route::apiResource('students', \App\Http\Controllers\StudentController::class);
        Route::apiResource('instructors', \App\Http\Controllers\InstructorController::class);
        
        Route::post('courses/assign', [AdminController::class, 'assignInstructor']);

        // Reports
        Route::get('reports/enrollment', [\App\Http\Controllers\ReportController::class, 'enrollmentStats']);
        Route::get('reports/grades', [\App\Http\Controllers\ReportController::class, 'gradeDistribution']);
        Route::get('reports/workload', [\App\Http\Controllers\ReportController::class, 'instructorWorkloads']);
    });

    // Student Routes
    Route::group(['prefix' => 'student', 'middleware' => ['role:student']], function () {
        Route::get('courses', [StudentController::class, 'myCourses']);
        Route::get('available-courses', [StudentController::class, 'availableCourses']);
        Route::post('courses/{id}/enroll', [StudentController::class, 'enroll']);
        Route::get('transcript', [StudentController::class, 'transcript']);
    });
    
    // Instructor Routes
    Route::group(['prefix' => 'instructor', 'middleware' => ['role:instructor']], function () {
        Route::get('schedule', [CourseController::class, 'instructorSchedule']);
        
        // Grade management
        Route::post('grades/update', [\App\Http\Controllers\InstructorController::class, 'updateGrade']);
        Route::post('grades/delete', [\App\Http\Controllers\InstructorController::class, 'deleteGrade']);
        
        // Course management (read-only for instructors)
        Route::get('courses', [\App\Http\Controllers\InstructorController::class, 'myCourses']); // Endpoint for CoursesPage
        Route::get('departments', [\App\Http\Controllers\DepartmentController::class, 'index']); // Endpoint for CoursesPage filter/display if needed
        Route::get('my-courses', [\App\Http\Controllers\InstructorController::class, 'myCourses']);
        Route::get('course/{courseId}/students', [\App\Http\Controllers\InstructorController::class, 'courseStudents']);
    });
});
