<?php

namespace App\Services;

class ReviewModerationService
{
    // Lista simple (luego la hacemos configurable)
    private array $banned = [
        // Básicos y variaciones
        'pendejo',
        'pendeja',
        'idiota',
        'mierda',
        'puta',
        'puto',
        'verga',
        'cabrón',
        'cabrona',
        'culero',
        'culera',

        // Sexuales o anatómicos
        'chingar',
        'chinga',
        'chinguen',
        'pendejada',
        'pene',
        'vagina',
        'valla al carajo',
        'orto',
        'ojete',
        'concha',
        'conchadesumadre',
        'maricón',
        'maricon',
        'joto',
        'pajero',
        'pajera',
        'perra',
        'zorra',
        'bastardo',

        // España / Otros
        'gilipollas',
        'capullo',
        'joder',
        'coño',
        'follar',
        'boludo',
        'pelotudo',
        'malparido',
        'gonorrea'
    ];
    public function isAllowed(string $text): bool
    {
        $lower = mb_strtolower($text);

        foreach ($this->banned as $word) {
            if (str_contains($lower, mb_strtolower($word))) {
                return false;
            }
        }

        return true;
    }
}
