<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Tags
        </h2>
    </x-slot>
    <div class="container" >
        <div class="row">
            <div class="accordion mt-5" id="accordionExample">
                @foreach($inboxes as $inbox)
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="accordion-{{ $inbox->id }}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-collapse-{{ $inbox->id }}" aria-expanded="false" aria-controls="accordion-collapse-{{ $inbox->id }}">
                                {{ $inbox->title }} ({{ $inbox->tag->count() }} tags)
                            </button>
                        </h2>
                        <div id="accordion-collapse-{{ $inbox->id }}" class="accordion-collapse collapse" aria-labelledby="accordion-{{ $inbox->id }}" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <div>
                                    @foreach($inbox->tag as $tag)
                                        <span class="badge rounded-pill bg-secondary showTagItems" data-tag-id="{{ $tag->id }}">{{ $tag->title }} ({{ $tag->items->count() }} items)</span>
                                    @endforeach
                                </div>
                                <div class="itemTagsWrapper">
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Item preview -->
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="newListItem" aria-labelledby="documentPreviewLabel" style="min-width: 850px">
        <div class="offcanvas-header">
            <button id="updateItem" class="btn btn-success" >Save changes</button>
            <input type="hidden" id="selectedList">
            <h5 class="offcanvas-title" id="documentPreviewLabel">Colored with scrolling</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body mt-0">
            <div id="itemInfo">
                <form action="/fileUpload" class="dropzone" id="uploadField"></form>
                <div>
                    <div id="itemTags">
                        <input type="text" class="form-control" id="newTag" placeholder="New tag">
                        <div id="allTags">
                            <span class="badge rounded-pill bg-secondary">Secondary</span>
                        </div>
                    </div>
                    <select id="categorySelection" class="" name="categories[]" multiple="multiple">
                        <option value="AL" selected>Alabama</option>
                        <option value="AL">Alabama</option>
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>
            </div>
            <div id="filesPreview"></div>
            <textarea id="itemEditor" style="width: 100%"></textarea>
        </div>
    </div>

    <!-- File preview-->
    <div id="filePreview" class="modal">

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
</x-app-layout>
