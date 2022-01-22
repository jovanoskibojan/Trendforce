<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'items_id',
        'inbox_id',
        'title',
    ];

    public function items() {
        return $this->belongsToMany(Items::class)->withTimestamps();
    }
    public function Inbox() {
        return $this->belongsTo(Inbox::class);
    }
}
