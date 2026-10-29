<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

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

    $testUser = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    // Igual que en el registro normal: todo usuario necesita el rol "user"
    // para que la ReviewPolicy le permita publicar reseñas.
    $testUser->roles()->attach(Role::where('name', 'user')->first());
}}
