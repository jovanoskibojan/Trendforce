<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'inbox_id',
    ];

    public function inbox() {
        return $this->belongsTo(Inbox::class);
    }
}
