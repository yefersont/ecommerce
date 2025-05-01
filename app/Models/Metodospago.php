<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Metodospago
 * 
 * @property int $idMetodosPago
 * @property string $Description
 * @property int|null $Tarjetas_idTarjetas
 * 
 * @property Tarjeta|null $tarjeta
 * @property Collection|Orden[] $ordens
 *
 * @package App\Models
 */
class Metodospago extends Model
{
	protected $table = 'metodospago';
	protected $primaryKey = 'idMetodosPago';
	public $timestamps = false;

	protected $casts = [
		'Tarjetas_idTarjetas' => 'int'
	];

	protected $fillable = [
		'Description',
		'Tarjetas_idTarjetas'
	];

	public function tarjeta()
	{
		return $this->belongsTo(Tarjeta::class, 'Tarjetas_idTarjetas');
	}

	public function ordens()
	{
		return $this->hasMany(Orden::class, 'MetodosPago_idMetodosPago');
	}
}
