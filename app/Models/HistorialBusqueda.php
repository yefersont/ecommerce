<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class HistorialBusqueda
 * 
 * @property int $id
 * @property int|null $usuario_id
 * @property string|null $termino_busqueda
 * @property Carbon $fecha
 * 
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class HistorialBusqueda extends Model
{
	protected $table = 'historial_busquedas';
	public $timestamps = false;

	protected $casts = [
		'usuario_id' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'usuario_id',
		'termino_busqueda',
		'fecha'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_id', 'idUsuarios');
	}
}
