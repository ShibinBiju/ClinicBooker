<?php

namespace App\Http\Controllers\Api;

use App\Models\Admin;
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

        $staff = Admin::where('name', $validated['name'])->first();

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
        
        // Manual parsing if needed
        if (!$token) {
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
            }
        }
        
        if ($token) {
            Admin::where('token', $token)->update(['token' => null]);
        }
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();
        
        // Manual parsing if needed
        if (!$token) {
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
            }
        }
        
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $staff = Admin::where('token', $token)->first();
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
