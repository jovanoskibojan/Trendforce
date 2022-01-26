<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Categories
        </h2>
    </x-slot>
    <div class="container" >
        <div class="row">
            <div class="accordion mt-5" id="allInboxes">
                @foreach($inboxes as $inbox)
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="accordion-{{ $inbox->id }}">
                            <button class="accordion-button collapsed accordion-categories" type="button" data-inbox-id="{{ $inbox->id }}" data-bs-toggle="collapse" data-bs-target="#accordion-collapse-{{ $inbox->id }}" aria-expanded="false" aria-controls="accordion-collapse-{{ $inbox->id }}">
                                {{ $inbox->title }} (<span class="mx-1">{{ $inbox->category->count() }}</span> {{ ($inbox->category->count() == 1) ? ' Category ' : ' Categories ' }})
                            </button>
                        </h2>
                        <div id="accordion-collapse-{{ $inbox->id }}" data-inbox-id="{{ $inbox->id }}" class="accordion-collapse collapse" aria-labelledby="accordion-{{ $inbox->id }}" data-bs-parent="#allInboxes">
                            <div class="accordion-body">
                                <div>
                                    <input id="" type="text" class="form-control mb-3 newCategory" placeholder="New category">
                                    @foreach($inbox->category as $category)
                                        <span class="badge rounded-pill bg-secondary"><span class="showCategoryItems" data-category-id="{{ $category->id }}">{{ $category->title }}</span> <i class="remove-category bi bi-x-circle-fill"></i></span>
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
    @include('item-preview')

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
