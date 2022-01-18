import $ from "jquery";
import {Dropzone} from "dropzone";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";

$(document).ready(function () {
    let itemEditor = (document.getElementById('itemEditor'));
    suneditor.create(itemEditor, {
        plugins: plugins,
        buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            '/', // Line break
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
            /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print'],
            /*['save', 'template']*/
        ]
    });
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
                    <a class="nav-link update-inbox" href="#" data-inbox-id="${data.inboxId}">${data.inboxTitle}</a>
                </li>
                `);
                // TODO: fix this
                $('#newInbox').Modal('hide');
            },
            error: function(data) {
            }
        });

    });

    // Opens offcanvas modal, should be deleted
    // $('.inbox').click(function (){
    //     var myOffcanvas = document.getElementById('documentPreview2');
    //     var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
    //     bsOffcanvas.show();
    // });

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
        $('.add-list-item').show();
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
        let selectedFolderId = $(this).attr('id');
        console.log('test');
        $.ajax({
            type: "GET",
            url: "/items/" + selectedFolderId,
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $('.list').empty();
                $.each(data, function (i, val) {
                    console.log(val.list_id);
                    $("div").find(`[data-list-id='${val.list_id}']`).find('div.list').append(`
                        <div class="card-wrapper" draggable="false" data-item-id="${val.id}">
                            <div class="card inbox">
                                <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                                    ${val.content}
                                </div>
                            </div>
                        </div>
                    `);
                });
                updateSortable();
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

    // let listWithHandle1 = document.getElementById('listOne');
    // let listWithHandle2 = document.getElementById('listTwo');

    // new Sortable(listWithHandle1, {
    //     group: {
    //         name: 'list',
    //     },
    //     animation: 150
    // });
    //
    // new Sortable(listWithHandle2, {
    //     group: {
    //         name: 'list',
    //     },
    //     onEnd: function (/**Event*/evt) {
    //         console.log(evt.to);    // target list
    //         console.log(evt.from);  // previous list
    //         console.log("old index:" + evt.oldIndex);  // element's old index within old parent
    //         console.log("new index: " + evt.newIndex);  // element's new index within new parent
    //         console.log("old draggable index: " + evt.oldDraggableIndex); // element's old index within old parent, only counting draggable elements
    //         console.log("new draggable index: " + evt.newDraggableIndex); // element's new index within new parent, only counting draggable elements
    //         console.log(evt.clone); // the clone element
    //         console.log("pullMode: " + evt.pullMode);
    //     },
    //     animation: 150
    // });


    // Sortable.create(listWithHandle, {
    //     handle: '.my-handle',
    //     animation: 150,
    //     onEnd: function (/**Event*/evt) {
    //         let movedId = $('.card-wrapper').eq(evt.newDraggableIndex).attr('id');
    //         let folderId = $('.active.folder-node').attr('id');
    //         let prevElement;
    //         if(evt.newDraggableIndex == 0) {
    //             prevElement = $('.card-wrapper').eq(evt.newDraggableIndex).next().attr('id');
    //         }
    //         else {
    //             prevElement = $('.card-wrapper').eq(evt.newDraggableIndex).prev().attr('id');
    //         }
    //         console.log(prevElement);
    //         $.ajax({
    //             type: 'POST',
    //             url: '/fileUpload/reorder',
    //             data: {
    //                 'movedId' : movedId,
    //                 'folderId' : folderId,
    //                 'prevElement' : prevElement,
    //                 'newIndex' : evt.newDraggableIndex,
    //             },
    //             dataType: "json",
    //             headers: {
    //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //             },
    //             success: function(data) {
    //             },
    //             error: function(data) {
    //             }
    //             /*
    //             console.log(draggedElement, replacedElement);
    //         console.log(evt.to);    // target list
    //         console.log(evt.from);  // previous list
    //         console.log("old index:" + evt.oldIndex);  // element's old index within old parent
    //         console.log("new index: " + evt.newIndex);  // element's new index within new parent
    //         console.log("old draggable index: " + evt.oldDraggableIndex); // element's old index within old parent, only counting draggable elements
    //         console.log("new draggable index: " + evt.newDraggableIndex); // element's new index within new parent, only counting draggable elements
    //         console.log(evt.clone); // the clone element
    //         console.log("pullMode: " + evt.pullMode);  // when item is in another sortable: `"clone"` if cloning, `true` if moving
    //              */
    //         });
    //     },
    // });

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
        let itemId = $('#selectedList').val();
        formData.append("item_id", itemId);
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

    // Old file preview, should be removed
    // $('body').on('click', '.card-wrapper', function() {
    //     let docTitle = $(this).find('.file-name').first().html();
    //     let fileType = $(this).data('file-type');
    //     console.log(fileType);
    //     let fileName = $(this).data('file-name');
    //     let myOffcanvas = document.getElementById('documentPreview2')
    //     let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
    //     $('#documentPreviewLabel').html(docTitle);
    //     $('.previewArea').hide();
    //     if (fileType.indexOf('presentation') >= 0) {
    //         $('#powerpointPreview iframe').attr('src', 'https://view.officeapps.live.com/op/view.aspx?src=' + websiteURL + '/files/' + fileName);
    //         $('#powerpointPreview').show();
    //     }
    //     else if (fileType.indexOf('pdf') >= 0) {
    //         $('#pdfPreview embed').attr('src', websiteURL + '/files/' + fileName);
    //         $('#pdfPreview').show();
    //     }
    //     else if (fileType.indexOf('customText') >= 0) {
    //         $('#documentPreview #sample').html('test');
    //         $('#documentPreview').show();
    //     }
    //     else if (fileType.indexOf('image') >= 0) {
    //         $('#imagePreview img').attr('src', websiteURL + '/files/' + fileName);
    //         $('#imagePreview').show();
    //     }
    //     else {
    //         $('#noPreview').show();
    //     }
    //     $('#downloadDocument').attr('href', websiteURL + '/files/' + fileName);
    //     $('#downloadDocument').attr('download', docTitle);
    //     bsOffcanvas.show();
    // });

    // Creates a new list in the selected Inbox
    $('#newList').click(function () {
        let selectedInbox = $('.active.update-inbox').data('inbox-id');
        let allLists = $('#allLists');
        $.ajax({
            type: "POST",
            url: "/lists",
            data: {'inbox_id' : selectedInbox},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                allLists.append(`
                    <div class="listWrapper" data-list-id="${data.id}">
                        <div class="list-title">
                                <button type="button" class="btn btn-success btn-sm add-list-item" style="display: none"><i class="bi bi-file-earmark-plus"></i></button>
                            <p class="update-list-name">Untitled list</p>
                            <input style="display: none;" type="text" class="form-control new-list-title-input">
                        </div>
                        <div class="list">
                        </div>
                    </div>
                `);
                updateSortable();
            },
            error: function(data) {}
        })
    });

    // Shows a field to rename a list. It hides a paragraph and shows the input field
    $('body').on('dblclick', '.update-list-name', function() {
        let currentTitleElement = $(this);
        let updateTitleElement = $(this).next();
        let currentTitle = currentTitleElement.html();
        updateTitleElement.val(currentTitle);
        currentTitleElement.hide();
        updateTitleElement.show();
        updateTitleElement.focus();
        updateTitleElement.select();
    });

    // Save changes on the new list name
    $('body').on('blur', '.new-list-title-input', function() {
        let currentTitleElement = $(this);
        let oldTitleElement = $(this).prev();
        let currentTitle = currentTitleElement.val();
        let listId = currentTitleElement.parent().parent().data('list-id');
        console.log(listId);
        $.ajax({
            type: "PUT",
            url: "/lists/" + listId,
            data: {'title' : currentTitle},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                oldTitleElement.html(currentTitle);
                currentTitleElement.hide();
                oldTitleElement.show();
            },
            error: function(data) {}
        })
    });

    // Initializes sortable lists
    function updateSortable() {
        $.each($('.list'), function (i, val) {
            new Sortable(val, {
                group: {
                    name: 'list',
                    filter: '.list-title'
                },
                animation: 150
            });
        });
    }
    updateSortable();

    // Load lists
    function loadLists(selectedInbox = 0) {
        if(selectedInbox === 0) {
            selectedInbox = $('.update-inbox.active').data('inbox-id');
            console.log('selectedInbox');
        }
        let allLists = $('#allLists');
        allLists.empty();
        $.ajax({
            type: "GET",
            url: "/lists/" + selectedInbox,
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {

                $.each(data, function(key,value) {
                    allLists.append(`
                        <div class="listWrapper" data-list-id="${value.id}">
                            <div class="list-title">
                                <button type="button" class="btn btn-success btn-sm add-list-item" style="display: none"><i class="bi bi-file-earmark-plus"></i></button>
                                <p class="update-list-name">${value.title}</p>
                                <input style="display: none;" type="text" class="form-control new-list-title-input">
                            </div>
                            <div class="list">
                            </div>
                        </div>
                    `);
                });
            },
            error: function(data) {}
        })
    }

    $('body').on('click', '.add-list-item', function() {
        let selectedList = $(this).parent().parent().data('list-id');
        let selectedFolder = $('.folder-node.active').attr('id');
        let myOffcanvas = document.getElementById('newListItem');
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        $('#selectedList').val(selectedList);
        $.ajax({
            type: "POST",
            url: "/items",
            data: {
                'listId' : selectedList,
                'folderId' : selectedFolder
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $("div").find(`[data-list-id='${data.list_id}']`).find('div.list').append(`
                    <div class="card-wrapper" draggable="false" data-item-id="${val.id}">
                        <div class="card inbox">
                            <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                            </div>
                        </div>
                    </div>
                `);
            },
            error: function(data) {}
        })

        bsOffcanvas.show();
    });

    $('body').on('click', '.card-wrapper', function() {
        let myOffcanvas = document.getElementById('newListItem');
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        let itemId = $(this).data('item-id');
        $('#selectedList').val(itemId);
        $.ajax({
            type: "GET",
            url: "/items/" + itemId + "/edit",
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $('.sun-editor-editable').html(data.content);
                //document.getElementById('description').value = description.getContents();
                document.getElementById('itemEditor').value = data.content;
            },
            error: function(data) {}
        })

        bsOffcanvas.show();
    });

    $('body').on('click', '.update-inbox', function() {
        let selectedInbox = $(this).data('inbox-id');
        console.log(selectedInbox);
        loadLists(selectedInbox);
    });
    loadLists();

    $('#updateItem').click(function () {
        let itemValue = $('.sun-editor-editable').html();
        console.log(itemValue);
        let itemID = $('#selectedList').val();
        console.log(itemID);
        $.ajax({
            type: "PUT",
            url: "/items/" + itemID,
            data: { 'value' : itemValue },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {

            },
            error: function(data) {}
        })

    });
});
