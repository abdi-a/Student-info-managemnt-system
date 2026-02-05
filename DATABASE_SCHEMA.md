# Database Schema & Migrations

Here is the database structure for the Student Information Management System.

## Roles
We will use a numeric `role_id` or a string `role` in the `users` table, or a simple Enum.
- 1: Admin
- 2: Department Head
- 3: Instructor
- 4: Student

## 1. Users Table
(Already exists in standard Laravel, add `role` and `is_active`)

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('role')->default('student'); // admin, department, instructor, student
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
});
```

## 2. Departments Table
```php
Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('code')->unique(); // e.g., CS, ENG
    $table->text('description')->nullable();
    $table->timestamps();
});
```

## 3. Students Table
Links to `users` table. Contains academic info.
```php
Schema::create('students', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
    $table->string('student_id')->unique(); // University ID
    $table->string('phone')->nullable();
    $table->string('address')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->string('enrollment_year');
    $table->decimal('gpa', 3, 2)->default(0.00);
    $table->timestamps();
});
```

## 4. Instructors Table
Links to `users` table.
```php
Schema::create('instructors', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
    $table->string('designation')->nullable(); // Professor, Lecturer
    $table->string('phone')->nullable();
    $table->text('bio')->nullable();
    $table->timestamps();
});
```

## 5. Academic Terms (Optional but good for scalability)
```php
Schema::create('semesters', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Fall 2023
    $table->date('start_date');
    $table->date('end_date');
    $table->boolean('is_active')->default(false);
    $table->timestamps();
});
```

## 6. Courses Table
```php
Schema::create('courses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('department_id')->constrained()->onDelete('cascade');
    $table->string('code')->unique(); // CS101
    $table->string('title');
    $table->integer('credits');
    $table->text('description')->nullable();
    $table->timestamps();
});
```

## 7. Course Assignments (Instructor - Course)
```php
Schema::create('course_instructor', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->foreignId('instructor_id')->constrained()->onDelete('cascade');
    $table->foreignId('semester_id')->constrained()->onDelete('cascade');
    $table->string('section')->nullable(); // Section A, B
    $table->timestamps();
});
```

## 8. Enrollments (Student - Course)
```php
Schema::create('enrollments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained()->onDelete('cascade');
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->foreignId('semester_id')->constrained()->onDelete('cascade');
    $table->decimal('grade', 5, 2)->nullable(); // Numeric Grade
    $table->string('letter_grade')->nullable(); // A, B, C
    $table->enum('status', ['enrolled', 'dropped', 'completed', 'failed'])->default('enrolled');
    $table->timestamps();
});
```
