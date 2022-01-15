<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function getAll(Request $request) {

        if(!is_numeric($request->folder_id)) {
            return;
        }

        $files = File::where('folder_id', $request->folder_id)->orderBy('order')->get(['id', 'file_name', 'type', 'title']);
        return json_encode($files);
    }
    public function get(Request $request) {

    }

    public function folderReorder(Request $request) {
        if(!is_numeric($request->movedId)) {
            return;
        }
        if(!is_numeric($request->movedId)) {
            return;
        }
        $movedTo = File::where('id', $request->prevElement)->first(['id', 'order']);
        $movedElement = File::where('id', $request->movedId)->first(['id', 'order']);
        $sql = 'update files set `order` = `order` + 1 where (folder_id = ' . $request->folderId . ' AND `order` > ' . $movedTo->order . ')';

        DB::statement($sql);
        if($request->newIndex == 0) {
            $movedElement->order = (1);
        }
        else {
            $movedElement->order = ($movedTo->order + 1);
        }
        $movedElement->save();
        //
//        $movedElementOrder = $movedElement->order;
//        $movedToOrder = $movedTo->order;
//
//        $movedElement->order = $movedToOrder;
//        $movedElement->save();
//        $movedTo->order = $movedElementOrder;
//        $movedTo->save();
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!is_numeric($request->folder_id)) {
            return response('Folder not selected, file not uploaded', 500)
                ->header('Content-Type', 'text/plain');
        }

        $previousFile = $files = File::where('folder_id', $request->folder_id)->orderBy('order', 'DESC')->first(['id', 'order']);
        if(is_null($previousFile)) {
            $lastInsert = 0;
        }
        else {
            $lastInsert = $previousFile->order;
            $lastInsert++;
        }
        $fileName = hash('sha256', microtime()) . '.'. $request->file->extension();
        $originalName = $request->file->getClientOriginalName();

        $type = $request->file->getClientMimeType();
        $size = $request->file->getSize();

        $request->file->move(public_path('files'), $fileName);

        return File::create([
            'folder_id' => $request->folder_id,
            'title' => $fileName,
            'file_name' => $originalName,
            'order' => $lastInsert,
            'type' => $type,
            'content' => '',
            'size' => $size,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\File  $file
     * @return \Illuminate\Http\Response
     */
    public function show(File $file)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\File  $file
     * @return \Illuminate\Http\Response
     */
    public function edit(File $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\File  $file
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, File $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\File  $file
     * @return \Illuminate\Http\Response
     */
    public function destroy(File $file)
    {
        //
    }
}
