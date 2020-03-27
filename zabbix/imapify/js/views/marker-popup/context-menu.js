import {__} from '../../helpers';
import eventBus from '../../services/bus';
import {SHOW_CONTEXT_MENU} from '../../events';

class ContextMenuElement {
    constructor(host, parent, {
        zabbixVersion
    }) {
        this.element = L.DomUtil.create('div', 'host-items', parent);
        this.element.setAttribute('id', `host-items${host.hostid}`);

        this.zabbixVersion = zabbixVersion;
        this.host = host;
    }

    refresh(graphData) {
        let container = L.DomUtil.create('span', 'link_menu');

        let graphs = [];
        graphData.forEach(graph => {
            graphs.push({
                label: graph.name,
                url: 'charts.php?graphid=' + graph.graphid,
                clickCallback: (event) => {
                    event.preventDefault();
                    this.popupFrame(`charts.php?ispopup=1&graphid=${graph.graphid}`);
                },
                data: {graphId: graph.graphid}
            });
        });

        let latestData = {
            label: __('Latest data'),
            url: null,
            clickCallback: null,
        };

        if (this.zabbixVersion.substr(0, 3) === '2.2') {
            latestData.url = `latest.php?hostid=${this.host.hostid}&groupid=0`;
            latestData.clickCallback = (event) => {
                event.preventDefault();
                this.popupFrame(`latest.php?hostid${this.host.hostid}&groupid=0`);
            };
        } else {
            latestData.url = `latest.php?hostids%5B%5D=${this.host.hostid}&filter_set=Filter`;
            latestData.clickCallback = (event) => {
                event.preventDefault();
                this.popupFrame(`latest.php?hostids%5B%5D=${this.host.hostid}&filter_set=Filter`);
            };
        }

        let hostInventory = {
            label: __('Host inventory'),
            url: `hostinventories.php?hostid=${this.host.hostid}`,
            clickCallback: (event) => {
                event.preventDefault();
                this.popupFrame(`hostinventories.php?ispopup=1&hostid=${this.host.hostid}`);
            }
        };

        let triggers = {
            label: __('Triggers'),
            url: `tr_status.php?hostid=${this.host.hostid}`,
            clickCallback: (event) => {
                event.preventDefault();
                this.popupFrame(`tr_status.php?ispopup=1&hostid=${this.host.hostid}`);
            }
        };

        let hostConfig = {
            label: __('Host config'), items: [
                {
                    label: __('Host'),
                    url: `hosts.php?form=update&hostid=${this.host.hostid}`
                },
                {
                    label: __('Applications'),
                    url: `applications.php?hostid=${this.host.hostid}`
                },
                {
                    label: __('Items'),
                    url: `items.php?hostid=${this.host.hostid}`
                },
                {
                    label: __('Triggers'),
                    url: `triggers.php?hostid=${this.host.hostid}`
                },
                {
                    label: __('Graphs'),
                    url: `graphs.php?hostid=${this.host.hostid}`
                },
                {
                    label: __('Discovery rules'),
                    url: `host_discovery.php?hostid=${this.host.hostid}`
                },
                {
                    label: __('Web scenarios'),
                    url: `httpconf.php?hostid=${this.host.hostid}`
                }
            ]
        };

        let data = [
            {
                label: __('Host view'),
                items: [
                    {label: __('Graphs'), items: graphs},
                    latestData,
                    hostInventory,
                    triggers,
                ],
            },
            {
                label: __('Config'),
                items: [
                    hostConfig
                ]
            },
        ];

        container.on('click', (event) => eventBus.emit(SHOW_CONTEXT_MENU, null, data, event));

        container.innerText = __('Tools');

        this.element.innerHTML = '';
        this.element.append(container);
    }

    popupFrame(url) {
        let container = L.DomUtil.create('span', 'graphPopupWindow');

        let iframe = L.DomUtil.create('iframe', '', container);
        iframe.setAttribute('src', url);
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('width', '100%');
        iframe.style.bottom = 0;
        iframe.style.right = 0;
        iframe.style.top = 0;
        iframe.style.left = 0;
        iframe.style.position = 'absolute';

        overlayDialogue({
            'title': __('Popup view'),
            'content': container,
            'buttons': [
                {
                    'title': __('Ok'),
                    'class': 'btn-alt',
                    'action': function () {
                    }
                }
            ]
        }, this, undefined);
    }

}

export default ContextMenuElement;