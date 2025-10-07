<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'customer_name',
        'phone',
        'party_size',
        'reserved_at',
        'status',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
    ];
}
