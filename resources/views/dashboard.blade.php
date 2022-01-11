<x-app-layout>
    <div class="inbox">
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
            <div class="col-2">
                <div>
                    <div id="folderTree"></div>
                </div>
            </div>
            <div class="col-7">
                <div id="test" class="row justify-content-center">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div class="card-wrapper" draggable="false">
                        <div class="card inbox" id="ppt">
                            <div class="card-header tooltipSelector" style="background-color: #f7f7f7"><i class="bi bi-arrows-move my-handle"></i> <span>Powerpoint</span></div>
                            <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                <i class="bi bi-file-earmark-ppt-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-wrapper" draggable="false">
                        <div class="card inbox" id="pdf">
                            <div class="card-header" style="background-color: #f7f7f7"><i class="bi bi-arrows-move my-handle"></i> <span>PDF Document</span></div>
                            <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                <i class="bi bi-file-earmark-pdf"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-wrapper" draggable="false">
                        <div class="card inbox" id="txt">
                            <div class="card-header" style="background-color: #f7f7f7"><i class="bi bi-arrows-move my-handle"></i> <span>Text file</span></div>
                            <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                <i class="bi bi-file-richtext-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-wrapper" draggable="false">
                        <div class="card inbox" id="img">
                            <div class="card-header" style="background-color: #f7f7f7"><i class="bi bi-arrows-move my-handle"></i> <span>Imaged</span></div>
                            <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                <i class="bi bi-card-image"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div style="display: none" class="previewArea" id="imagePreview">
                    <img src="{{ url('/', 'files').'/image.jpg' }}">
                </div>
                <div style="display: none" class="previewArea" id="powerpointPreview">
                    <iframe src='https://view.officeapps.live.com/op/view.aspx?src={{ url('/', 'files').'/Presentation.pptx' }}' width='100%' height='600px' frameborder='0'></iframe>
                </div>
                <div style="display: none" class="previewArea" id="pdfPreview">
                    <embed src="{{ url('/', 'files').'/document.pdf' }}" style="" width="100%" height="100%" type="application/pdf">
                </div>
                <div style="display: none" class="previewArea" id="documentPreview">
                    <textarea id="sample"></textarea>
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
</x-app-layout>
