<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    private function checkAuth()
    {
        if (!session('admin_id')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return null;
    }

    public function getDoctors()
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        return response()->json(Doctor::all());
    }

    public function createDoctor(Request $request)
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'specialty' => 'required|string',
            'image' => 'required|string',
            'available_days' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        try {
            $doctor = Doctor::create($request->all());
            return response()->json($doctor, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create doctor'], 500);
        }
    }

    public function updateDoctor(Request $request, $id)
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $doctor->update($request->only(['name', 'specialty', 'image', 'available_days']));
        return response()->json($doctor);
    }

    public function deleteDoctor($id)
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }

    public function getAppointments()
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        return response()->json(Appointment::with('doctor')->get());
    }

    public function createAppointmentStaff(Request $request)
    {
        $auth = $this->checkAuth();
        if ($auth) return $auth;

        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|string|exists:doctors,id',
            'patient_name' => 'required|string',
            'phone' => 'required|string',
            'age' => 'nullable|string',
            'reason' => 'nullable|string',
            'appointment_date' => 'required|date',
            'time_slot' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $exists = Appointment::where('doctor_id', $request->doctor_id)
            ->where('appointment_date', $request->appointment_date)
            ->where('time_slot', $request->time_slot)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'This time slot is no longer available'], 409);
        }

        try {
            $appointment = Appointment::create($request->all());
            return response()->json($appointment, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create appointment'], 500);
        }
    }
}
