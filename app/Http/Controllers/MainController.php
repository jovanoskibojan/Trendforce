<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inbox;
use App\Models\Icon;
use App\Models\User;
use App\Models\Folder;

class MainController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware(['auth', 'verified']);
        $this->middleware(['auth']);
        //dd($user);
        //$user->email_verified_at = date('Y-m-d H:i:s');;
        //$user->save();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
//        $icons = Icon::get();
//        return view('home')->with(['icons' => $icons]);
        // TODO: Fix this shit
        $user = auth()->user();
        $user->email_verified_at = date('Y-m-d H:i:s');;
        $user->save();
        if(!$user->inbox->isNotEmpty()) {
            $inbox = new inbox;
            $inbox->user_id = $user->id;
            $inbox->title = 'Untitled';
            $inbox->save();

            $folder = new folder;
            $folder->inbox_id = $inbox->id;
            $folder->title = $inbox->title;
            $folder->child_of = 0;
            $folder->save();

        }
        $user = User::where('id', $user->id)->first();
        $folderTree = '[';
        foreach ($user->inbox[0]->folder as $folder) {
            $folderTree .= '  { text: "' . $folder->title . '", id: "folder-' . $folder->id . '", icon: "bi bi-folder", class: \'selectableFolder\' },';
        }
        $folderTree .= ']';
        return view('dashboard')->with('inboxes', $user->inbox)->with('folders', $folderTree);
    }
}
