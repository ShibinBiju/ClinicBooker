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
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $admin->update(['last_login' => now()]);
        
        session(['admin_id' => $admin->id, 'admin_role' => $admin->role, 'admin_username' => $admin->username]);
        
        return response()->json([
            'id' => $admin->id,
            'username' => $admin->username,
            'role' => $admin->role,
            'message' => 'Login successful'
        ]);
    }

    public function logout(Request $request)
    {
        session()->forget(['admin_id', 'admin_role', 'admin_username']);
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        if (!session('admin_id')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => session('admin_id'),
            'username' => session('admin_username'),
            'role' => session('admin_role'),
        ]);
    }
}
