<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Data\GameData;
use App\Http\Requests\StoreGameRequest;

class GameController extends Controller
{
    use AuthorizesRequests;
    // Para ADMIN
    public function index()
    {
        return Inertia::render('Admin/Games/Index', [
            'games' => Game::latest()->get(),
        ]);
    }

    // Para USER
    public function publicIndex()
    {
        return \Inertia\Inertia::render('Games/Index', [
            'games' => \App\Models\Game::where('is_open', true) // Filtramos solamente los juegos que esten "abiertos/activos"
                ->latest() // Se ordena del mas reciente al mas antiguo
                ->get(), // Ejecutamos la ruta y nos trae los resultados
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Games/Create');
    }

    public function store(StoreGameRequest $request)
    {
        $this->authorize('create', Game::class);
        $validated = $request->validated();

        // Subir portada si existe
        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        // DTO
        $dto = GameData::from([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_open' => (bool) ($validated['is_open'] ?? true),
            'cover_path' => $coverPath,
            'created_by' => $request->user()->id,
        ]);

        Game::create([
            'title' => $dto->title,
            'description' => $dto->description,
            'is_open' => $dto->is_open,
            'cover_path' => $dto->cover_path,
            'created_by' => $dto->created_by,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Juego creado correctamente.');
    }

    public function show(Game $game)
    {
        $game->load(['reviews.user']);
        return Inertia::render('Games/Show', [
            'game' => $game,
            'reviews' => $game->reviews()->with('user')->latest()->get(),
        ]);
    }
}
