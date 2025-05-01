<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Ordendetalle
 * 
 * @property int $idOrdenDetalle
 * @property int $Orden_id
 * @property int $Producto_id
 * @property int $Cantidad
 * @property float $PrecioUnitario
 * 
 * @property Orden $orden
 * @property Product $product
 *
 * @package App\Models
 */
class Ordendetalle extends Model
{
	protected $table = 'ordendetalle';
	protected $primaryKey = 'idOrdenDetalle';
	public $timestamps = false;

	protected $casts = [
		'Orden_id' => 'int',
		'Producto_id' => 'int',
		'Cantidad' => 'int',
		'PrecioUnitario' => 'float'
	];

	protected $fillable = [
		'Orden_id',
		'Producto_id',
		'Cantidad',
		'PrecioUnitario'
	];

	public function orden()
	{
		return $this->belongsTo(Orden::class, 'Orden_id');
	}

	public function product()
	{
		return $this->belongsTo(Product::class, 'Producto_id');
	}
}
