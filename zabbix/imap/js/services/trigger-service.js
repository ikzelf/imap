import {fetchTriggerList} from '../api/trigger';
import {__} from '../helpers';
import Trigger from '../models/trigger';
import eventBus from './bus';
import {NOTIFY_TRIGGER_REMOVED, NOTIFY_TRIGGER_UPDATED} from '../events';
import NotificationService from './notification';
import TriggerEvent from '../models/trigger-event';

class TriggerService {
    constructor(intervalTimeout) {
        this.intervalId = null;
        this.intervalTimeout = intervalTimeout * 1000;
        this.triggerList = {};
        this.hostList = {};

        this.loading = false;
    }

    refreshHostList(hostList) {
        this.hostList = hostList;

        return this;
    }

    stopInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }

        return this;
    }

    startInterval() {
        this.intervalId = setInterval(() => this.updateTriggerList(), this.intervalTimeout);

        return this;
    }


    updateTriggerList() {
        if (this.loading) {
            return;
        }

        this.loading = true;

        this.stopInterval();

        fetchTriggerList()
            .then(response => {
                if (response.data.error) {
                    NotificationService.error(response.data.error.message, __('Triggers'));
                    return;
                }
                this.prepareTriggerList(response.data);
            })
            .finally(() => {
                this.startInterval();
                this.loading = false;
            });
    }

    prepareTriggerList(newTriggerList) {
        let triggerIdList = Object.keys(newTriggerList);

        // remove old triggers
        Object.keys(this.triggerList)
            .filter(triggerId => !triggerIdList.include(triggerId))
            .forEach(triggerId => {
                let trigger = this.triggerList[triggerId];
                trigger.hosts.forEach(host => host.removeTrigger(triggerId));
                delete this.triggerList[triggerId];
                eventBus.emit(NOTIFY_TRIGGER_REMOVED, null, trigger);
            });

        triggerIdList.forEach(triggerId => {
            if (!this.triggerList.hasOwnProperty(triggerId)) {
                this.triggerList[triggerId] = new Trigger();
            }

            let triggerData = newTriggerList[triggerId];

            // Prepare hosts by host list
            triggerData.hosts = triggerData.hosts
                .filter(hostData => this.hostList.hasOwnProperty(hostData.hostid))
                .map(hostData => this.hostList[hostData.hostid]);

            if(triggerData.lastEvent) {
                triggerData.lastEvent = new TriggerEvent().load(triggerData.lastEvent);
            }

            const trigger = this.triggerList[triggerId];
            trigger.load(triggerData);

            triggerData.hosts.forEach(host => host.appendTrigger(trigger));

            eventBus.emit(NOTIFY_TRIGGER_UPDATED, null, trigger);
        });
    }
}

export default TriggerService;