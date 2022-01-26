<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Items;

class ItemsController extends Controller
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
        // TODO: Security check, if the user can save here
        return Items::create([
            'folder_id' => $request->folderId,
            'list_id' => $request->listId,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // TODO: Check if user has option to view this
        $items = Items::where('folder_id', $id)->where('is_archived', false)->get();
        foreach ($items as $item) {
            $item->content = strip_tags($item->content);
        }
        return $items;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $items = Items::where('id', $id)->with('category')->first();
        $d = $items->tags;
        $p = $items->file;
        return $items->toArray();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $item = Items::where('id', $id)->first();
        $item->content = $request->value;
        return $item->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function archive(Request $request) {
        $item = Items::find($request->id);
        $item->is_archived = !($item->is_archived);
        return $item->save();
    }

    /**
     * Update the favourite state of the element.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return boolean
     */
    public function favourite(Request $request) {
        $item = Items::find($request->id);
        $newValue = !($item->is_favourite);
        $item->is_favourite  = $newValue;
        $item->save();
        if($newValue)
            return 1;
        else
            return 0;
    }
}
