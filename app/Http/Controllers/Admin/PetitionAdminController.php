<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Petition;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Data\GameData;
use App\Models\Game;

class PetitionAdminController extends Controller
{
    public function index()
    {
        $petitions = Petition::with('user')
            ->orderByRaw("CASE WHEN status='pending' THEN 0 ELSE 1 END")
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'reason' => $p->reason,
                'status' => $p->status,
                'created_at' => $p->created_at?->toDateTimeString(),
                'user' => [
                    'id' => $p->user?->id,
                    'name' => $p->user?->name,
                    'email' => $p->user?->email,
                ],
            ]);

        return Inertia::render('Admin/Petitions/Index', [
            'petitions' => $petitions,
        ]);
    }

    public function approve(Petition $petition)
    {
        $dto = GameData::from([
            'title' => $petition->title,
            'description' => $petition->reason ?? 'Juego creado desde petición aprobada',
            'is_published' => true,
            'cover_path' => null,
            'created_by' => auth()->id(),
        ]);

        Game::create([
            'title' => $dto->title,
            'description' => $dto->description,
            'is_published' => $dto->is_published,
            'cover_path' => $dto->cover_path,
            'created_by' => $dto->created_by,
        ]);

        if ($petition->status !== 'pending') {
            return back()->with('success', ' Esa petición ya fue procesada.');
        }

        $petition->update(['status' => 'approved']);

        return redirect()
            ->route('admin.petitions.index')
            ->with('success', 'Petición aprobada.');

    }

    public function reject(Request $request, Petition $petition)
    {
        if ($petition->status !== 'pending') {
            return back()->with('success', 'Esa petición ya fue procesada.');
        }

        // Si luego quieres guardar "motivo de rechazo", hacemos una columna.
        $petition->update(['status' => 'rejected']);

        return redirect()
            ->route('admin.petitions.index')
            ->with('success', '🛑 Petición rechazada.');
    }
}
