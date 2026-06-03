<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Data\GameData;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class GameController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Inertia::render('Admin/Games/Index', [
            'games' => Game::latest()->get(),
        ]);
    }

    public function publicIndex(Request $request)
    {
        $query = Game::withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

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

    public function toggleOpen(Game $game)
    {
        $game->update(['is_open' => !$game->is_open]);
        return back()->with('success', 'Estado del juego actualizado.');
    }

    public function destroy(Game $game)
    {
        $this->authorize('delete', $game);

        if ($game->cover_path) {
            $publicId = pathinfo($game->cover_path, PATHINFO_FILENAME);
            Cloudinary::destroy("game-covers/{$publicId}");
        }

        $game->delete();
        return back()->with('success', 'Juego eliminado.');
    }

    public function create()
    {
        return Inertia::render('Admin/Games/Create', [
            'openGames' => Game::where('is_open', true)
                ->orderBy('title')
                ->get(['id', 'title']),
            'prefillTitle' => session('prefill_title', ''),
        ]);
    }

    public function store(StoreGameRequest $request)
    {
        $this->authorize('create', Game::class);
        $validated = $request->validated();

        $coverPath = null;
        if ($request->hasFile('cover')) {
            $result = Cloudinary::upload(
                $request->file('cover')->getRealPath(),
                ['folder' => 'game-covers']
            );
            $coverPath = $result->getSecurePath();
        }

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

    public function edit(Game $game)
    {
        $this->authorize('update', $game);

        return Inertia::render('Admin/Games/Edit', [
            'game' => $game,
        ]);
    }

    public function update(UpdateGameRequest $request, Game $game)
    {
        $this->authorize('update', $game);

        $validated = $request->validated();

        if ($request->hasFile('cover')) {
            if ($game->cover_path) {
                $publicId = pathinfo(parse_url($game->cover_path, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::destroy("game-covers/{$publicId}");
            }

            $result = Cloudinary::upload(
                $request->file('cover')->getRealPath(),
                ['folder' => 'game-covers']
            );
            $validated['cover_path'] = $result->getSecurePath();
        }

        $game->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_open' => (bool) ($validated['is_open'] ?? false),
            'cover_path' => $validated['cover_path'] ?? $game->cover_path,
        ]);

        return redirect()
            ->route('games.show', $game)
            ->with('success', 'Juego actualizado correctamente.');
    }

    public function show(Game $game)
    {
        $game->load(['reviews.user']);
        return Inertia::render('Games/Show', [
            'game' => $game,
            'reviews' => $game->reviews()->with('user:id,name,email')->latest()->get(),
        ]);
    }
}
