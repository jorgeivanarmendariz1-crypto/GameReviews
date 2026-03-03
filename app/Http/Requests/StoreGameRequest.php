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
            'is_published' => ['required', 'boolean'],
            'cover' => ['nullable', 'image', 'max:2048'], // 2MB
            'is_open' => ['nullable', 'boolean']
        ];
    }

    public function dto(): GameData
    {
        $validated = $this->validated();

        return GameData::from([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_published' => (bool) $validated['is_published'],
            'cover' => $this->file('cover'),
            'is_open' => (bool) ($validated['is_open'] ?? false),
        ]);
    }
}
