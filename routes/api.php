<?php

use App\Http\Controllers\Api\GameApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Endpoints públicos REST que devuelven JSON.
| Prefijo automático: /api
|
| GET /api/games              — Lista de juegos abiertos con promedio de rating
| GET /api/games/{id}         — Detalle de un juego
| GET /api/games/{id}/reviews — Reseñas de un juego
*/

Route::get('/games', [GameApiController::class, 'index']);
Route::get('/games/{game}', [GameApiController::class, 'show']);
Route::get('/games/{game}/reviews', [GameApiController::class, 'reviews']);
