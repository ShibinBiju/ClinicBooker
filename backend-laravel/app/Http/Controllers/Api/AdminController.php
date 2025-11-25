<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    private function checkAuth(\Illuminate\Http\Request $request)
    {
        // Try to get token from Authorization header
        $token = $request->bearerToken();
        
        // If not found, try manual parsing
        if (!$token) {
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
            }
        }
        
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $admin = \App\Models\Admin::where('token', $token)->first();
        if (!$admin) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return null;
    }

    public function getDoctors(Request $request)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        return response()->json(Doctor::all());
    }

    public function createDoctor(Request $request)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'specialty' => 'required|string',
            'image' => 'required|file|image|max:5120',
            'available_days' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        try {
            $data = $request->all();
            
            // Handle file upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('doctors', $filename, 'public');
                $data['image'] = '/storage/' . $path;
            }

            // Parse available_days JSON
            if (is_string($data['available_days'])) {
                $data['available_days'] = json_decode($data['available_days'], true);
            }

            $doctor = Doctor::create($data);
            return response()->json($doctor, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create doctor: ' . $e->getMessage()], 500);
        }
    }

    public function updateDoctor(Request $request, $id)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $doctor->update($request->only(['name', 'specialty', 'image', 'available_days']));
        return response()->json($doctor);
    }

    public function deleteDoctor(Request $request, $id)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }

    public function getAppointments(Request $request)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        return response()->json(Appointment::with('doctor')->get());
    }

    public function createAppointmentStaff(Request $request)
    {
        $auth = $this->checkAuth($request);
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

    public function getStaff(Request $request)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        // Return all admins that are staff/users
        return response()->json(Admin::where('role', '!=', 'admin')->get());
    }

    public function createStaff(Request $request)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:admins,email',
            'phone' => 'required|string',
            'role' => 'required|string|in:receptionist,nurse,technician,staff',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        try {
            $data = $request->all();
            // Hash the provided password
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
            $data['username'] = $request->name;
            $staff = Admin::create($data);
            return response()->json($staff, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create staff'], 500);
        }
    }

    public function updateStaff(Request $request, $id)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $staff = Admin::find($id);
        if (!$staff) {
            return response()->json(['error' => 'Staff not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:admins,email,' . $id,
            'phone' => 'required|string',
            'role' => 'required|string|in:receptionist,nurse,technician,staff',
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $data = $request->all();
        $data['username'] = $request->name;
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        $staff->update($data);
        return response()->json($staff);
    }

    public function deleteStaff(Request $request, $id)
    {
        $auth = $this->checkAuth($request);
        if ($auth) return $auth;

        $staff = Admin::find($id);
        if (!$staff) {
            return response()->json(['error' => 'Staff not found'], 404);
        }

        $staff->delete();
        return response()->json(['message' => 'Staff deleted successfully']);
    }
}
