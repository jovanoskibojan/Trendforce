<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\TagController;
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
Route::resource('lists', 'App\Http\Controllers\ListsController');
Route::post('items/archive', [ItemsController::class, 'archive']);
Route::post('items/favourite', [ItemsController::class, 'favourite']);
Route::get('items/favourite/{id}', [ItemsController::class, 'getFavourite']);
Route::get('items/archived/{id}', [ItemsController::class, 'getArchived']);
Route::resource('items', 'App\Http\Controllers\ItemsController');
Route::get('tags/getItems', [TagController::class, 'getItems']);
Route::post('tags/detachTag', [TagController::class, 'detachTag']);
Route::resource('tags', 'App\Http\Controllers\TagController');
Route::post('categories/assign', [CategoryController::class, 'assign']);
Route::post('categories/remove', [CategoryController::class, 'remove']);
Route::get('categories/getItems', [CategoryController::class, 'getItems']);
Route::resource('categories', 'App\Http\Controllers\CategoryController');
