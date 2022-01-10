require('@popperjs/core');
require('./bootstrap');
require('bootstrap/js/dist/modal');
import Modal from 'bootstrap/js/dist/modal';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
require('bootstrap/dist/js/bootstrap.bundle.js');
require('sortablejs');
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
window.Sortable = Sortable;
import $ from "jquery";
//$("[data-toggle=tooltip]").tooltip();
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'
require('bstreeview/src/js/bstreeview');
require('select2');
require('./inboxTree');
import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();
