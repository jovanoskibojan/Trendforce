<?php

namespace App\Http\Controllers;

use App\Models\Inbox;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Request;

class InboxController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        $user = auth()->user();
        if(empty($request->title)) {
            $request->title = 'Untitled';
        }
        $inbox = new Inbox();
        $inbox->user_id = $user->id;
        $inbox->title = $request->title;
        $inbox->save();
        $returnData = [
            'inboxId' => $inbox->id,
            'inboxTitle' => $request->title,
        ];

        $folder = new Folder();
        $folder->inbox_id = $inbox->id;
        $folder->title = $request->title;
        $folder->child_of = 0;
        $folder->save();

        // TODO: Remove email werificaiton
        $user->email_verified_at = date("m/d/Y h:i:s a", time());
        $user->save();

        $tmp = User::where('id', $user->id)->first();
        $tmp->email_verified_at = date("m/d/Y h:i:s a", time());
        $tmp->save();

        return json_encode($returnData);
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
            Inbox::where('id', $id)->update(['title' => $request->value]);
            Folder::where('inbox_id', $id)->where('child_of', 0)->update(['title' => $request->value]);
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
