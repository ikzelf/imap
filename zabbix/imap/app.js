'use strict';

import Imap from './js/imap';
import * as Toastr from 'toastr';
import './/node_modules/toastr/build/toastr.css';

Toastr.options.positionClass = 'toast-top-center';
Toastr.options.timeout = 3000;

// // TODO: userAdditions ?
// try {
//     typeof window['userAdditions'] === 'function' && window['userAdditions']();
// } catch (e) {
// }

export const imap = Imap;
