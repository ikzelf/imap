import eventBus from './bus';
import {APP_LOADED, NEW_HOST_DETECTED,} from '../events';
import HostList from '../models/host-list';

/**
 * Host service.
 * - Update host list.
 * - (?) Update host information.
 */
class HostService {
    #loading;
    #timerId;

    /** @type {ZabbixAPI} */
    #zabbixAPI;

    /** @type {HostList} */
    #hostList;

    /**
     * Host service constructor.
     * @param {ZabbixAPI} zabbixAPI
     * @param {number} updateInterval
     */
    constructor(zabbixAPI, updateInterval) {
        this.#zabbixAPI = zabbixAPI;
        this.#hostList = new HostList(this);

        this.#loading = false;
        this.#timerId = null;

        this.updateInterval = updateInterval * 1000;

        this.#init();
    }

    /**
     * Initialize service.
     */
    #init() {
        // Load host list after load app
        eventBus.once(APP_LOADED, () => this.updateHostList());
    }

    /**
     * Fetch host list from server.
     */
    updateHostList() {
        if (this.#loading) {
            return;
        }

        this.#loading = true;
        this.#stopTimeout();

        this.#zabbixAPI.getHostList()
            .then(hostData => {
                const newHostInList = this.#hostList.update(hostData);
                newHostInList.forEach(host => eventBus.emit(NEW_HOST_DETECTED, null, host));
            })
            .finally(() => {
                this.#startTimout();
                this.#loading = false;
            });
    }

    /**
     * @param {Host} host
     * @param {{}} data
     * @return {Promise<void>}
     */
    updateHost(host, data) {
        return this.#zabbixAPI.updateHostData(host.id, data);
    }

    /**
     * Stop task to refresh host list.
     */
    #stopTimeout() {
        if (this.#timerId) {
            this.#timerId = null;
            clearTimeout(this.#timerId);
        }
    }

    /**
     * Schedule refresh host list.
     */
    #startTimout() {
        this.#stopTimeout();
        this.#timerId = setTimeout(() => this.updateHostList(), this.updateInterval);
    }

}

export default HostService;
