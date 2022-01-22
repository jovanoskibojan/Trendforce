<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function tag() {
        return $this->hasMany(Tag::class);
    }
}
