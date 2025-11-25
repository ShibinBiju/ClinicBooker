<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Staff extends Model
{
    use HasUuids;

    protected $table = 'staff';
    protected $fillable = ['name', 'email', 'phone', 'role', 'password'];

    public $timestamps = true;
}
