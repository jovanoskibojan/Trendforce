<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\tag;

class Items extends Model
{
    use HasFactory;

    protected $fillable = [
        'folder_id',
        'list_id',
        'content',
    ];


    public function file() {
        return $this->hasMany(File::class, 'item_id');
    }
    public function tags() {
        return $this->belongsToMany(Tag::class, 'item_tag')->withTimestamps();
    }
}
