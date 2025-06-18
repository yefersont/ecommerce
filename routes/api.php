<?php

use App\Http\Controllers\CategoriaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\CiudadesController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\CheckTokenExpiry;
use App\Models\Usuario;
use App\Http\Controllers\MetodoPagoController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\TarjetaController;
use App\Http\Controllers\DatosenvioController;
use App\Http\Controllers\OrdenController;
use App\Http\Controllers\OrdenDetalleController;

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


Route::post('/register', [UsuarioController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);


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
    Route::get('/metodospago',  [MetodoPagoController::class, 'index']);
    // Departamentos
    Route::get('/departamentos', [DepartamentoController::class, 'index']);
    // Ciudad por departamento
    Route::get('/departamentos/{id}/ciudades', [CiudadesController::class, 'porDepartamento']);
    // Tarjeta por usuario
    Route::post('/tarjetas', [TarjetaController::class, 'store']);

    Route::get('/tarjetas/{id}', [TarjetaController::class, 'TarjetaPorUsuario']);
    // orden de compra
    Route::post('/ordencompra', [OrdenController::class, 'store']);
    // Datos de envio
    Route::post('/datosenvio', [DatosenvioController::class, 'store']);
    // Orden de compra
    Route::post('/ordendetalle', [OrdenDetalleController::class, 'store']);
});
Route::get('/ordenes/usuario/{idUsuario}', [OrdenController::class, 'OrdenPorUsuario']);
