<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Orden
 * 
 * @property int $idOrden
 * @property int $Usuarios_idUsuarios
 * @property Carbon|null $Fecha
 * @property float $Total
 * @property int $MetodosPago_idMetodosPago
 * @property int $Status_idStatus
 * 
 * @property Usuario $usuario
 * @property Metodospago $metodospago
 * @property Status $status
 * @property Collection|Ordendetalle[] $ordendetalles
 *
 * @package App\Models
 */
class Orden extends Model
{
	protected $table = 'orden';
	protected $primaryKey = 'idOrden';
	public $timestamps = false;

	protected $casts = [
		'Usuarios_idUsuarios' => 'int',
		'Fecha' => 'datetime',
		'Total' => 'float',
		'MetodosPago_idMetodosPago' => 'int',
		'Status_idStatus' => 'int'
	];

	protected $fillable = [
		'Usuarios_idUsuarios',
		'Fecha',
		'Total',
		'MetodosPago_idMetodosPago',
		'Status_idStatus'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'Usuarios_idUsuarios');
	}

	public function metodospago()
	{
		return $this->belongsTo(Metodospago::class, 'MetodosPago_idMetodosPago');
	}
	public function tarjeta()
	{
		return $this->belongsTo(Tarjeta::class, 'Tarjetas_idTarjetas');
	}

	public function status()
	{
		return $this->belongsTo(Status::class, 'Status_idStatus');
	}

	public function ordendetalles()
	{
		return $this->hasMany(Ordendetalle::class, 'Orden_id');
	}
}
