<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\JsonResponse;

/**
 * GameApiController
 *
 * Endpoints públicos REST que exponen los datos del proyecto en formato JSON.
 * No requieren autenticación — solo muestran juegos abiertos y sus reseñas.
 */
class GameApiController extends Controller
{
    /**
     * GET /api/games
     * Lista todos los juegos abiertos con promedio de rating y cantidad de reseñas.
     */
    public function index(): JsonResponse
    {
        $games = Game::where('is_open', true)
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderBy('title')
            ->get()
            ->map(fn($game) => [
                'id' => $game->id,
                'title' => $game->title,
                'description' => $game->description,
                'cover_url' => $game->cover_path
                    ? asset('storage/' . $game->cover_path)
                    : null,
                'is_open' => $game->is_open,
                'avg_rating' => $game->reviews_avg_rating
                    ? round((float) $game->reviews_avg_rating, 1)
                    : null,
                'reviews_count' => $game->reviews_count,
                'created_at' => $game->created_at->toDateString(),
            ]);

        return response()->json([
            'data' => $games,
            'total' => $games->count(),
        ]);
    }

    /**
     * GET /api/games/{id}
     * Detalle de un juego específico.
     */
    public function show(Game $game): JsonResponse
    {
        $game->loadAvg('reviews', 'rating')->loadCount('reviews');

        return response()->json([
            'data' => [
                'id' => $game->id,
                'title' => $game->title,
                'description' => $game->description,
                'cover_url' => $game->cover_path
                    ? asset('storage/' . $game->cover_path)
                    : null,
                'is_open' => $game->is_open,
                'avg_rating' => $game->reviews_avg_rating
                    ? round((float) $game->reviews_avg_rating, 1)
                    : null,
                'reviews_count' => $game->reviews_count,
                'created_at' => $game->created_at->toDateString(),
                'updated_at' => $game->updated_at->toDateString(),
            ],
        ]);
    }

    /**
     * GET /api/games/{id}/reviews
     * Lista las reseñas de un juego con el nombre del autor.
     */
    public function reviews(Game $game): JsonResponse
    {
        $reviews = $game->reviews()
            ->with('user:id,name,email')
            ->latest()
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'content' => $review->content,
                'edit_count' => $review->edit_count,
                'author' => $review->user?->name ?? $review->user?->email,
                'created_at' => $review->created_at->toDateString(),
            ]);

        return response()->json([
            'game_id' => $game->id,
            'game' => $game->title,
            'data' => $reviews,
            'total' => $reviews->count(),
        ]);
    }
}
