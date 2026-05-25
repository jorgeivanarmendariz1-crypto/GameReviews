<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use App\Services\ReviewModerationService;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    use AuthorizesRequests;
    public function store(StoreReviewRequest $request, ReviewModerationService $moderation): RedirectResponse
    {
        $this->authorize('create', Review::class);

        $data = $request->dto();

        if (!$moderation->isAllowed($data->content)) {
            return back()->withErrors([
                'content' => 'Tu reseña fue rechazada por lenguaje ofensivo. Intenta reformularla.',
            ])->withInput();
        }

        try {
            Review::create([
                'user_id' => $request->user()->id,
                'game_id' => $data->game_id,
                'rating' => $data->rating,
                'content' => $data->content,
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors(['general' => 'No se pudo guardar la reseña. Intenta de nuevo.'])->withInput();
        }

        return redirect()->route('dashboard')->with('success', 'Reseña publicada con éxito.');
    }

    public function update(UpdateReviewRequest $request, Review $review, ReviewModerationService $moderation): RedirectResponse
    {
        // Solo el dueño puede editar
        $this->authorize('update', $review);

        // máximo 2 modificaciones
        if ($review->edit_count >= 2) {
            return back()->withErrors([
                'content' => 'Alcanzaste el máximo de 2 modificaciones para esta reseña.',
            ]);
        }

        $validated = $request->validated();
        $newContent = $validated['content'] ?? $review->content;

        if (!$moderation->isAllowed($newContent)) {
            return back()->withErrors([
                'content' => 'Tu edición fue rechazada por lenguaje ofensivo.',
            ])->withInput();
        }

        $review->update([
            'rating' => $validated['rating'] ?? $review->rating,
            'content' => $newContent,
            'edit_count' => $review->edit_count + 1,
        ]);

        return redirect()->route('dashboard')->with('success', 'Reseña actualizada.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);

        $review->delete();

        return redirect()->route('dashboard')->with('success', 'Reseña eliminada.');
    }
}
