<?php

namespace App\Events;

use App\Models\Review;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * ReviewPosted
 *
 * Se dispara cuando un usuario publica una reseña nueva.
 * Se transmite en el canal público "game.{game_id}" para que
 * todos los visitantes de esa página la reciban en tiempo real.
 */
class ReviewPosted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Review $review)
    {
        // Cargamos la relación user para incluirla en el payload
        $this->review->load('user:id,name,email');
    }

    /**
     * Canal público por juego — cualquiera puede escucharlo sin autenticarse.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('game.' . $this->review->game_id);
    }

    /**
     * Nombre del evento que escucha el frontend.
     */
    public function broadcastAs(): string
    {
        return 'review.posted';
    }

    /**
     * Datos que se envían al frontend.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->review->id,
            'rating' => $this->review->rating,
            'content' => $this->review->content,
            'edit_count' => $this->review->edit_count,
            'user_id' => $this->review->user_id,
            'author' => $this->review->user?->name ?? $this->review->user?->email,
            'created_at' => $this->review->created_at->toISOString(),
        ];
    }
}
