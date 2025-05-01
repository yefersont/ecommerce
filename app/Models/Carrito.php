<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Carrito
 * 
 * @property int $idCarrito
 * @property int $Productos_idProducts
 * @property int $Cantidad
 * @property int $Usuarios_idUsuarios
 * 
 * @property Product $product
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Carrito extends Model
{
	protected $table = 'carrito';
	protected $primaryKey = 'idCarrito';
	public $timestamps = false;

	protected $casts = [
		'Productos_idProducts' => 'int',
		'Cantidad' => 'int',
		'Usuarios_idUsuarios' => 'int'
	];

	protected $fillable = [
		'Productos_idProducts',
		'Cantidad',
		'Usuarios_idUsuarios'
	];

	public function product()
	{
		return $this->belongsTo(Product::class, 'Productos_idProducts');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'Usuarios_idUsuarios');
	}
}
