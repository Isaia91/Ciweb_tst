<?php

use App\Http\Controllers\Api\FamilleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::get('/ping', fn () => response()->json(['ok' => true]));


Route::get('/articles/export', [ArticleController::class, 'exportCsv']);
Route::apiResource('articles', ArticleController::class);


Route::get('/familles', [FamilleController::class, 'index']);
Route::get('/familles/{famille}', [FamilleController::class, 'show']);
