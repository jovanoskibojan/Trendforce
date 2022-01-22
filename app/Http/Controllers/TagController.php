<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Items;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();
        $inboxes = Inbox::where('user_id', $user->id)->get();
        return view('tags')->with('inboxes', $inboxes);
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
        $item = Items::where('id', $request->items_id)->first();
        $createdTag = Tag::create([
            'items_id' => $request->items_id,
            'inbox_id' => $request->inbox_id,
            'title' => $request->tag
        ]);
        $item->tags()->syncWithoutDetaching($createdTag);
        return $createdTag;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Tags::where('id', $id)->delete();
    }

    public function getItems(Request $request) {
        $t = Tags::where('id', $request->id)->get();
        $t = Tags::with('item')->find($request->id);
        dd($t->items);
        return Tags::where('id', $request->id)->get();
    }
}
