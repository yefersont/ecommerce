<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Status
 * 
 * @property int $idStatus
 * @property string $Description
 * 
 * @property Collection|Categorium[] $categoria
 * @property Collection|Orden[] $ordens
 *
 * @package App\Models
 */
class Status extends Model
{
	protected $table = 'status';
	protected $primaryKey = 'idStatus';
	public $timestamps = false;

	protected $fillable = [
		'Description'
	];

	public function categoria()
	{
		return $this->hasMany(Categorium::class, 'Status_idStatus');
	}

	public function ordens()
	{
		return $this->hasMany(Orden::class, 'Status_idStatus');
	}
}
