<x-app-layout>
    <div class="inboxNav">
        <ul id="inboxNavigation" class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#" data-bs-toggle="modal" data-bs-target="#newInbox">New</a>
            </li>
                @foreach($inboxes as $inbox)
                <li class="nav-item">
                    <a class="nav-link @once active @endonce update-inbox" href="#" data-inbox-id="{{ $inbox->id }}">{{ $inbox->title }}</a>
                </li>
                @endforeach
        </ul>
    </div>
    <div class="container-fluid" >
        <div class="row">
            <div id="folderNavigation" class="">
                <div>
                    <div id="folderWrapper">
                        <div id="folderTree"></div>
                    </div>
                </div>
            </div>
            <div id="mainContent" class="">
                <div id="test" class="row justify-content-center" style="">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                        <div class="row mt-3">
                            <div class="col-9">
                                <div class="input-group mb-3">
                                    <input id="searchInput" type="text" class="form-control" placeholder="Type to search" aria-label="Type to search" aria-describedby="basic-addon2">
                                    <span id="inboxSearch" class="input-group-text" >
                                            Search options
                                            <div id="searchOptionWrapper">
                                                <div id="searchOptions">
                                                    <form>
                                                        <input id="searchInbox" type="radio" name="search" value="inbox_id" checked> <label for="searchInbox">Search complete inbox</label><br>
                                                        <input id="searchFolder" type="radio" name="search" value="folder_id"> <label for="searchFolder">Search selected folder</label>
                                                    </form>
                                                </div>
                                            </div>
                                    </span>
                                </div>
                            </div>
                            <div class="col-3">
                                <button id="newList" type="button" class="btn btn-primary">New list</button>
                                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">

                                    <div class="btn-group" role="group">
                                        <button id="btnGroupDrop10" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            Options
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                            <li><a id="showFavourites" class="dropdown-item" href="#">Show favourites</a></li>
                                            <li><a id="showArchived" class="dropdown-item" href="#">Show archived</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div id="allLists">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- New inbox -->
    <div class="modal fade" id="newInbox" tabindex="-1" aria-labelledby="newInbox" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">New inbox</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input id="newInboxName" type="text" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="newInboxSave" data-cardID="">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Rename folder -->
    <div class="modal fade" id="renameFolder" tabindex="-1" aria-labelledby="renameFolder" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">Rename <span id="renameFolderNameTitle"></span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input id="renameFolderNewName" type="text" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="renameFolderSave" data-folder-ID="">Save changes</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Delete item folder -->
    <div class="modal fade" id="deleteItem" tabindex="-1" aria-labelledby="renameFolder" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">Delete element</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you wish to remove this item? This will also permanetly delete all uploaded files related to it!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" id="deleteElement" data-item-ID="">Delete element</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Rename inbox -->
    <div class="modal fade" id="renameInbox" tabindex="-1" aria-labelledby="renameInbox" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">Rename <span id="renameInboxNameTitle"></span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input id="renameInboxNewName" type="text" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="renameInboxSave" data-inbox-ID="">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Update folder color -->
    <div class="modal fade" id="updateColor" tabindex="-1" aria-labelledby="updateColor" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">Update color of <span id="updateColorNameTitle"></span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <select id="updateColorNewName" type="text" class="form-control">
                        <option value="black">Black</option>
                        <option value="blue">Blue</option>
                        <option value="indigo">Indigo</option>
                        <option value="purple">Purple</option>
                        <option value="pink">Pink</option>
                        <option value="red">Red</option>
                        <option value="orange">Orange</option>
                        <option value="yellow">Yellow</option>
                        <option value="green">Green</option>
                        <option value="teal">Teal</option>
                        <option value="cyan">Cyan</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="updateColorSave" data-folder-ID="">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Item preview -->
    @include('item-preview')

    <!-- File preview-->
    <div id="filePreview" class="fileModal" style="display: none">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span id="filePrevewTitle"></span>
                <span id="closeFilePreview">&times;</span>
            </div>
            <div id="fileModalPreview"></div>
            <a id="downloadFileButton" class="btn btn-success" href="#" role="button">Download</a>
            <button id="closeFilePreviewButton" type="button" class="btn btn-primary">Close</button>
        </div>
    </div>

    <ul id="custom-menu-folder" class='custom-menu' style="z-index: 99999999;">
        <li data-action="new"><i class="bi bi-folder-plus"></i> New</li>
        <li data-action="rename"><i class="bi bi-pencil"></i> Rename</li>
        <li data-action="color"><i class="bi bi-palette"></i> Color</li>
        <li data-action="delete"><i class="bi bi-trash"></i> Delete</li>
    </ul>
    <ul id='custom-menu-inbox' class="custom-menu" style="z-index: 99999999;">
        <li data-action="rename"><i class="bi bi-pencil"></i> Rename</li>
        <li data-action="delete"><i class="bi bi-trash"></i> Delete</li>
    </ul>
    @include('item-right-click');

</x-app-layout>
