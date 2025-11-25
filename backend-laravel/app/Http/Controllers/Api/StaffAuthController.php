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

        // Generate token
        $token = bin2hex(random_bytes(32));
        $staff->update(['token' => $token]);
        
        return response()->json([
            'id' => $staff->id,
            'name' => $staff->name,
            'role' => $staff->role,
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            Staff::where('token', $token)->update(['token' => null]);
        }
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $staff = Staff::where('token', $token)->first();
        if (!$staff) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => $staff->id,
            'name' => $staff->name,
            'role' => $staff->role,
        ]);
    }
}
