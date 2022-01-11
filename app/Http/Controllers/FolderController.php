<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $folderData = [ [
            'text' => "Root1",
            'id' => "folder-1",
            'icon' => "bi bi-folder",
            'class' => 'selectableFolder',
            'nodes' => [
                [
                    'id' => "folder-2",
                    'text' => "Presentations2",
                    'icon' => "bi bi-folder",
                    'class' => 'selectableFolder',
                    'nodes' => [
                        [
                            'id' => "folder-5",
                            'text' => "To review",
                            'icon' => "bi bi-folder",
                            'class' => 'selectableFolder',
                        ],
                        [
                            'id' => "folder-6",
                            'text' => "Completed",
                            'icon' => "bi bi-folder",
                            'class' => 'selectableFolder',
                        ],
                    ],
                ],
                [
                    'id' => "folder-3",
                    'text' => "PDF Documents",
                    'icon' => "bi bi-folder",
                    'class' => 'selectableFolder',
                ],
                [
                    'id'=> "folder-4",
                    'text' => "Other useful files",
                    'icon' => "bi bi-folder",
                    'class' => 'selectableFolder',
                ],
            ],
        ]];
/*
        global $data;
        global $folderData;
        global $counter;
        $data = Folder::where('inbox_id', '1')->orderBy('child_of')->get()->toArray();
        $folderData = [];
        $folderData[0]['id'] = $data[0]['id'];
        $folderData[0]['text'] = $data[0]['title'];
        $counter = 0;


        function createFolderTree($index = 0) {
            global $data;
            global $folderData;
            global $counter;
            for($i = $index; $i < count($data); $i++) {
//                if($counter == 0) {
//                    $folderData[$counter]['id'] = $data[$i]['id'];
//                    $folderData[$counter]['text'] = $data[$i]['title'];
//                }
//                else {
                    if($data[$counter]['id'] == $data[$i]['child_of']) {
                        $folderData[$counter]['nodes']['id'] = $data[$i]['id'];
                        $folderData[$counter]['nodes']['text'] = $data[$i]['title'];
                        createFolderTree($counter);
                    }
                    if($counter < count($data)) {
                        $counter++;
                    }
                //}
            }
        }

        createFolderTree(0);*/
          return json_encode($folderData);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function show(Folder $folder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Folder $folder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function destroy(Folder $folder)
    {
        //
    }
}
