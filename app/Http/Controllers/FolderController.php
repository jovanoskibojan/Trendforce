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
        // TODO: Add some security here
        $folder = new Folder;
        $folder->title = 'Untitled';
        $folder->inbox_id = $request->inbox_id;
        $folder->child_of = $request->id;
        $folder->save();
        echo 123;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Folder  $folder
     * @return \Illuminate\Http\Response
     */
    public function show(Folder $folder)
    {
        {
            $folderID = $folder->id;
            $data = Folder::where('inbox_id', $folderID)->orderBy('child_of')->get()->toArray();
            //dd($data);
            function getFolderData($data, $current_id = 0) {
                $folderData = [];
                $folderData[$current_id]['id'] = $data[$current_id]['id'];
                $folderData[$current_id]['text'] = $data[$current_id]['title'];
                $folderData[$current_id]['class'] = 'folder-node';
                for ($i = 0; $i < (count($data)); $i++) {
                    if($data[$current_id]['id'] == $data[$i]['child_of']) {
                        $tmp = getFolderData($data, $i);
                        $folderData[$current_id]['nodes'][] = $tmp;
                    }
                }
                $newEmpty = [];
                foreach ($folderData as $element) {
                    foreach ($element as $key => $value) {
                        $newEmpty[$key] = $value;
                    }
                }
                //dd($newEmpty);
                return $newEmpty;
                return $folderData;
            }
            $ee = getFolderData($data);
            //dd($ee, $folderData3);
            $test[] = $ee;
            return json_encode($test);
        }

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
        Folder::where('id', $folder->id)->update(['title'=>$request->title]);
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
