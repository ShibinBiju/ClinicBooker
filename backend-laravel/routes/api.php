<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Doctor Routes
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::post('/doctors', [DoctorController::class, 'store']);

// Appointment Routes
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/check-availability', [AppointmentController::class, 'checkAvailability']);
Route::get('/appointments/doctor/{doctorId}', [AppointmentController::class, 'byDoctor']);
Route::post('/appointments', [AppointmentController::class, 'store']);
