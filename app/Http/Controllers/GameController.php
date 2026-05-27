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

    // Para USER (y admin también visita esta vista)
    public function publicIndex(Request $request)
    {
        $query = Game::withAvg('reviews', 'rating')
            ->withCount('reviews');

        // Búsqueda por título o descripción
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtro por estado: 'open' | 'closed' | '' (todos)
        $status = $request->input('status', '');
        if ($status === 'open') {
            $query->where('is_open', true);
        } elseif ($status === 'closed') {
            $query->where('is_open', false);
        }

        $games = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Games/Index', [
            'games' => $games,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    // Toggle is_open (solo admin, llamado desde la biblioteca)
    public function toggleOpen(Game $game)
    {
        $this->authorize('create', Game::class); // reutiliza la policy de admin
        $game->update(['is_open' => !$game->is_open]);

        return back()->with('success', 'Estado del juego actualizado.');
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
