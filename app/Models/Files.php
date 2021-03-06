<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'title',
        'file_name',
        'type',
        'size',
    ];

    public function item() {
        return $this->belongsTo(Items::class);
    }
}
