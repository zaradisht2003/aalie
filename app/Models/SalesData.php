<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesData extends Model
{
    protected $table="sales_data";
    protected $fillable = [
        'product_name',
        'q1_sales',
        'q2_sales',
        'q3_sales',
        'q4_sales',
        'target',
    ];
    public $timestamps=true;
}
