<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('role')->default('staff');
            $table->timestamp('last_login')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
