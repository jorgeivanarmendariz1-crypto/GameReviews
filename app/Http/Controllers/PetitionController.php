<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Data\PetitionData;
use App\Http\Requests\StorePetitionRequest;
//use App\Models\Petition;

class PetitionController extends Controller
{
    // USER: crear petición
    public function create()
    {
        return Inertia::render('User/Petitions/Create');
    }

    public function store(StorePetitionRequest $request)
    {
        // Crear DTO desde datos validados
        $dto = PetitionData::from($request->validated());

        Petition::create([
            'user_id' => $request->user()->id,
            'title' => $dto->title,
            'reason' => $dto->reason,
            'status' => 'pending',
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Petición enviada correctamente.');
    }

    // ADMIN: listar y revisar
    public function adminIndex()
    {
        return Inertia::render('Admin/Petitions/Index', [
            'petitions' => Petition::latest()->get(),
        ]);
    }

    public function approve(Petition $petition, Request $request)
    {
        $petition->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Petición aprobada.');
    }

    public function reject(Petition $petition, Request $request)
    {
        $petition->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Petición rechazada.');
    }
}


