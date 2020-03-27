'use strict';

import IMapify from './js/imapify';
import * as Toastr from 'toastr';
import './/node_modules/toastr/build/toastr.css';
import 'leaflet';
import 'leaflet.markercluster';

import 'leaflet/dist/leaflet.css';
import './/css/imap.scss';

Toastr.options.positionClass = 'toast-top-center';
Toastr.options.timeout = 3000;

// // TODO: userAdditions ?
// try {
//     typeof window['userAdditions'] === 'function' && window['userAdditions']();
// } catch (e) {
// }

window.onload = () => IMapify.init();

