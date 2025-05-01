<?php

use App\Http\Controllers\CategoriaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas Productos

Route::get('/productos', [ProductoController::class, 'index']); 
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::delete('/productos/{producto}', [ProductoController::class , 'destroy']);
Route::post('/productos', [ProductoController::class,'store']);
Route::put('/productos/{id}', [ProductoController::class,'update']);


// Rutas categorias

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}/productos', [ProductoController::class, 'porCategoria']);

// Route::get('/categorias/{id}', [CategoriaController::class, 'show']);