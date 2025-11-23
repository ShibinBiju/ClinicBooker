<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

// Public routes
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::post('/doctors', [DoctorController::class, 'store']);

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/check-availability', [AppointmentController::class, 'checkAvailability']);
Route::get('/appointments/doctor/{doctorId}', [AppointmentController::class, 'byDoctor']);
Route::post('/appointments', [AppointmentController::class, 'store']);

// Auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me', [AuthController::class, 'me']);

// Admin routes
Route::get('/admin/doctors', [AdminController::class, 'getDoctors']);
Route::post('/admin/doctors', [AdminController::class, 'createDoctor']);
Route::put('/admin/doctors/{id}', [AdminController::class, 'updateDoctor']);
Route::delete('/admin/doctors/{id}', [AdminController::class, 'deleteDoctor']);
Route::get('/admin/appointments', [AdminController::class, 'getAppointments']);
Route::post('/admin/appointments', [AdminController::class, 'createAppointmentStaff']);
