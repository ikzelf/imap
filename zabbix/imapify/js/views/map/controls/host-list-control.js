import eventBus from '../../../services/bus';
import {NEW_HOST_DETECTED} from '../../../events';
import {__} from '../../../helpers';
import {debounce} from 'lodash';
import {
    HOST_INVENTORY_MODE_DISABLED,
    HOST_MAINTENANCE_STATUS_ENABLED,
    HOST_STATUS_DISABLED
} from '../../../models/host';

/**
 * Host list control.
 * @todo host state with trigger
 * @todo filter - only active host
 * @todo open popup after move to host
 */
class HostListControl extends L.Control {
    static #RESORT_DEBOUNCE_TIME = 200;
    static #HOST_VIEW_ZOOM = 17;

    /**
     * @type {Function}
     */
    #debounceRedrawHostList;

    /**
     * @type {Object.<number, HTMLElement>}
     */
    #hostElementList;

    /**
     * @type {Object.<number, string>}
     */
    #hostNameMap;

    /**
     * @type {string}
     */
    #filterQuery;

    /**
     * @type {Map|L.Map}
     */
    #map;

    /**
     * Host list constructor.
     *
     * @param {string} position
     */
    constructor(position) {
        super({position: position});

        this.#debounceRedrawHostList = debounce(() => this.#redrawHostList(), HostListControl.#RESORT_DEBOUNCE_TIME);

        this.#hostElementList = {};
        this.#hostNameMap = {};
        this.#filterQuery = '';

        eventBus.on(NEW_HOST_DETECTED, (host) => this.#onNewHostDetected(host));
    }

    /**
     * Callback on new host detected.
     * @param {Host} host
     */
    #onNewHostDetected(host) {
        if (this.#hostElementList.hasOwnProperty(host.id)) {
            // sorry, host already defined
            console.warn('host already defined');
            this.#debounceRedrawHostList();

            return;
        }


        this.#hostElementList[host.id] = null;

        host.on('updated', () => this.#onHostUpdated(host))
            .on('deleted', () => this.#onHostDeleted(host));


        this.#onHostUpdated(host);
    }

    /**
     * On host change information
     * @param {Host} host
     */
    #onHostUpdated(host) {
        if (!this.#hostElementList.hasOwnProperty(host.id)) {
            return;
        }

        const hostElement = L.DomUtil.create('div', 'host', this.hostListContainer);
        hostElement.setAttribute('host-id', host.id);
        this.#hostElementList[host.id] = hostElement;

        this.#hostNameMap[host.id] = host.name;

        L.DomUtil.removeClass(hostElement, 'host-disabled');
        L.DomUtil.removeClass(hostElement, 'host-without-inventory');
        L.DomUtil.removeClass(hostElement, 'host-in-maintenance');
        L.DomUtil.removeClass(hostElement, 'host-has-no-location');

        if (host.status === HOST_STATUS_DISABLED) {
            L.DomUtil.addClass(hostElement, 'host-disabled');
            hostElement.setAttribute('title', __('This host is disabled'));
        } else if (host.inventoryMode === HOST_INVENTORY_MODE_DISABLED) {
            L.DomUtil.addClass(hostElement, 'host-without-inventory');
            hostElement.setAttribute('title', __('This host has inventory mode disabled'));
        } else {
            let title = '';
            if (host.maintenanceStatus === HOST_MAINTENANCE_STATUS_ENABLED) {
                L.DomUtil.addClass(hostElement, 'host-in-maintenance');
                title = 'Maintenance mode.';
            }

            if (!host.inventory.hasLocation()) {
                L.DomUtil.addClass(hostElement, 'host-has-no-location');
                if (title) {
                    title += `; ${__('This host has no coordinates')}`;
                }
                hostElement.addEventListener('click', () => this.#selectHostLocation(host), true);
            } else {
                hostElement.addEventListener('click', () => this.#moveToHost(host), true);
            }

            hostElement.setAttribute('title', title);
        }

        hostElement.append(host.name);

        this.#debounceRedrawHostList();
    }

    /**
     * On host deleted.
     *
     * @param {Host} host
     */
    #onHostDeleted(host) {
        if (!this.#hostElementList.hasOwnProperty(host.id)) {
            return;
        }

        const hostElement = this.#hostElementList[host.id];
        delete this.#hostElementList[host.id];

        hostElement.remove();
    }

    // noinspection JSUnusedGlobalSymbols - call by map
    /**
     * Callback after append control to map.
     *
     * @param {Map} map
     * @return {div}
     */
    onAdd(map) {
        this.#map = map;

        // create the control container with a particular class name
        let container = L.DomUtil.create('div', 'hosts_list');

        container.setAttribute('aria-haspopup', 'true');

        this.underHostsList = L.DomUtil.create('div', '', container);
        {
            this.underHostsList.id = 'under_hosts_list';
            this.underHostsList.style.display = 'none';

            let title = L.DomUtil.create('div', 'host-list-title', this.underHostsList);
            title.innerText = __('Hosts');

            let closeButton = L.DomUtil.create('button', 'close-hosts-list', title);
            closeButton.innerText = __('Close');
            L.DomEvent.on(closeButton, 'click', event => {
                event.stopPropagation();
                this.#hideHostList()
            }, this);

            let search_hosts_list = L.DomUtil.create('div', '', this.underHostsList);
            {
                search_hosts_list.id = 'search_hosts_list';
                let searchInput = L.DomUtil.create('input', '', search_hosts_list);
                searchInput.type = 'search';
                searchInput.placeholder = __('Search');
                searchInput.oninput = (event) => {
                    this.#filterQuery = event.target.value.trim();
                    this.#debounceRedrawHostList();
                };
            }
        }

        this.hostListContainer = L.DomUtil.create('div', '', this.underHostsList);
        this.hostListContainer.id = 'hosts_list';
        this.hostListContainer.classList.add('nicescroll');

        this.showHostsListElement = L.DomUtil.create('div', 'show-host-list', container);
        this.filterIndicator = L.DomUtil.create('div', '', this.showHostsListElement);

        this.filterIndicator.id = 'filter-indicator';
        this.filterIndicator.style.display = 'none';

        let image = new Image();
        image.src = 'imapify/images/filter.png';
        this.filterIndicator.append(image);

        L.DomUtil.create('b', '', this.showHostsListElement).innerText = __('Hosts');

        L.DomEvent
            .on(this.showHostsListElement, 'click', event => {
                event.stopPropagation();
                this.#showHostList(event)
            }, this)
            .on(container, 'click', (event) => event.stopPropagation(), this)
            .on(container, 'dblclick', (event) => event.stopPropagation(), this)
            .on(container, 'mousemove', (event) => event.stopPropagation(), this)
            .on(container, 'scroll', (event) => event.stopPropagation(), this)
        ;

        return container;
    }

    /**
     * Filter host by name.
     * @return {[string]}
     */
    #getFilteredHostIdList() {
        let keys = Object.keys(this.#hostElementList);
        if (this.#filterQuery) {
            let filterParts = this.#filterQuery
                .toLowerCase()
                .split(' ')
                .filter(value => value !== '');

            return keys.filter(hostId => {
                const hostNameParts = this.#hostNameMap[hostId]
                    .toLowerCase()
                    .split(' ')
                    .filter(value => value !== '');

                return filterParts.every(filter => hostNameParts.find(name => name.include(filter)))
            });
        }

        return keys;
    }

    /**
     * Redraw host list.
     */
    #redrawHostList() {
        this.hostListContainer.innerHTML = '';

        this.#getFilteredHostIdList()
            .sort((hostAId, hostBId) => {
                return this.#hostNameMap[hostAId].toUpperCase().localeCompare(this.#hostNameMap[hostBId].toUpperCase());
            })
            .forEach(hostId => this.hostListContainer.append(this.#hostElementList[hostId]));
    }

    /**
     * Show host list element.
     */
    #showHostList() {
        this.underHostsList.style.display = 'block';
        this.showHostsListElement.style.display = 'none';
        // noinspection JSUnresolvedVariable
        this.#map.scrollWheelZoom.disable();
    }

    /**
     * Hide host list element.
     */
    #hideHostList() {
        this.underHostsList.style.display = 'none';
        this.showHostsListElement.style.display = 'block';
        // noinspection JSUnresolvedVariable
        this.#map.scrollWheelZoom.enable();
    }

    /**
     * Move map to host.
     * @param host
     */
    #moveToHost(host) {
        if (this.#map) {
            this.#map.setView([host.inventory.lat, host.inventory.lng], HostListControl.#HOST_VIEW_ZOOM);
            // TODO: and open popup marker
        }
    }

    /**
     * Initialize set host location function.
     * @param host
     */
    #selectHostLocation(host) {
        this.#hideHostList();

        setTimeout(() => {
            this.#map.getCoordinates(host.name)
                .then(({lat, lng}) => host.updatePosition({
                    lat: lat,
                    lng: lng,
                }))
                .finally(() => this.#showHostList());
        }, 100);
    }
}

export default HostListControl;