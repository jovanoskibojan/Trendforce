<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lists extends Model
{
    use HasFactory;

    protected $fillable = [
        'inbox_id',
        'user_id',
        'title',
    ];

    public function item() {
        return $this->hasMany(Items::class, 'list_id');
    }
}
