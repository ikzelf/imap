import eventBus from '../bus';
import {__} from '../../helpers';
import TreeView from 'js-treeview';

import 'js-treeview/dist/treeview.min.css';


class DebugInfoService {
    constructor() {
        eventBus.on('debug-info-service.show-dump', (model) => this.debugInfo(model));
    }

    debugInfo(model) {
        let element = L.DomUtil.create('div');
        element.setAttribute('id', 'debug-info');
        // element.style.whiteSpace = 'normal';
        // element.innerHTML = `<pre>${this.dump(model)}</pre>`;


        overlayDialogue({
            'title': __('Debug information'),
            'content': element,
            'buttons': [
                {
                    'title': __('Ok'),
                    'class': 'btn-alt',
                    'action': function () {
                    }
                },
            ]
        }, this, undefined);

        new TreeView([
            {
                name: 'Object',
                expanded: true,
                children: this.dump(model),
            },
        ], 'debug-info');
    }

    dump(obj, alreadyParsed) {
        alreadyParsed = alreadyParsed || [];

        let children = [];
        if (obj && typeof obj === 'object') {
            if (alreadyParsed.include(obj)) {
                children.push({
                    name: `[duplicate]: ${obj}`,
                });
            } else {
                alreadyParsed.push(obj);

                for (let i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        if (typeof obj[i] === 'object') {
                            children.push({
                                name: `${i} (${Array.isArray(obj[i]) ? 'Array' : 'Object'}):`,
                                expanded: true,
                                children: this.dump(obj[i], alreadyParsed),
                            });
                        } else {
                            let value = obj[i];
                            if (value === null) {
                                value = 'null';
                            } else if (typeof value === 'boolean') {
                                value = value ? 'true' : 'false';
                            } else if (typeof value === 'string' && value === '') {
                                value = '(empty)';
                            }

                            children.push({
                                name: `${i} : ${value}`,
                            });
                        }
                    }
                }
            }
        } else {
            children.push({
                name: obj,
            });
        }

        return children;
    }

}

export default DebugInfoService;