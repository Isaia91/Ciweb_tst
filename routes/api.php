<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::get('/ping', fn () => response()->json(['ok' => true]));


Route::get('/articles/export', [ArticleController::class, 'exportCsv']);
Route::apiResource('articles', ArticleController::class);


