<?php

namespace App\Http\Requests;

use App\Data\ReviewData;
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
            'game_id' => ['required', 'integer', 'exists:games,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'content' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function dto(): ReviewData
    {
        return ReviewData::from($this->validated());
    }
}
