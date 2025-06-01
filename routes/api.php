<?php

use App\Http\Controllers\CategoriaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\CheckTokenExpiry;
use App\Models\Usuario;
use App\Http\Controllers\MetodoPagoController;

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
// Login 

Route::middleware(['auth:sanctum', 'check.token.expiry'])->group(function () {


    Route::get('/user', fn(Request $request) => $request->user());
    // Productos


    Route::get('/productos/filtrar', [ProductoController::class, 'filtrar']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);
    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::put('/productos/{id}', [ProductoController::class, 'update']);
    // Categorias


    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}/productos', [ProductoController::class, 'porCategoria']);
    // Carrito de compras


    Route::post('/carrito', [CarritoController::class, 'store']);
    Route::get('/carrito/{idUsuario}', [CarritoController::class, 'ShowbyUser']);
    Route::delete('/carrito/{idUsuario}/vaciar', [CarritoController::class, 'vaciar']);
    Route::get('/carrito/{idUsuario}', [CarritoController::class, 'ShowbyUser']);
    Route::delete('/carrito/{idUsuario}/producto/{idProducto}', [CarritoController::class, 'eliminarProducto']);
    // Usuarios


    Route::get('/usuarios', [UsuarioController::class, 'index']);
    // Metodos de pago

});

Route::get('/metodospago',  [MetodoPagoController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
