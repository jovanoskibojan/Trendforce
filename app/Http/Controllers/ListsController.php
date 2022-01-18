<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Lists;
use Illuminate\Http\Request;

class ListsController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $title = 'Untitled list';
        $user = auth()->user();

        $inboxID = Inbox::where('id', $request->inbox_id)->first();

        if($inboxID->user_id != $user->id) {
            return response('Inbox does not belong to the user', 500)
                ->header('Content-Type', 'text/plain');
        }

        return Lists::create([
            'inbox_id' => $request->inbox_id,
            'user_id' => $user->id,
            'title' => $title,
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
        $user = auth()->user();
        return $lists = Lists::where('inbox_id', $id)->get();

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
     * @return mixed;
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $list = Lists::where('id', $id)->first();

        if($list->user_id != $user->id) {
            return response('List does not belong to the user', 500)
                ->header('Content-Type', 'text/plain');
        }

        $list->title = $request->title;
        $list->save();
        return true;
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
}
