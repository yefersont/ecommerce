<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Datosenvio
 * 
 * @property int $idDatosEnvio
 * @property int $Usuarios_idUsuarios
 * @property int $Identificacion
 * @property string $Telefono
 * @property string $Correo
 * @property int $Departamentos_idDepartamentos
 * @property int $Ciudades_idCiudades
 * @property string $Direccion
 * @property string|null $DireccionAlternativa
 * @property string|null $CodigoPostal
 * @property string|null $Observaciones
 * 
 * @property Ciudade $ciudade
 * @property Departamento $departamento
 * @property Usuario $usuario
 * @property Collection|Orden[] $ordens
 *
 * @package App\Models
 */
class Datosenvio extends Model
{
	protected $table = 'datosenvio';
	protected $primaryKey = 'idDatosEnvio';
	public $timestamps = false;

	protected $casts = [
		'Usuarios_idUsuarios' => 'int',
		'Identificacion' => 'int',
		'Departamentos_idDepartamentos' => 'int',
		'Ciudades_idCiudades' => 'int'
	];

	protected $fillable = [
		'Usuarios_idUsuarios',
		'Identificacion',
		'Telefono',
		'Correo',
		'Departamentos_idDepartamentos',
		'Ciudades_idCiudades',
		'Direccion',
		'DireccionAlternativa',
		'CodigoPostal',
		'Observaciones'
	];

	public function ciudade()
	{
		return $this->belongsTo(Ciudade::class, 'Ciudades_idCiudades');
	}

	public function departamento()
	{
		return $this->belongsTo(Departamento::class, 'Departamentos_idDepartamentos');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'Usuarios_idUsuarios');
	}

	public function ordens()
	{
		return $this->hasMany(Orden::class, 'Datosenvio_idDatosenvio');
	}
}
