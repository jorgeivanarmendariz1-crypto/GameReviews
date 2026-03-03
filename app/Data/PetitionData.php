<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PetitionData extends Data
{
    public function __construct(
        public string $title,
        public ?string $reason,
    ) {
    }
}
