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
$('#test').show();
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
        let folderId = $(this).attr('id');
        $.ajax({
            type: "GET",
            url: 'fileUpload/getAll',
            data: {
                'folder_id' : folderId,
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let allFilesWrapper = $('#allFiles');
                let fileIcon;
                allFilesWrapper.html('');
                $.each(data, function(key,value) {
                    fileIcon = getFileIcon(value.type);
                    console.log(value.file_name);
                    allFilesWrapper.append(`
                        <div class="card-wrapper" draggable="false" id="${value.id}" data-file-name="${value.title}" data-file-type="${value.type}">
                            <div class="card inbox" id="">
                                <div class="card-header tooltipSelector" style="background-color: #f7f7f7"><i class="bi bi-arrows-move my-handle"></i> <span class="file-name">${value.file_name}</span></div>
                                <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                    <i class="bi bi-${fileIcon}"></i>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function(data) {
            }
        })
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

    let listWithHandle = document.getElementById('allFiles');
    Sortable.create(listWithHandle, {
        handle: '.my-handle',
        animation: 150,
        onEnd: function (/**Event*/evt) {
            let movedId = $('.card-wrapper').eq(evt.newDraggableIndex).attr('id');
            let folderId = $('.active.folder-node').attr('id');
            let prevElement;
            if(evt.newDraggableIndex == 0) {
                prevElement = $('.card-wrapper').eq(evt.newDraggableIndex).next().attr('id');
            }
            else {
                prevElement = $('.card-wrapper').eq(evt.newDraggableIndex).prev().attr('id');
            }
            console.log(prevElement);
            $.ajax({
                type: 'POST',
                url: '/fileUpload/reorder',
                data: {
                    'movedId' : movedId,
                    'folderId' : folderId,
                    'prevElement' : prevElement,
                    'newIndex' : evt.newDraggableIndex,
                },
                dataType: "json",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                },
                error: function(data) {
                }
                /*
                console.log(draggedElement, replacedElement);
            console.log(evt.to);    // target list
            console.log(evt.from);  // previous list
            console.log("old index:" + evt.oldIndex);  // element's old index within old parent
            console.log("new index: " + evt.newIndex);  // element's new index within new parent
            console.log("old draggable index: " + evt.oldDraggableIndex); // element's old index within old parent, only counting draggable elements
            console.log("new draggable index: " + evt.newDraggableIndex); // element's new index within new parent, only counting draggable elements
            console.log(evt.clone); // the clone element
            console.log("pullMode: " + evt.pullMode);  // when item is in another sortable: `"clone"` if cloning, `true` if moving
                 */
            });
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
    let myDropzone = new Dropzone("#uploadField", {
        url: "/fileUpload",
        method:"post",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        complete: function(file) {
            setTimeout(() => {
                this.removeFile(file); // right here after 3 seconds you can clear
            }, 3000);
            $('.folder-node.active').click();
        },
    });
    myDropzone.on("sending", function(file, xhr, formData) {
        let folderId = $('.folder-node.active').attr('id');
        formData.append("folder_id", folderId);
    });

    function getFileIcon(fileType) {
        if (fileType.indexOf('presentation') >= 0) {
            return 'file-earmark-ppt-fill';
        }
        else if (fileType.indexOf('pdf') >= 0) {
            return 'file-earmark-pdf';
        }
        else if (fileType.indexOf('customText') >= 0) {
            return 'file-richtext-fill';
        }
        else if (fileType.indexOf('image') >= 0) {
            return 'card-image';
        }
        else {
            return 'file-binary-fill';
        }
    }

    $('body').on('click', '.card-wrapper', function() {
        let docTitle = $(this).find('.file-name').first().html();
        let fileType = $(this).data('file-type');
        console.log(fileType);
        let fileName = $(this).data('file-name');
        let myOffcanvas = document.getElementById('documentPreview2')
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        $('#documentPreviewLabel').html(docTitle);
        $('.previewArea').hide();
        if (fileType.indexOf('presentation') >= 0) {
            $('#powerpointPreview iframe').attr('src', 'https://view.officeapps.live.com/op/view.aspx?src=http://trendforce.io/files/' + fileName);
            $('#powerpointPreview').show();
        }
        else if (fileType.indexOf('pdf') >= 0) {
            $('#pdfPreview embed').attr('src', 'http://trendforce.io/files/' + fileName);
            $('#pdfPreview').show();
        }
        else if (fileType.indexOf('customText') >= 0) {
            $('#documentPreview #sample').html('test');
            $('#documentPreview').show();
        }
        else if (fileType.indexOf('image') >= 0) {
            $('#imagePreview img').attr('src', 'http://trendforce.io/files/' + fileName);
            $('#imagePreview').show();
        }
        else {
            $('#noPreview').show();
        }
        $('#downloadDocument').attr('href', 'http://trendforce.io/files/' + fileName);
        $('#downloadDocument').attr('download', docTitle);
        bsOffcanvas.show();
    });
});
