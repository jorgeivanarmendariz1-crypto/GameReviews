<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class GameData extends Data
{
    public function __construct(
        public string $title,
        public ?string $description,
        public bool $is_published,
        public ?string $cover_path,
        public int $created_by,
        public bool $is_open = true
    ) {
    }
}
