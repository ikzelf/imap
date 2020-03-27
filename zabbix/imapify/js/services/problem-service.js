import eventBus from './bus';
import {NEW_HOST_DETECTED} from '../events';
import {debounce} from 'lodash';

/**
 * Service for fetch and update problems.
 */
class ProblemService {
    static #UPDATE_DEBOUNCE_TIME = 300;

    /**
     * @type {ZabbixAPI}
     */
    #zabbixAPI;

    /**
     * @type {Object<number, Host>}
     */
    #hostList;

    /**
     * @type {Array<number>}
     */
    #hostForUpdate;

    /**
     * @type {Function}
     */
    #debounceUpdateProblemList;

    /**
     * Problem service constructor.
     * @param {ZabbixAPI} zabbixAPI
     * @param {number} updateInterval
     */
    constructor(zabbixAPI, updateInterval) {
        this.#zabbixAPI = zabbixAPI;

        this.#debounceUpdateProblemList = debounce(() => this.#updateProblemList(), ProblemService.#UPDATE_DEBOUNCE_TIME);

        this.#hostList = {};
        this.#hostForUpdate = [];

        eventBus.on(NEW_HOST_DETECTED, (host) => this.#onNewHostDetected(host))
    }

    /**
     * On new host detected.
     * @param host
     */
    #onNewHostDetected(host) {
        if (!this.#hostList.hasOwnProperty(host.id)) {
            this.#hostList[host.id] = host;

            this.#hostForUpdate.push(host.id);
            this.#debounceUpdateProblemList();
        }
    }

    /**
     * Fetch and update problem list.
     */
    #updateProblemList() {
        const hostForUpdate = this.#hostForUpdate;
        this.#hostForUpdate = [];

        this.#zabbixAPI.getProblemList(hostForUpdate)
            .then(problemListData => {
                // Prepare trigger-host map.
                /** @type {Object.<number, number>} - map trigger.id -> host.id */
                const hostTriggerMap = {};
                Object.values(this.#hostList)
                    .filter(host => hostForUpdate.includes(host.id))
                    .forEach(host => {
                        Object.keys(host.triggers).forEach(triggerId => hostTriggerMap[triggerId] = host.id);
                    });

                // Prepare problem list
                const problemList = {};
                problemListData.reduce((problemList, nextProblem) => {
                    const hostId = hostTriggerMap[nextProblem['objectid']];
                    if (!problemList.hasOwnProperty(hostId)) {
                        problemList[hostId] = [];
                    }
                    problemList[hostId].push(nextProblem);

                    return problemList;
                }, problemList);

                // Update problem
                for (let hostId in problemList) {
                    if (this.#hostList.hasOwnProperty(hostId)) {
                        this.#hostList[hostId].update({
                            problems: problemList[hostId],
                        });
                    }
                }
            });
    }
}

export default ProblemService;