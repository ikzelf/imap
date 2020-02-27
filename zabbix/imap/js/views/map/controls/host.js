import {__} from '../../../helpers';
import eventBus from '../../../services/bus';
import {
    MOVE_TO_HOST,
    NOTIFY_HOST_FILTER_UPDATED,
    NOTIFY_HOST_REMOVED,
    NOTIFY_HOST_SUCCESSFULLY_LOADED,
    NOTIFY_HOST_UPDATED,
    WANT_CHANGE_HOST_LOCATION
} from '../../../events';

import {debounce} from 'lodash';

class HostControl extends L.Control {
    constructor(position) {
        super({position: position});

        this.timeoutSearch = null;

        this.hostElemenentList = {};

        eventBus.on(NOTIFY_HOST_UPDATED, (host) => this.updateHost(host));
        eventBus.on(NOTIFY_HOST_REMOVED, (host) => this.removeHost(host));

        eventBus.on(NOTIFY_HOST_SUCCESSFULLY_LOADED, () => this.sortHostList());
    }

    onAdd(map) {
        // create the control container with a particular class name
        let container = L.DomUtil.create('div', 'hosts_list');

        container.setAttribute('aria-haspopup', 'true');

        this.underHostsList = L.DomUtil.create('div', '', container);
        {
            this.underHostsList.id = 'under_hosts_list';
            this.underHostsList.style.display = 'none';

            let search_hosts_list = L.DomUtil.create('div', '', this.underHostsList);
            {
                search_hosts_list.id = 'search_hosts_list';
                let searchInput = L.DomUtil.create('input', '', search_hosts_list);
                searchInput.type = 'search';
                searchInput.placeholder = __('Search');
                searchInput.oninput = debounce((event) => this.filterHost(event), 1000);
            }

            //              (event) => this.onFilterInput(event.target.value);
            // this.filter = _.debounce(calculateLayout, 150)

        }

        this.hostListContainer = L.DomUtil.create('div', '', this.underHostsList);
        this.hostListContainer.id = 'hosts_list';
        this.hostListContainer.classList.add('nicescroll');

        this.showHostsList = L.DomUtil.create('div', '', container);

        this.showHostsList.id = 'show_hosts_list';
        this.filterIndicator = L.DomUtil.create('div', '', this.showHostsList);

        this.filterIndicator.id = 'filter-indicator';
        this.filterIndicator.style.display = 'none';

        let image = new Image();
        image.src = 'imap/images/filter.png';
        this.filterIndicator.append(image);

        L.DomUtil.create('b', '', this.showHostsList).innerText = __('Hosts');


        L.DomEvent.on(container, 'mouseleave', () => this.onMouseLeave(map), this)
            .on(container, 'mouseover', () => this.onMouseOver(map), this)
            .on(container, 'click', () => this.onClick, this)
            .on(container, 'dblclick', () => this.onDblClick, this)
            .on(container, 'mousemove', () => this.onMouseMove, this)
            .on(container, 'scroll', () => this.onScroll, this)
        ;

        return container;
    }

    onMouseLeave(map) {
        this.showHostsList.style.display = 'block';
        this.underHostsList.style.display = 'none';


        map.scrollWheelZoom.enable();
    }

    onMouseOver(map) {
        this.underHostsList.style.display = 'block';
        this.showHostsList.style.display = 'none';

        map.scrollWheelZoom.disable();
    }

    /* поиск в списке хостов на карте */
    filterHost(event) {
        eventBus.emit(NOTIFY_HOST_FILTER_UPDATED, null, event.target.value);

        if (event.target.value.trim() !== '') {
            this.filterIndicator.style.display = 'inline';
        } else {
            this.filterIndicator.style.display = 'none';
        }
    }

    updateHost(host) {
        let hostElement;

        if (this.hostElemenentList.hasOwnProperty(host.hostid)) {
            hostElement = this.hostElemenentList[host.hostid];
        } else {
            hostElement = L.DomUtil.create('div', 'host_in_list', this.hostListContainer);
            hostElement.on('click', () => this.onHostClick(host));

            this.hostElemenentList[host.hostid] = hostElement;
        }

        hostElement.setAttribute('hostname', host.name);
        hostElement.setAttribute('hostid', host.hostid);
        hostElement.innerText = '';

        if (!host.hasLocation()) {
            let setHostLocation = L.DomUtil.create('img', 'host_crosschair', hostElement);
            setHostLocation.setAttribute('title', __('This host does not have coordinates'));
            setHostLocation.setAttribute('src', 'imap/images/target.png');

            hostElement.append(' ');
        }

        hostElement.append(host.name);
    }

    removeHost(host) {
        if (this.hostElemenentList.hasOwnProperty(host.hostid)) {
            let element = this.hostElemenentList[host.hostid];
            element.remove();
            delete this.hostElemenentList[host.hostid];
        }
    }

    sortHostList() {
        this.hostListContainer.innerHTML = '';

        Object.values(this.hostElemenentList).sort((elementA, elementB) => {
            let nameA = elementA.getAttribute('hostname') || '';
            let nameB = elementB.getAttribute('hostname') || '';

            return nameA.toUpperCase().localeCompare(nameB.toUpperCase());
        }).forEach((element) => {
            this.hostListContainer.append(element);
        });
    }

    onHostClick(host) {
        if (host.hasLocation()) {
            eventBus.emit(MOVE_TO_HOST, null, host);
        } else {
            setTimeout(() => eventBus.emit(WANT_CHANGE_HOST_LOCATION, null, host), 500);
        }
    }

    onClick(event) {
        event.stopPropagation();
    }

    onDblClick(event) {
        event.stopPropagation();
    }

    onMouseMove(event) {
        event.stopPropagation();
    }

    onScroll(event) {
        event.stopPropagation();
    }

}

export default HostControl;