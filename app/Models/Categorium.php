<?php

/**
 * Created by Reliese Model.
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categorium
 * 
 * @property int $idCategoria
 * @property string $Nombre
 * @property int $Status_idStatus
 * 
 * @property Status $status
 * @property Collection|Product[] $products
 *
 * @package App\Models
 */
class Categorium extends Model
{
	protected $table = 'categoria';
	protected $primaryKey = 'idCategoria';
	public $timestamps = false;

	protected $casts = [
		'Status_idStatus' => 'int'
	];

	protected $fillable = [
		'Nombre',
		'Status_idStatus'
	];

	public function status()
	{
		return $this->belongsTo(Status::class, 'Status_idStatus');
	}

	public function products()
	{
		return $this->hasMany(Product::class, 'Categoria_idCategoria');
	}
}
