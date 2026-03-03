<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();

        $admin = User::firstOrCreate(
            ['email' => 'admin@gamereviews.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Admin12345*'),
            ]
        );

        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }
    }
}
