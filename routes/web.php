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




Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-only', function () {
        return 'Solo admins pueden ver esto';
    });
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/games', [GameController::class, 'index'])->name('games.index');
    Route::get('/games/create', [GameController::class, 'create'])->name('games.create');
    Route::post('/games', [GameController::class, 'store'])->name('games.store');
});

// USER
Route::middleware(['auth'])->group(function () {
    Route::get('/petitions/create', [PetitionController::class, 'create'])->name('petitions.create');
    Route::post('/petitions', [PetitionController::class, 'store'])->name('petitions.store');

    // El usuario puede ver la lista de juegos
    Route::get('/games', [GameController::class, 'index'])->name('games.index');

    Route::get('/games', [GameController::class, 'publicIndex'])->name('games.index');

    // Ruta para ver juegos???
    Route::get('/games', [GameController::class, 'publicIndex'])->name('games.index');


});

// ADMIN
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/petitions', [PetitionController::class, 'adminIndex'])->name('petitions.index');
    Route::post('/petitions/{petition}/approve', [PetitionController::class, 'approve'])->name('petitions.approve');
    Route::post('/petitions/{petition}/reject', [PetitionController::class, 'reject'])->name('petitions.reject');

});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/petitions', [PetitionAdminController::class, 'index'])->name('admin.petitions.index');
    Route::post('/admin/petitions/{petition}/approve', [PetitionAdminController::class, 'approve'])->name('admin.petitions.approve');
    Route::post('/admin/petitions/{petition}/reject', [PetitionAdminController::class, 'reject'])->name('admin.petitions.reject');
    Route::get('/admin/games', [GameController::class, 'index'])->name('admin.games.index');

});

// TODO
// Esto es para USER?
Route::middleware(['auth'])->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::patch('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});

require __DIR__ . '/auth.php';
