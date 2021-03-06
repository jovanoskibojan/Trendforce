<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Inbox;
use App\Models\Items;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
        return view('categories')->with('inboxes', $inboxes);
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
        return $newTag = Categories::create([
            'inbox_id' => $request->inbox_id,
            'title' => $request->category_title
        ]);
    }

    /**
     * Get categories for specific inbox.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Categories::where('inbox_id', $id)->get();
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
        $categories = Categories::where('id', $id)->first();
        $categories->item()->detach();
        return $categories->delete();
    }

    public function assign(Request $request)
    {
        $item = Items::where('id', $request->item)->first();
        $category = Categories::where('id', $request->category)->first();
        $item->category()->syncWithoutDetaching($category);
    }

    public function remove(Request $request)
    {
        $item = Items::where('id', $request->item)->first();
        $t = $item->category()->detach($request->category);
    }

    public function getItems(Request $request) {
        return Categories::with('item')->find($request->id);
    }
}
