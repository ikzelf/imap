import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {HOST_GET, HOST_UPDATE, PROBLEM_GET} from './methods';
import {buildHostListParams, buildHostUpdateParams} from './host';
import NotificationService from '../../services/notification';
import {__} from '../../helpers';
import {buildProblemListParams} from './problem';

/**
 * Integration with zabbix API.
 */
class ZabbixAPI {

    /**
     * {string}
     */
    #authKey;

    /**
     * Zabbix API
     * @param {string} authKey - auth key for Zabbix API
     * @param {string} zabbixURL - Zabbix URL.
     * @constructor
     */
    constructor(zabbixURL, authKey) {
        this.zabbixURL = `${zabbixURL}/api_jsonrpc.php`;
        this.#authKey = authKey;
    }

    /**
     * Fetch host list.
     * @return {Promise<axios.Response<T>>} - axios API response
     * @return {Array<Object>} - array of host data
     */
    async getHostList() {
        try {
            const response = await this.#request(HOST_GET, buildHostListParams());

            return response.data.result;
        } catch (e) {
            NotificationService.error(e, __('Hosts'));
            throw e;
        }
    }

    /**
     * Fetch problem for hosts.
     * @param {Array<number>} hostIds
     * @return {Promise<Array<{}>>}
     */
    async getProblemList(hostIds) {
        try {
            const response = await this.#request(PROBLEM_GET, buildProblemListParams(hostIds));

            return response.data.result;
        } catch (e) {
            NotificationService.error(e, __('Problems'));
            throw e;
        }
    }

    /**
     * Update host data.
     * @param {number} hostId
     * @param {{}} data
     * @return {Promise<void>}
     */
    async updateHostData(hostId, data) {
        try {
            const response = await this.#request(HOST_UPDATE, buildHostUpdateParams(hostId, data));

            return response.data.result;
        } catch (e) {
            NotificationService.error(e, __('Hosts'));
            throw e;
        }
    }

    /**
     * Make request to Zabbix API.
     * @param {string} method
     * @param {Object} params
     * @return {Promise<axios.Response<T>>}
     */
    async #request(method, params) {
        const data = {
            jsonrpc: '2.0',
            auth: this.#authKey,
            method: method,
            id: uuidv4(),
            params: params,
        };

        let response;
        try {
            response = await axios.post(this.zabbixURL, data);
        } catch (e) {
            throw new ZabbixAPIException(e.message);
        }

        if (response.data.error) {
            throw new ZabbixAPIException(response.data.error.data, response.data.error.message, response.data.error.code);
        }

        return response;
    }
}

/**
 * Zabbix API exception
 */
class ZabbixAPIException extends Error {

    /**
     * Exception constructor.
     *
     * @param {string} message
     * @param {string} [title]
     * @param {number} [code]
     */
    constructor(message, title, code) {
        super();

        this.name = 'ZabbixAPIException';
        this.message = message;
        this.code = code;
        this.title = title;
    }


    toString() {
        return `[${this.code}] ${this.title}: ${this.message}`;
    }
}


export default ZabbixAPI;