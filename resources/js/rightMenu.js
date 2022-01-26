import $ from "jquery";
// Trigger action when the contexmenu is about to be shown
let id;
let menuOrder;
$('body').on('contextmenu', '.folder-node', function(event) {
    id = $(this).attr('id');
    menuOrder = $(this).attr('aria-level');
    // Avoid the real one
    event.preventDefault();

    // Show contextmenu
    if(menuOrder == 1) {
        $(".custom-menu li:odd").addClass('disabled');
    }
    else {
        $(".custom-menu li:odd").removeClass('disabled');
    }
    $("#custom-menu-folder").finish().toggle(100).

        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
});

$('body').on('contextmenu', '.update-inbox', function(event) {
    id = $(this).data('inbox-id');
    // Avoid the real one
    event.preventDefault();
    $("#custom-menu-inbox").finish().toggle(100).

        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
});

$('body').on('contextmenu', '.card-wrapper', function(event) {
    id = $(this).data('item-id');
    // Avoid the real one
    event.preventDefault();
    $("#custom-menu-item").finish().toggle(100).

        // In the right position (the mouse)
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
});


// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
});


// If the menu element is clicked
$("#custom-menu-item li").click(function(){
    // This is the triggered action name
    switch($(this).attr('data-action')) {
        // A case for each action. Your actions here
        case 'archive':
            archiveElement(id);
            break;
        case 'favourite':
            favouriteElement(id);
            break;
        case 'delete':
            alert('delete: ' + id);
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
    $('#updateColorNewName').change(function () {
        let selectedColor = $(this).val();
        $('#colorExample').removeClass();
        $('#colorExample').addClass('p-2 my-2 d-block rounded-3 text-center');
        $('#colorExample').addClass(selectedColor);
    });
});

// If the menu element is clicked
$("#custom-menu-folder li").click(function(){
    // This is the triggered action name
    switch($(this).attr('data-action')) {
        // A case for each action. Your actions here
        case 'delete':
            alert('Option not yet active');
            break;
        case 'new':
            addNewFolder(id);
            break;
        case "rename":
            let modalRename = new bootstrap.Modal(document.getElementById('renameFolder'));
            let currentTitle = $("#" + id).html();
            console.log(currentTitle);
            $('#renameFolderSave').data('folder-ID', id);
            $("#renameFolderNewName").val(currentTitle);
            $("#renameFolderNameTitle").html(currentTitle);
            modalRename.show();
            break;
        case "color":
            let modalColor = new bootstrap.Modal(document.getElementById('updateColor'));
            let currentTitleColor = $("#" + id).html();
            let selectedColor = $('#updateColorNewName');
            $('#updateColorNameTitle').html(currentTitleColor);
            $('#updateColorSave').data('folder-ID', id);
            modalColor.show();
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
    $('#updateColorNewName').change(function () {
        let selectedColor = $(this).val();
        $('#colorExample').removeClass();
        $('#colorExample').addClass('p-2 my-2 d-block rounded-3 text-center');
        $('#colorExample').addClass(selectedColor);
    });
});

// If the menu element is clicked
$("#custom-menu-inbox li").click(function(){
    // This is the triggered action name
    switch($(this).attr('data-action')) {
        // A case for each action. Your actions here
        case 'delete':
            alert('Option not yet active');
            break;
        case "rename":
            let inboxRename = new bootstrap.Modal(document.getElementById('renameInbox'));
            let currentTitle = $('.update-inbox[data-inbox-id="' + id + '"]').html();
            $('#renameInboxSave').data('inbox-ID', id);
            $("#renameInboxNameTitle").html(currentTitle);
            $("#renameInboxNewName").val(currentTitle);
            inboxRename.show();
            break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

function archiveElement(id) {
    $.ajax({
        type: "POST",
        url: "/items/archive",
        data: {
            'id' : id,
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            $('.card-wrapper[data-item-id="' + id + '"]').fadeOut();
        },
        error: function(data) {
        }
    });
}
function favouriteElement(id) {
    $.ajax({
        type: "POST",
        url: "/items/favourite",
        data: {
            'id' : id,
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            console.log('jeje');
            console.log(data);
            if(data === 1)
                $('.card-wrapper[data-item-id="' + id + '"] .favourite-icon ').show();
            else {
                $('.card-wrapper[data-item-id="' + id + '"] .favourite-icon').hide();
            }
        },
        error: function(data) {
            console.log('err');
        }
    });
}


function addNewFolder(id) {
    let inboxID = $('.nav-link.active').data('inbox-id')
    $.ajax({
        type: "POST",
        url: "/folder",
        data: {
            'id' : id,
            'inbox_id' : inboxID,
        },
        dataType: "json",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            loadFolders();
            console.log('t3st');
        },
        error: function(data) {
            loadFolders();
            console.log('nana');
        }
    });
}

function loadFolders() {
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
            $('#folderWrapper').html('');
            $('#folderWrapper').append('<div id="folderTree"></div>');
            // https://github.com/chniter/bstreeview/issues/21
            $('#folderTree').bstreeview({
                data: data
            });
        },
        error: function (data) {
        }
    });
}
