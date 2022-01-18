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
                            <div class="col-3">
                                <button id="newList" type="button" class="btn btn-primary">New list</button>
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
                        <option value="bg-primary text-white">Blue</option>
                        <option value="bg-secondary text-white">Gray</option>
                        <option value="bg-success text-white">Green</option>
                        <option value="bg-danger text-white">Red</option>
                        <option value="bg-warning text-dark">Yellow</option>
                        <option value="bg-info text-dark">Cyan</option>
                        <option value="bg-light text-dark" selected>White</option>
                        <option value="bg-dark text-white">Black</option>
                    </select>
                    <span id="colorExample" class="p-2 my-2 d-block rounded-3 text-center bg-light text-dark">Example</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="updateColorSave" data-folder-ID="">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- File preview -->
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="newListItem" aria-labelledby="documentPreviewLabel" style="min-width: 850px">
        <div class="offcanvas-header">
            <a id="updateItem" href="#" class="btn btn-success" download="">Save changes</a>
            <input type="hidden" id="selectedList">
            <h5 class="offcanvas-title" id="documentPreviewLabel">Colored with scrolling</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body mt-0">
            <form action="/fileUpload" class="dropzone" id="uploadField"></form>
            <textarea id="itemEditor" style="width: 100%"></textarea>
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

</x-app-layout>
