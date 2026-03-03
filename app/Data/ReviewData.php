<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ReviewData extends Data
{
    public function __construct(
        public int $game_id,
        public int $rating,
        public string $content,
    ) {
    }
}
