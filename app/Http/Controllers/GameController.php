<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Data\GameData;
use App\Http\Requests\StoreGameRequest;
//use App\Models\Game;

class GameController extends Controller
{
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
        // return Inertia::render('Games/Index', [
        //     'games' => Game::query()
        //         ->where('is_open', true)
        //         ->latest()
        //         ->get(),
        // ]);

        return \Inertia\Inertia::render('Games/Index', [
            'games' => \App\Models\Game::where('is_open', true)
                ->latest()
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Games/Create');
    }

    public function store(StoreGameRequest $request)
    {
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
            'is_published' => (bool) $validated['is_published'],
            'cover_path' => $coverPath,
            'created_by' => $request->user()->id,
        ]);

        Game::create([
            'title' => $dto->title,
            'description' => $dto->description,
            'is_published' => $dto->is_published,
            'cover_path' => $dto->cover_path,
            'created_by' => $dto->created_by,
            'is_open' => $dto->is_open
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Juego creado correctamente.');
    }

}
