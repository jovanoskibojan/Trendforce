<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $fillable = [
        'inbox_id',
        'title',
    ];

    public function inbox() {
        return $this->hasMany(Inbox::class);
    }
    public function item() {
        return $this->belongsToMany(Items::class, 'category_item')->withTimestamps();
    }
}
