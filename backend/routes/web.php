<?php

use Illuminate\Support\Facades\Route;

// The React app is served separately; this is just a health message for the API host.
Route::get('/', function () {
    return response()->json(['app' => 'Sujhav Peti API', 'status' => 'ok']);
});