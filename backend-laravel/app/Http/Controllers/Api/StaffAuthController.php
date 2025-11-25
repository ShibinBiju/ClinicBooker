<?php

namespace App\Http\Controllers\Api;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class StaffAuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
        ]);

        $staff = Staff::where('name', $validated['name'])->first();

        if (!$staff || !Hash::check($validated['password'], $staff->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        session(['staff_id' => $staff->id, 'staff_name' => $staff->name, 'staff_role' => $staff->role]);
        
        return response()->json([
            'id' => $staff->id,
            'name' => $staff->name,
            'role' => $staff->role,
            'message' => 'Login successful'
        ]);
    }

    public function logout(Request $request)
    {
        session()->forget(['staff_id', 'staff_role', 'staff_name']);
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        if (!session('staff_id')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => session('staff_id'),
            'name' => session('staff_name'),
            'role' => session('staff_role'),
        ]);
    }
}
