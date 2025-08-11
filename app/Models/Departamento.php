<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Departamento
 * 
 * @property int $idDepartamentos
 * @property string $nombre
 * @property int $codigo
 * 
 * @property Collection|Ciudade[] $ciudades
 * @property Collection|Datosenvio[] $datosenvios
 *
 * @package App\Models
 */
class Departamento extends Model
{
	protected $table = 'departamentos';
	protected $primaryKey = 'idDepartamentos';
	public $timestamps = false;

	protected $casts = [
		'codigo' => 'int'
	];

	protected $fillable = [
		'nombre',
		'codigo'
	];

	public function ciudades()
	{
		return $this->hasMany(Ciudade::class, 'Ciudades_idCiudades');
	}

	public function datosenvios()
	{
		return $this->hasMany(Datosenvio::class, 'Departamentos_idDepartamentos');
	}
}
