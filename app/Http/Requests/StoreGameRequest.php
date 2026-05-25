<?php

namespace App\Http\Requests;

use App\Data\GameData;
use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // la ruta ya está protegida con role:admin
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'is_open' => ['nullable', 'boolean'],
            'cover' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function dto(): GameData
    {
        $validated = $this->validated();

        return GameData::from([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'cover_path' => null, // se resuelve en el controller tras subir el archivo
            'is_open' => (bool) ($validated['is_open'] ?? true),
            'created_by' => $this->user()->id,
        ]);
    }
}
