<?php

namespace App\Events;

use App\Models\Review;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReviewDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $reviewId;
    public int $gameId;

    public function __construct(Review $review)
    {
        // Guardamos los IDs antes de que el modelo sea eliminado
        $this->reviewId = $review->id;
        $this->gameId = $review->game_id;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('game.' . $this->gameId);
    }

    public function broadcastAs(): string
    {
        return 'review.deleted';
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->reviewId];
    }
}
