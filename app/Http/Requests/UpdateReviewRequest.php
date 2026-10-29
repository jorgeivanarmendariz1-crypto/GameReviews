<?php

namespace App\Http\Requests;

use App\Data\ReviewData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:10'],
            'content' => ['sometimes', 'required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * Validaciones que dependen del modelo de la ruta y no de un campo del body.
     * Se ejecutan después de rules(), dentro del mismo ciclo de validación.
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $review = $this->route('review');

                if ($review && ! $review->game()->where('is_open', true)->exists()) {
                    $validator->errors()->add(
                        'game_id',
                        'Este juego está cerrado y sus reseñas ya no se pueden editar.'
                    );
                }
            },
        ];
    }

    public function dto(int $gameId): ReviewData
    {
        // game_id viene por ruta, no del body
        return new ReviewData(
            game_id: $gameId,
            rating: (int) ($this->validated()['rating'] ?? 0),
            content: (string) ($this->validated()['content'] ?? ''),
        );
    }
}
