<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        if (auth()->check() && auth()->user()->organization_id) {
            static::addGlobalScope('tenant', function (Builder $builder) {
                $builder->where('organization_id', auth()->user()->organization_id);
            });
        }
    }
}
