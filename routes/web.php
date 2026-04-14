<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PetitionController;
use App\Http\Controllers\Admin\PetitionAdminController;
use App\Http\Controllers\ReviewController;

// -------------------------------------------------------
// Ruta raíz → redirige al login
// -------------------------------------------------------
Route::get('/', function () {
    return redirect()->route('login');
});

// -------------------------------------------------------
// Dashboard (autenticado y verificado)
// -------------------------------------------------------
Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// -------------------------------------------------------
// Perfil de usuario (autenticado)
// -------------------------------------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -------------------------------------------------------
// USER — Rutas para usuarios autenticados
// -------------------------------------------------------
Route::middleware(['auth'])->group(function () {
    // Juegos públicos (solo los abiertos)
    Route::get('/games', [GameController::class, 'publicIndex'])->name('games.index');

    // Peticiones
    Route::get('/petitions/create', [PetitionController::class, 'create'])->name('petitions.create');
    Route::post('/petitions', [PetitionController::class, 'store'])->name('petitions.store');

    // Reseñas
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::patch('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});

// -------------------------------------------------------
// ADMIN — Rutas protegidas para administradores
// -------------------------------------------------------
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Juegos (todos, incluyendo cerrados)
    Route::get('/games', [GameController::class, 'index'])->name('games.index');
    Route::get('/games/create', [GameController::class, 'create'])->name('games.create');
    Route::post('/games', [GameController::class, 'store'])->name('games.store');

    // Peticiones
    Route::get('/petitions', [PetitionController::class, 'adminIndex'])->name('petitions.index');
    Route::post('/petitions/{petition}/approve', [PetitionController::class, 'approve'])->name('petitions.approve');
    Route::post('/petitions/{petition}/reject', [PetitionController::class, 'reject'])->name('petitions.reject');
});

require __DIR__ . '/auth.php';
