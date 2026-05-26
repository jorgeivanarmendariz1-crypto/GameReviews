<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Petition;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return Inertia::render('Admin/Dashboard', [
                // Contadores globales para las stats cards
                'totalGames' => Game::count(),
                'openGames' => Game::where('is_open', true)->count(),
                'pendingPetitions' => Petition::where('status', 'pending')->count(),
                'totalReviews' => Review::count(),

                // Últimas 5 peticiones con el usuario que las creó (evita N+1)
                'recentPetitions' => Petition::with('user')
                    ->latest()
                    ->take(5)
                    ->get(),
            ]);
        }

        // Usuario normal: sus reseñas con el juego relacionado (evita N+1)
        return Inertia::render('User/Dashboard', [
            'reviews' => Review::with('game')
                ->where('user_id', $user->id)
                ->latest()
                ->get(),
        ]);
    }
}
