<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Product
 * 
 * @property int $idProductos
 * @property string $Nombre
 * @property string|null $Descripcion
 * @property int $Categoria_idCategoria
 * @property float $Precio
 * @property int|null $Stock
 * @property string|null $Imagen
 * 
 * @property Categorium $categorium
 * @property Collection|Carrito[] $carritos
 * @property Collection|Ordendetalle[] $ordendetalles
 *
 * @package App\Models
 */
class Product extends Model
{
	protected $table = 'products';
	protected $primaryKey = 'idProductos';
	public $timestamps = false;

	protected $casts = [
		'Categoria_idCategoria' => 'int',
		'Precio' => 'float',
		'Stock' => 'int'
	];

	protected $fillable = [
		'Nombre',
		'Descripcion',
		'Categoria_idCategoria',
		'Precio',
		'Stock',
		'Imagen'
	];

	public function categorium()
	{
		return $this->belongsTo(Categorium::class, 'Categoria_idCategoria');
	}

	public function carritos()
	{
		return $this->hasMany(Carrito::class, 'Productos_idProducts');
	}

	public function ordendetalles()
	{
		return $this->hasMany(Ordendetalle::class, 'Producto_id');
	}
}
