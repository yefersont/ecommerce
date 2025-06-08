<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ciudade
 * 
 * @property int $idCiudades
 * @property int $departamento_id
 * @property int $codigo
 * @property string $nombre
 * 
 * @property Departamento $departamento
 * @property Collection|Datosenvio[] $datosenvios
 *
 * @package App\Models
 */
class Ciudade extends Model
{
	protected $table = 'ciudades';
	protected $primaryKey = 'idCiudades';
	public $timestamps = false;

	protected $casts = [
		'departamento_id' => 'int',
		'codigo' => 'int'
	];

	protected $fillable = [
		'departamento_id',
		'codigo',
		'nombre'
	];

	public function departamento()
	{
		return $this->belongsTo(Departamento::class);
	}

	public function datosenvios()
	{
		return $this->hasMany(Datosenvio::class, 'Ciudades_idCiudades');
	}
}
