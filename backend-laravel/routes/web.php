<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('{path?}', function () {
    return file_get_contents(public_path('index.html'));
})->where('path', '.*')->name('spa');
