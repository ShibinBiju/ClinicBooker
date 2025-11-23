<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::all();
        return response()->json($appointments);
    }

    public function byDoctor($doctorId)
    {
        $appointments = Appointment::where('doctor_id', $doctorId)->get();
        return response()->json($appointments);
    }

    public function checkAvailability(Request $request)
    {
        $doctorId = $request->query('doctorId');
        $date = $request->query('date');
        $timeSlot = $request->query('timeSlot');

        if (!$doctorId || !$date || !$timeSlot) {
            return response()->json(['error' => 'Missing required parameters'], 400);
        }

        $exists = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('time_slot', $timeSlot)
            ->exists();

        return response()->json(['available' => !$exists]);
    }

    public function store(Request $request)
    {
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

        // Check if slot is still available
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

    public function show(string $id)
    {
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }
        
        return response()->json($appointment);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
