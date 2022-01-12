import $ from "jquery";

$(document).ready(function () {

    $('#newInboxSave').click(function () {
        let inboxName = $('#newInboxName').val();
        $.ajax({
            type: "POST",
            url: "/inbox",
            data: {'title' : inboxName},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $('#inboxNavigation').append(`
                <li class="nav-item">
                    <a class="nav-link @once active @endonce update-inbox" href="#" data-inbox-id="${data.inboxId}">${data.inboxTitle}</a>
                </li>
                `);
                // TODO: fix this
                $('#newInbox').Modal('hide');
            },
            error: function(data) {
                console.log(100);
            }
        });

    });
    // $.when(loadFolders()).done(function(returnData){
        //console.log(returnData);
    // });
    loadFolders();
    function loadFolders() {
        $.ajax({
            type: "GET",
            url: "/folder",
            data: {'title' : 'test'},
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                data = JSON.parse(data);
                console.log(data);
                console.log("test");
                // https://github.com/chniter/bstreeview/issues/21
                $('#folderTree').bstreeview({
                    data: data
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    let listWithHandle = document.getElementById('test');
    Sortable.create(listWithHandle, {
        handle: '.my-handle',
        animation: 150,
        onEnd: function (/**Event*/evt) {
            var itemEl = evt.item;  // dragged HTMLElement
            console.log(evt.to);    // target list
            console.log(evt.from);  // previous list
            console.log("old index:" + evt.oldIndex);  // element's old index within old parent
            console.log("new index: " + evt.newIndex);  // element's new index within new parent
            console.log("old draggable index: " + evt.oldDraggableIndex); // element's old index within old parent, only counting draggable elements
            console.log("new draggable index: " + evt.newDraggableIndex); // element's new index within new parent, only counting draggable elements
            console.log(evt.clone); // the clone element
            console.log("pullMode: " + evt.pullMode);  // when item is in another sortable: `"clone"` if cloning, `true` if moving
        },
    });

    $("#ppt").click(function () {
        $('.previewArea').hide();
        $('#powerpointPreview').show();
    });
    $("#pdf").click(function () {
        $('.previewArea').hide();
        $('#pdfPreview').show();
    });
    $("#txt").click(function () {
        $('.previewArea').hide();
        $('#documentPreview').show();
    });
    $("#img").click(function () {
        $('.previewArea').hide();
        $('#imagePreview').show();
    });
});
