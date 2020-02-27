import eventBus from '../bus';
import {__} from '../../helpers';
import {searchHosts} from '../../api/host';
import {createLink} from '../../api/link';
import {NOTIFY_HOST_SUCCESSFULLY_LOADED, RECEIVED_LINKS_DATA} from '../../events';
import NotificationService from '../notification';

class CreateHostLinkService {

    constructor() {
        if (!app.imap.settings.linksEnabled) {
            return;
        }

        this.hostList = {};
        this.timeoutId = null;
        this.hostRows = {};

        eventBus.on(NOTIFY_HOST_SUCCESSFULLY_LOADED, hostList => this.hostList = hostList);
        eventBus.on('CreateHostLinkService.open-dialog', host => this.openLinkDialog(host));
    }

    openLinkDialog(host) {
        let selectedHostIds = [];

        let linksFields = L.DomUtil.create('div', 'links_fields');

        let tableContainer = L.DomUtil.create('div', '', linksFields);
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.height = '100%';

        let table = L.DomUtil.create('table', 'tableinfo', tableContainer);
        table.setAttribute('cellpadding', '3');
        table.setAttribute('cellspacing', '1');

        L.DomUtil.create('tr', 'header', table);

        let index = 0;
        Object.values(this.hostList).forEach(otherHost => {
            if (otherHost.hostid !== host.hostid && otherHost.hasLocation()) {

                let tr = L.DomUtil.create('tr', index++ % 2 === 0 ? 'even_row' : 'odd_row', table);
                tr.setAttribute('hostid', otherHost.hostid);

                let td = L.DomUtil.create('td', '', tr);
                let label = L.DomUtil.create('label', '', td);

                let input = L.DomUtil.create('input', 'input checkbox pointer host_for_link', label);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', otherHost.hostid);
                L.DomEvent.on(input, 'change', () => {
                    if (input.checked) {
                        if (!selectedHostIds.include(otherHost.hostid)) {
                            selectedHostIds.push(otherHost.hostid);
                        }
                    } else {
                        if (selectedHostIds.include(otherHost.hostid)) {
                            delete selectedHostIds[selectedHostIds.indexOf(otherHost.hostid)];
                        }
                    }
                });

                label.append(` ${otherHost.name}`);

                this.hostRows[otherHost.hostid] = tr;
            }
        });


        let filterContainer = L.DomUtil.create('div', 'links_filter');
        let filterInput = L.DomUtil.create('input', '', filterContainer);
        filterInput.setAttribute('type', 'search');
        filterInput.setAttribute('placeholder', __('Search'));
        filterInput.style.width = '100%';

        filterInput.on('input', () => {
            /* задержка поиска в списке хостов выбора связи */
            // TODO: replace with lodash debounce
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => this.filterHostList(filterInput.value), 1000);
        });


        let dialogContainer = L.DomUtil.create('div');
        dialogContainer.style.whiteSpace = 'normal';
        dialogContainer.style.height = '400px';
        dialogContainer.style.width = '550px';

        dialogContainer.append(filterContainer, linksFields);

        overlayDialogue({
            'title': __('Select hosts for links'),
            'content': dialogContainer,
            'buttons': [
                {
                    title: __('Apply'),
                    action: () => this.createLinks(host, selectedHostIds),
                },
                {
                    title: __('Cancel'),
                    class: 'btn-alt',
                    action: () => {
                    }
                },
            ]
        }, this, undefined);
    }

    /* поиск в списке хостов выбора связи */
    filterHostList(query) {
        let filterQuery = query.toLowerCase().trim();
        if (filterQuery.length > 0) {
            searchHosts(query)
                .then(response => {
                    let foundHostList = Object.keys(response.data);

                    Object.keys(this.hostRows).forEach(hostId => {
                        let row = this.hostRows[hostId];
                        if (foundHostList.include(hostId)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
        } else {
            Object.values(this.hostRows).forEach(row => {
                row.style.display = '';
            });
        }
    }

    createLinks(host, selectedHostIds) {
        if (selectedHostIds.length > 0) {
            createLink(host.hostid, {...selectedHostIds})
                .then(response => {
                    if (response.data.error) {
                        NotificationService.error(response.data.error.message, __('Links'));
                        return;
                    }

                    eventBus.emit(RECEIVED_LINKS_DATA, null, response.data);
                })
        }
    }

}

export default CreateHostLinkService;