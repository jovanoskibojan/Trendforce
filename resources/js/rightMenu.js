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
        $(".custom-menu li:not(:first)").addClass('disabled');
    }
    else {
        $(".custom-menu li:not(:first)").removeClass('disabled');
    }
    $(".custom-menu").finish().toggle(100).

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
$(".custom-menu li").click(function(){
    // This is the triggered action name
    switch($(this).attr('data-action')) {
        // A case for each action. Your actions here
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
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

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
            loadFolders()
        },
        error: function(data) {
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
