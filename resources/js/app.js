require('@popperjs/core');
require('./bootstrap');
require('bootstrap/js/dist/modal');
require('dropzone/dist/dropzone-min');
import Modal from 'bootstrap/js/dist/modal';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
require('bootstrap/dist/js/bootstrap.bundle.js');
require('sortablejs');
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
window.Sortable = Sortable;
import $ from "jquery";
//$("[data-toggle=tooltip]").tooltip();
import 'suneditor/dist/css/suneditor.min.css';
import suneditor from 'suneditor';
import plugins from 'suneditor/src/plugins'
import Dropzone from "dropzone";
import ('dropzone/dist/dropzone.css');
window.Dropzone = Dropzone;
require('bstreeview/src/js/bstreeview');
require('select2');
require('./inboxTree');
require('./inbox');
require('./rightMenu');
import Alpine from 'alpinejs';
window.Alpine = Alpine;

Alpine.start();



$(document).ready(function () {
    //let myDropzone = new Dropzone("div#uploadField", { url: "/files"});
});
// // You can also load what you want
// suneditor.create('sample', {
//     plugins: [plugins.font],
//     // Plugins can be used directly in the button list
//     buttonList: [
//         ['font', plugins.image]
//     ],
//     iframeAttributes: [
//         ['scrolling', 'yes']
//     ]
// });
