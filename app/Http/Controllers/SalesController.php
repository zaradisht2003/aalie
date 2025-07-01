<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesData;
class SalesController extends Controller
{
    public function get_all_sales()
    {
        $sales = SalesData::all(); 
        return response()->json($sales); 
    }
    public function create_new_sale(Request $request)
{
    $new_record = $request->validate([
        'product_name' => 'required|string|max:255',
        'q1_sales' => 'required|numeric|min:0',
        'q2_sales' => 'required|numeric|min:0',
        'q3_sales' => 'required|numeric|min:0',
        'q4_sales' => 'required|numeric|min:0',
        'target' => 'required|numeric|min:0'
    ]);
    
    $record = SalesData::create($new_record);

    return response()->json([
        'message' => 'Record Created',
        'data' => $record
    ], 201); 
}
public function update_record(Request $request,$id)
{
    $new_record = $request->validate([
        'product_name' => 'sometimes|string|max:255',
        'q1_sales' => 'sometimes|numeric|min:0',
        'q2_sales' => 'sometimes|numeric|min:0',
        'q3_sales' => 'sometimes|numeric|min:0',
        'q4_sales' => 'sometimes|numeric|min:0',
        'target' => 'sometimes|numeric|min:0'
    ]);

    $record = SalesData::findOrFail($id);
    $record->update($new_record);

    return response()->json([
        'message' => 'Record updated successfully',
        'data' => $record
    ]);
}
public function delete_record($id)
{
    // Find and delete the record
    $record = SalesData::findOrFail($id);
    $record->delete();

    return response()->json([
        'message' => 'Record deleted successfully'
    ], 200);
}
}
