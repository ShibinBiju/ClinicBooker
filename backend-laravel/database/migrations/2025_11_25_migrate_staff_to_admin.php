<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add columns to admin table
        Schema::table('admins', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
        });

        // Copy all staff to admin table
        $staff = DB::table('staff')->get();
        foreach ($staff as $s) {
            DB::table('admins')->insert([
                'id' => $s->id,
                'username' => $s->name,
                'name' => $s->name,
                'email' => $s->email,
                'phone' => $s->phone,
                'password' => DB::table('staff')->where('id', $s->id)->value('password'),
                'role' => $s->role,
                'token' => DB::table('staff')->where('id', $s->id)->value('token'),
                'last_login' => DB::table('staff')->where('id', $s->id)->value('updated_at'),
            ]);
        }

        // Drop staff table
        Schema::dropIfExists('staff');
    }

    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn(['name', 'email', 'phone']);
        });
    }
};
