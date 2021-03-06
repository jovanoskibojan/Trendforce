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
        $newTag = Tag::where('title', $request->tag)->first();
        if(is_null($newTag)) {
            $newTag = Tag::create([
                'items_id' => $request->items_id,
                'inbox_id' => $request->inbox_id,
                'title' => $request->tag
            ]);
        }
        else {
            if($newTag->inbox_id != $request->inbox_id) {
                $newTag = Tag::create([
                    'items_id' => $request->items_id,
                    'inbox_id' => $request->inbox_id,
                    'title' => $request->tag
                ]);
            }
        }
        $item->tags()->syncWithoutDetaching($newTag);
        return $newTag;
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
        return Tag::where('id', $id)->delete();
    }

    public function getItems(Request $request) {
        $t = Tag::with('items')->find($request->id);
        for($i = 0; $i < count($t->items); $i++) {
            $t->items[$i]->content = strip_tags($t->items[$i]->content);
        }
        return Tag::with('items')->find($request->id);
    }

    public function detachTag(Request $request) {
        $item = Items::where('id', $request->itemId)->first();
        return $item->tags()->detach($request->tagId);
    }
}
