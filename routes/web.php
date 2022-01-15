<?php

use App\Http\Controllers\FilesController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [App\Http\Controllers\MainController::class, 'index'])->name('home');

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::resource('inbox', 'App\Http\Controllers\InboxController');
Route::resource('folder', 'App\Http\Controllers\FolderController');
Route::get('fileUpload/getAll', [FilesController::class, 'getAll']);
Route::get('fileUpload/get', [FilesController::class, 'get']);
Route::post('fileUpload/reorder', [FilesController::class, 'folderReorder']);
Route::resource('fileUpload', 'App\Http\Controllers\FilesController');
