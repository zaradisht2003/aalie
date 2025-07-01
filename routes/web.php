<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalesController;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/dashboard', function () {
    return view('app');
});
Route::get('/api/sales-data', [SalesController::class, 'get_all_sales']);
Route::post('/api/sales-data', [SalesController::class, 'create_new_sale']);
Route::put('/api/sales-data/{id}', [SalesController::class, 'update_record']);
Route::delete('/api/sales-data/{id}', [SalesController::class, 'delete_record']);