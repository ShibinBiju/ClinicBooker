<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::updateOrCreate(
            ['username' => 'admin'],
            ['password' => 'admin123', 'role' => 'admin']
        );

        Admin::updateOrCreate(
            ['username' => 'staff'],
            ['password' => 'staff123', 'role' => 'staff']
        );
    }
}
