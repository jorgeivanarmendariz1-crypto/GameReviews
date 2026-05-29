<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameRequest extends FormRequest
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
            // cover es opcional — si no se sube, se conserva la portada actual
            'cover' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
