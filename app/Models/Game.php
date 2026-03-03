<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    //
    protected $fillable = ['title', 'description', 'is_open', 'cover_path', 'is_published', 'created_by'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }


}


