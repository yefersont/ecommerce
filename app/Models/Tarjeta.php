<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarjeta
 * 
 * @property int $idTarjetas
 * @property string|null $Description
 * @property float|null $Saldo
 * 
 * @property Collection|Metodospago[] $metodospagos
 *
 * @package App\Models
 */
class Tarjeta extends Model
{
	protected $table = 'tarjetas';
	protected $primaryKey = 'idTarjetas';
	public $timestamps = false;

	protected $casts = [
		'Saldo' => 'float'
	];

	protected $fillable = [
		'Description',
		'Saldo'
	];

	public function metodospagos()
	{
		return $this->hasMany(Metodospago::class, 'Tarjetas_idTarjetas');
	}
}
