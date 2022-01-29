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
        getFolders();
    });

    $('body').on('click', '#updateColorSave', function() {
        let folderId = $(this).data('folder-ID');
        let newColor = $('#updateColorNewName').val();
        updateFolder(folderId, newColor, 'color');
    });

    $('#showArchived').click(function () {
        $('.add-list-item').show();
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
        let selectedFolderId = $(this).attr('id');
        let inboxID = $('.nav-link.active').data('inbox-id');
        let favourite = '';
        $.ajax({
            type: "GET",
            url: "/items/archived/" + inboxID,
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $('.list').empty();
                let list;
                $.each(data, function (i, val) {
                    favourite = '';
                    if(!val.is_favourite) {
                        favourite = 'display: none';
                    }
                    list = $("div").find(`[data-list-id='${val.list_id}']`).find('div.list');
                    showItem(list, val.id, favourite, val.content);
                    $.each($('.list'), function (i, val) {
                        new Sortable(val, {
                            group: {
                                name: 'list',
                                filter: '.list-title'
                            },
                            animation: 150,
                            sort: false,
                        });
                    });

                });
                updateSortable();
            },
            error: function(data) {
            }
        })

    })

    $('#showFavourites').click(function () {
        $('.add-list-item').show();
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
        let selectedFolderId = $(this).attr('id');
        let inboxID = $('.nav-link.active').data('inbox-id');
        let favourite = '';
        $.ajax({
            type: "GET",
            url: "/items/favourite/" + inboxID,
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                $('.list').empty();
                let list;
                $.each(data, function (i, val) {
                    favourite = '';
                    if(!val.is_favourite) {
                        favourite = 'display: none';
                    }
                    list = $("div").find(`[data-list-id='${val.list_id}']`).find('div.list');
                    showItem(list, val.id, favourite, val.content);
                    $.each($('.list'), function (i, val) {
                        new Sortable(val, {
                            group: {
                                name: 'list',
                                filter: '.list-title',
                                put: false
                            },
                            animation: 0,
                            sort: false,
                        });
                        console.log('test');
                    });
                });
                //updateSortable();
            },
            error: function(data) {
            }
        })

    });

    $('body').on('click', '.folder-node', function() {
        $('.add-list-item').show();
        $('.folder-node.active').removeClass('active');
        $(this).addClass('active');
        let selectedFolderId = $(this).attr('id');
        let favourite = '';
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
                let list;
                $.each(data, function (i, val) {
                    favourite = '';
                    if(!val.is_favourite) {
                        favourite = 'display: none';
                    }
                    list = $("div").find(`[data-list-id='${val.list_id}']`).find('div.list');
                    showItem(list, val.id, favourite, val.content);
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

    $('.accordion-categories').click(function () {
        let inboxId = $(this).data('inbox-id');
       console.log(inboxId);
       updateCategories(inboxId);
    });

    updateCategories();
    function updateCategories(inboxID = null) {
        if(inboxID === null) {
            inboxID = $('.nav-link.active').data('inbox-id');
        }
        let categoriesWrapper = $('#categorySelection');
        categoriesWrapper.empty();
        $.ajax({
            type: "GET",
            url: "/categories/" + inboxID,
            //data: {'title' : 'test'},
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                $.each(data, function (i, val) {
                    categoriesWrapper.append(`
                        <option value="${val.id}">${val.title}</option>
                    `);
                });
            },
            error: function (data) {
            }
        });
    }

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
        complete: function(file, response) {
            setTimeout(() => {
                this.removeFile(file); // right here after 3 seconds you can clear
            }, 3000);
        },
    });

    myDropzone.on("sending", function(file, xhr, formData) {
        let itemId = $('#selectedItem').val();
        formData.append("item_id", itemId);
    });

    myDropzone.on("success", function(file, response) {
        let filesPreview = $('#filesPreview');
        showItemFiles(filesPreview, response)
        console.log(response);
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
        let selectedInbox = $('.nav-link.active').data('inbox-id');
        let myOffcanvas = document.getElementById('newListItem');
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        $.ajax({
            type: "POST",
            url: "/items",
            data: {
                'listId' : selectedList,
                'folderId' : selectedFolder,
                'inboxId' : selectedInbox,
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let itemsWrapper = $("div").find(`[data-list-id='${data.list_id}']`).find('div.list');
                showItem(itemsWrapper, data.id, 'display: none', '');
                // $("div").find(`[data-list-id='${data.list_id}']`).find('div.list').append(`
                //     <div class="card-wrapper" draggable="false" data-item-id="${data.id}">
                //         <i class="bi bi-star-fill favourite-icon"></i>
                //         <div class="card inbox">
                //             <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                //             </div>
                //         </div>
                //     </div>
                // `);
                $('#selectedItem').val(data.id);
            },
            error: function(data) {}
        })

        bsOffcanvas.show();
    });

    $('body').on('click', '.card-wrapper', function() {
        let myOffcanvas = document.getElementById('newListItem');
        let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
        let itemId = $(this).data('item-id');
        $('#selectedItem').val(itemId);
        $.ajax({
            type: "GET",
            url: "/items/" + itemId + "/edit",
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let categories = $('#categorySelection');
                $('.sun-editor-editable').html(data.content);
                document.getElementById('itemEditor').value = data.content;
                let filesPreview = $('#filesPreview');
                filesPreview.empty();
                $.each(data.file, function (i, val) {
                    showItemFiles(filesPreview, val);
                });
                console.log(data.category);
                let selectedCategories = [];
                $.each(data.category, function (i, val) {
                    selectedCategories.push(val.id);
                });
                categories.val(selectedCategories);
                categories.trigger('change');
                console.log(selectedCategories);
                let itemTags = $('#allTags');
                itemTags.empty();
                $.each(data.tags, function (i, val) {
                    addNewTagToDom(itemTags, val.id, val.title);
                });
            },
            error: function(data) {}
        })

        bsOffcanvas.show();
    });

    $('body').on('click', '.itemFile', function() {
        let modal = document.getElementById("filePreview");
        let fileModalPreview = $('#fileModalPreview');
        let fileType = $(this).data('file-type');
        let fileName = $(this).data('file-name');
        let fileTitle = $(this).data('file-title');
        let downloadButton = $('#downloadFileButton');
        downloadButton.attr('download', fileName);
        downloadButton.attr('href', 'files/' + fileTitle);
        $('#filePrevewTitle').html(fileName);
        if(fileType == 'img') {
            fileModalPreview.html(`
                <img src="files/${fileTitle}">
            `);
        }
        else if(fileType == 'pdf') {
            fileModalPreview.html(`
                <embed src="files/${fileTitle}" style="" width="100%" height="100%" type="application/pdf">
            `);
        }
        else if (fileType == 'ppt') {
            fileModalPreview.html(`
                <iframe src='https://view.officeapps.live.com/op/view.aspx?src=files/${fileTitle}' width='100%' height='600px' frameborder='0'></iframe>
            `);
        }
        else {
            fileModalPreview.html(`
                <p>No preview available</p>
            `);
        }
        modal.style.display = "block";
    });

    $('body').on('click', '#closeFilePreview, #closeFilePreviewButton', function() {
        var modal = document.getElementById("filePreview");
        modal.style.display = "none";
    });

    function showItemFiles(filesPreview, val) {
        if (val.type.toLowerCase().indexOf("image") >= 0) {
            filesPreview.append(`
                <div class="itemFile" data-file-type="img" data-file-name="${val.file_name}" data-file-title="${val.title}" >
                    <img src="files/${val.title}">
                </div>
            `);
        }
        else if (val.type.toLowerCase().indexOf("pdf") >= 0) {
            filesPreview.append(`
                <div class="itemFile" data-file-type="pdf" data-file-name="${val.file_name}" data-file-title="${val.title}">
                    <p><i class="bi bi-file-earmark-pdf"></i></p>
                </div>
            `);
        }
        else if (val.type.toLowerCase().indexOf("presentation") >= 0) {
            filesPreview.append(`
                <div class="itemFile" data-file-type="ppt" data-file-name="${val.file_name}" data-file-title="${val.title}">
                    <p><i class="bi bi-file-earmark-ppt"></i></p>
                </div>
            `);
        }
        else {
            filesPreview.append(`
                <div class="itemFile" data-file-type="other" data-file-name="${val.file_name}" data-file-title="${val.title}">
                    <p><i class="bi bi-file-binary"></i></p>
                </div>
            `);
        }
    }

    $('body').on('click', '.update-inbox', function() {
        let selectedInbox = $(this).data('inbox-id');
        updateCategories();
        loadLists(selectedInbox);
    });
    loadLists();

    $('#updateItem').click(function () {
        let itemValue = $('.sun-editor-editable').html();
        let itemID = $('#selectedItem').val();
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

    let categorySelection = $('#categorySelection');
    categorySelection.select2();
    categorySelection.on('select2:select', function (e) {
        let data = e.params.data;
        let categoryId = data.id;
        let itemId = $('#selectedItem').val();
        $.ajax({
            type: "POST",
            url: "/categories/assign",
            data: {
                category : categoryId,
                item : itemId
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {

            },
            error: function(data) {}
        })
    });
    categorySelection.on('select2:unselect', function (e) {
        let data = e.params.data;
        let categoryId = data.id;
        let itemId = $('#selectedItem').val();
        $.ajax({
            type: "POST",
            url: "/categories/remove",
            data: {
                category : categoryId,
                item : itemId
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {

            },
            error: function(data) {}
        })
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            var modal = document.getElementById("filePreview");
            modal.style.display = "none";
        }
    }

    $('.newCategory').on( 'keydown', function(event) {
        let element = $(this);
        let value = element.val()
        let inbox_id = $('.accordion-collapse.collapse.show').data('inbox-id');
        console.log(inbox_id);
        if(event.which == 13)
            $.ajax({
                type: "POST",
                url: '/categories',
                data: {
                    'category_title' : value,
                    'inbox_id' : inbox_id
                },
                dataType: "json",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    let itemTags = $('#allTags');
                    element.parent().next().append(`
                        <span class="badge rounded-pill bg-secondary"><span class="showCategoryItems" data-category-id="${ data.id }">${ data.title }</span> <i class="remove-category bi bi-x-circle-fill"></i></span>
                    `);
                    let categoryNumberElement = $('#accordion-' + inbox_id).find('span');
                    let categoryNumber = categoryNumberElement.html();
                    categoryNumberElement.html(parseInt(categoryNumber)+1);
                    element.val('');
                },
                error: function(data) {}
            })
    })

    $('#newTag').on( 'keydown', function(event) {
        let element = $(this);
        let value = element.val()
        let item_id = $('#selectedItem').val()
        let inbox_id = $('.update-inbox.active').data('inbox-id');
        if(event.which == 13)
            $.ajax({
                type: "POST",
                url: '/tags',
                data: {
                    'tag' : value,
                    'items_id' : item_id,
                    'inbox_id' : inbox_id
                },
                dataType: "json",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    let itemTags = $('#allTags');
                    addNewTagToDom(itemTags, data.id, data.title);
                    element.val('');
                },
                error: function(data) {}
            })
    });

    $('body').on('click', '.remove-tag', function() {
        let element = $(this);
        let tagId = element.data('tag-id');
        let itemId = $('#selectedItem').val();
        $.ajax({
            type: "POST",
            url: '/tags/detachTag',
            data: {
                itemId : itemId,
                tagId : tagId
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                element.remove();
            },
            error: function(data) {}
        })

    });

    function addNewTagToDom(element, id, title) {
        element.append(`
            <span class="badge rounded-pill bg-secondary remove-tag" data-tag-id="${id}">${title}</span>
        `);
    }

    $('body').on('click', '.showTagItems', function() {
        let tagId = $(this).data('tag-id');
        let clickedButton = $(this);
        $.ajax({
            type: "GET",
            url: "/tags/getItems",
            data: {
                'id' : tagId
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let itemsWrapper = clickedButton.parent().next();
                let content;
                itemsWrapper.empty();
                let favourite;
                let list;
                $.each(data.items, function (i, val) {
                    favourite = '';
                    if(!val.is_favourite) {
                        favourite = 'display: none';
                    }
                    showItem(itemsWrapper, val.id, favourite, val.content);
                    // itemsWrapper.append(`
                    //     <div class="card-wrapper" draggable="false" data-item-id="${val.id}">
                    //         <i class="bi bi-star-fill favourite-icon"></i>
                    //         <div class="card inbox">
                    //             <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                    //                 ${val.content}
                    //             </div>
                    //         </div>
                    //     </div>
                    // `);
                });
            },
            error: function(data) {
            }
        })
    })

    $('body').on('click', '.showCategoryItems', function() {
        let categoryId = $(this).data('category-id');
        let clickedButton = $(this);
        $.ajax({
            type: "GET",
            url: "/categories/getItems",
            data: {
                'id' : categoryId
            },
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let itemsWrapper = clickedButton.parent().parent().next();
                let content;
                itemsWrapper.empty();
                let favourite;
                $.each(data.item, function (i, val) {
                    favourite = '';
                    if(!val.is_favourite) {
                        favourite = 'display: none';
                    }
                    showItem(itemsWrapper, val.id, favourite, val.content);
                    // itemsWrapper.append(`
                    //     <div class="card-wrapper" draggable="false" data-item-id="${val.id}">
                    //         <i class="bi bi-star-fill favourite-icon"></i>
                    //         <div class="card inbox">
                    //             <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                    //                 ${val.content}
                    //             </div>
                    //         </div>
                    //     </div>
                    // `);
                });
            },
            error: function(data) {
            }
        })
    })

    $('body').on('click', '.remove-category', function() {
        let categoryId = $(this).prev().data('category-id');
        let clickedButton = $(this);
        let inbox_id = $('.accordion-collapse.collapse.show').data('inbox-id');
        $.ajax({
            type: "DELETE",
            url: "/categories/" + categoryId,
            data: {},
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                let itemsWrapper = clickedButton.parent().parent().parent().next();
                clickedButton.parent().remove();
                itemsWrapper.empty();
                let categoryNumberElement = $('#accordion-' + inbox_id).find('span');
                let categoryNumber = categoryNumberElement.html();
                categoryNumberElement.html(parseInt(categoryNumber)-1);
            },
            error: function(data) {
            }
        })
    });

    function showItem(element, id, favourite, content) {
        element.append(`
            <div class="card-wrapper" draggable="false" data-item-id="${id}">
                <i class="bi bi-star-fill favourite-icon" style="${favourite}"></i>
                <div class="card inbox">
                    <div class="card-body" data-current-icon="file-earmark-bar-graph-fill">
                        ${content}
                    </div>
                </div>
            </div>
        `);
    }

    $('#btnGroupDrop1').click(function () {
        alert("");
    });

});
