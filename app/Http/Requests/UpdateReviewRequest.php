<?php

namespace App\Http\Requests;

use App\Data\ReviewData;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'content' => ['sometimes', 'required', 'string', 'min:10', 'max:2000'],
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
