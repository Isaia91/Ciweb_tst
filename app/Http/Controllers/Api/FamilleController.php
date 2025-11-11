<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Famille;

class FamilleController extends Controller
{
    // GET /api/familles
    public function index()
    {
        // tri par nom + renvoie toutes les familles
        return response()->json(Famille::orderBy('nom')->get());
    }

    // GET /api/familles/{famille}
    public function show(Famille $famille)
    {
        return response()->json($famille);
    }
}
