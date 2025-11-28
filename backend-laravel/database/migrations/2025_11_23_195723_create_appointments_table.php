<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('doctor_id', 36);
            $table->string('patient_name');
            $table->string('phone');
            $table->string('age')->nullable();
            $table->text('reason')->nullable();
            $table->date('appointment_date');
            $table->string('time_slot');
            $table->timestamps();

            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
