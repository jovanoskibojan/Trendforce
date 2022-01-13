import $ from "jquery";
import {Dropzone} from "dropzone";

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
            }
        });

    });

    $('.inbox').click(function (){
        var myOffcanvas = document.getElementById('documentPreview2');
        var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        bsOffcanvas.show();
    });

    let folderData;
    $('body').on('click', '.nav-link', function() {
        $('.nav-link.active').removeClass('active');
        $(this).addClass('active');
        $('#folderWrapper').html('');
        $('#folderWrapper').append('<div id="folderTree"></div>');
        getFolders();
    });

    $('body').on('click', '#renameFolderSave', function() {
        let folderId = $(this).data('folder-ID');
        let newName = $('#renameFolderNewName').val();
        updateFolder(folderId, newName, 'title');
    });

    $('body').on('click', '#updateColorSave', function() {
        let folderId = $(this).data('folder-ID');
        let newColor = $('#updateColorNewName').val();
        updateFolder(folderId, newColor, 'color');
    });

    $('body').on('click', '.folder-node', function() {
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
    });

    $('body').on('click', '#renameInboxSave', function() {
        let inboxId = $(this).data('inbox-ID');
        let newName = $('#renameInboxNewName').val();
        $.ajax({
            type: "PUT",
            url: "/inbox/" + inboxId,
            data: {
                'value' : newName,
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                getFolders();
            },
            error: function(data) {
            }
        });
    });

    getFolders();
    function getFolders() {
        let inboxID = $('.nav-link.active').data('inbox-id')
        $.ajax({
            type: "GET",
            url: "/folder/" + inboxID,
            //data: {'title' : 'test'},
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                data = JSON.parse(data);
                folderData = data;
                // https://github.com/chniter/bstreeview/issues/21
                $('#folderTree').bstreeview({
                    data: data,
                    openNodeLinkOnNewTab: true
                });
            },
            error: function (data) {
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

    function updateFolder(folderId, value, update) {
        $.ajax({
            type: "PUT",
            url: "/folder/" + folderId,
            data: {
                'update' : update,
                'value' : value,
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                getFolders();
            },
            error: function(data) {
            }
        });
    }

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
