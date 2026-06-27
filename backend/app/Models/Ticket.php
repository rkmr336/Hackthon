<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToTenant;

class Ticket extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'organization_id',
        'requester_id',
        'assignee_id',
        'subject',
        'description',
        'status',
        'priority',
    ];

    protected static function booted()
    {
        static::creating(function ($ticket) {
            if (auth()->check() && empty($ticket->organization_id)) {
                $ticket->organization_id = auth()->user()->organization_id;
            }
        });
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
