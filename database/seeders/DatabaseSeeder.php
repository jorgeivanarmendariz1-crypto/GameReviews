<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
public function run(): void
{
    // Primero los roles, porque el administrador necesita que exista el rol "admin"
    $this->call([
        RoleSeeder::class,
        AdminUserSeeder::class,
    ]);

    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
}}
