<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Comentario
 * 
 * @property int $idComentario
 * @property string $Comentario
 * @property int $Usuarios_idUsuarios
 * @property int $Producto_idProducto
 * 
 * @property Product $product
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Comentario extends Model
{
	protected $table = 'comentarios';
	protected $primaryKey = 'idComentario';
	public $timestamps = false;

	protected $casts = [
		'Usuarios_idUsuarios' => 'int',
		'Producto_idProducto' => 'int'
	];

	protected $fillable = [
		'Comentario',
		'Usuarios_idUsuarios',
		'Producto_idProducto'
	];

	public function product()
	{
		return $this->belongsTo(Product::class, 'Producto_idProducto');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'Usuarios_idUsuarios');
	}
}
