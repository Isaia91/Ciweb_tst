<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $fillable = [
        'nom', 'prix_ht', 'prix_achat', 'taux_tgc', 'famille_id'
    ];

    use HasFactory;
    protected $casts = [
        'prix_ht'    => 'decimal:2',
        'prix_achat' => 'decimal:2',
        'taux_tgc'   => 'decimal:2',
    ];

    public function famille(): BelongsTo
    {
        return $this->belongsTo(Famille::class);
    }
}

