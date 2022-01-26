<div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="newListItem" aria-labelledby="documentPreviewLabel" style="min-width: 850px">
    <div class="offcanvas-header">
        <button id="updateItem" class="btn btn-success" >Save changes</button>
        <input type="hidden" id="selectedItem">
        <h5 class="offcanvas-title" id="documentPreviewLabel">Update item</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body mt-0">
        <div id="itemInfo">
            <form action="/fileUpload" class="dropzone" id="uploadField"></form>
            <div>
                <div id="itemTags">
                    <input type="text" class="form-control" id="newTag" placeholder="New tag">
                    <div id="allTags">
                    </div>
                </div>
                <select id="categorySelection" class="" name="categories[]" multiple="multiple">
                </select>
            </div>
        </div>
        <div id="filesPreview"></div>
        <textarea id="itemEditor" style="width: 100%"></textarea>
    </div>
</div>
