<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::all();
        return response()->json($doctors);
    }

    public function show($id)
    {
        $doctor = Doctor::find($id);
        
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }
        
        return response()->json($doctor);
    }

    public function store(Request $request)
    {
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

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
