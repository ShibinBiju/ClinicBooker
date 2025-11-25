<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $validated['username'])->first();

        if (!$admin || !Hash::check($validated['password'], $admin->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Generate token
        $token = bin2hex(random_bytes(32));
        $admin->update(['last_login' => now(), 'token' => $token]);
        
        return response()->json([
            'id' => $admin->id,
            'username' => $admin->username,
            'role' => $admin->role,
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

        $admin = Admin::where('token', $token)->first();
        if (!$admin) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => $admin->id,
            'username' => $admin->username,
            'role' => $admin->role,
        ]);
    }
}

