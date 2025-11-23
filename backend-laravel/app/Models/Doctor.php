<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Doctor extends Model
{
    use HasUuids;

    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'specialty',
        'image',
        'available_days',
    ];

    protected $casts = [
        'available_days' => 'array',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
