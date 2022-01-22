<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use phpDocumentor\Reflection\DocBlock\Tag;

class Inbox extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function folder() {
        return $this->hasMany(Folder::class);
    }
    public function tags() {
        return $this->hasMany(Tags::class);
    }
}
