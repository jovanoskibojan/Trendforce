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
        'inbox_id',
        'order'
    ];


    public function file() {
        return $this->hasMany(File::class, 'item_id');
    }
    public function tags() {
        return $this->belongsToMany(Tag::class, 'item_tag')->withTimestamps();
    }
    public function category() {
        return $this->belongsToMany(Categories::class, 'category_item')->withTimestamps();
    }
    public function list() {
        return $this->belongsToMany(Lists::class);
    }
}
