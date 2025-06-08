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
 * @property Carbon|null $Fecha
 * @property float $Total
 * @property int $MetodosPago_idMetodosPago
 * @property int|null $Tarjetas_idTarjetas
 * @property int $Status_idStatus
 * @property int $Datosenvio_idDatosenvio
 * 
 * @property Datosenvio $datosenvio
 * @property Metodospago $metodospago
 * @property Status $status
 * @property Tarjeta|null $tarjeta
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
		'Fecha' => 'datetime',
		'Total' => 'float',
		'MetodosPago_idMetodosPago' => 'int',
		'Tarjetas_idTarjetas' => 'int',
		'Status_idStatus' => 'int',
		'Datosenvio_idDatosenvio' => 'int'
	];

	protected $fillable = [
		'Fecha',
		'Total',
		'MetodosPago_idMetodosPago',
		'Tarjetas_idTarjetas',
		'Status_idStatus',
		'Datosenvio_idDatosenvio'
	];

	public function datosenvio()
	{
		return $this->belongsTo(Datosenvio::class, 'Datosenvio_idDatosenvio');
	}

	public function metodospago()
	{
		return $this->belongsTo(Metodospago::class, 'MetodosPago_idMetodosPago');
	}

	public function status()
	{
		return $this->belongsTo(Status::class, 'Status_idStatus');
	}

	public function tarjeta()
	{
		return $this->belongsTo(Tarjeta::class, 'Tarjetas_idTarjetas');
	}

	public function ordendetalles()
	{
		return $this->hasMany(Ordendetalle::class, 'Orden_id');
	}
}
