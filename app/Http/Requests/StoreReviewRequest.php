<?php

namespace App\Http\Requests;

use App\Data\ReviewData;
use App\Models\Game;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'game_id' => [
                // bail: si el juego no existe, no evaluar la closure
                // (evita mostrar "no existe" y "cerrado" a la vez)
                'bail',
                'required',
                'integer',
                'exists:games,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    if (! Game::whereKey($value)->where('is_open', true)->exists()) {
                        $fail('Este juego está cerrado y ya no acepta reseñas.');
                    }
                },
            ],
            'rating' => ['required', 'integer', 'min:1', 'max:10'],
            'content' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function dto(): ReviewData
    {
        return ReviewData::from($this->validated());
    }

    public function messages(): array
    {
        return [
            'game_id.exists' => 'El juego no existe.',
        ];
    }
}
