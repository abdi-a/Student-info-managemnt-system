<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['department_id', 'code', 'title', 'credits', 'description'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
