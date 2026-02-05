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

    // Admin Routes
    Route::group(['prefix' => 'admin', 'middleware' => ['role:admin']], function () {
        Route::apiResource('users', AdminController::class);
        Route::post('courses/assign', [AdminController::class, 'assignInstructor']);
    });

    // Student Routes
    Route::group(['prefix' => 'student', 'middleware' => ['role:student']], function () {
        Route::get('courses', [StudentController::class, 'myCourses']);
        Route::post('courses/{id}/enroll', [StudentController::class, 'enroll']);
        Route::get('transcript', [StudentController::class, 'transcript']);
    });
    
    // Instructor Routes
    Route::group(['prefix' => 'instructor', 'middleware' => ['role:instructor']], function () {
        Route::get('schedule', [CourseController::class, 'instructorSchedule']);
        Route::post('grades/update', [CourseController::class, 'updateGrades']);
    });
});
