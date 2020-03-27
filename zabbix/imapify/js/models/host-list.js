import Host from './host';

/**
 * Host list collection.
 */
class HostList {

    /**
     *
     * @type Object.<number,Host>>
     */
    #list = {};

    /**
     * Host list constructor.
     * @param service
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Refresh host list.
     *
     * @param hostData
     * @return {[Host]}
     */
    update(hostData) {
        const newHostInList = [];
        const keysInNewList = hostData.map(data => {
            return parseInt(data['hostid']);
        });

        const keysToRemove = Object.keys(this.#list).filter(key => keysInNewList.includes(parseInt(key)) === false);
        keysToRemove.forEach(hostId => {
            const host = this.#list[hostId];
            delete this.#list[hostId];
            host.emit('deleted', {host: host});
        });

        for (const data of hostData) {
            const hostId = parseInt(data['hostid']);
            if (this.#list.hasOwnProperty(hostId) === false) {
                this.#list[hostId] = new Host(this.service);
                newHostInList.push(this.#list[hostId]);
            }

            this.#list[hostId].update(data);
        }

        return newHostInList;
    }
}

export default HostList;