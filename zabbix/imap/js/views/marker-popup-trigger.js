import MarkerPopupActions from './marker-popup-actions';
import {__} from '../helpers';

class MarkerPopupTrigger {
    constructor(trigger, {debugEnabled}) {
        this.element = L.DomUtil.create('div', `trigger triggerst${trigger.priority}`);
        this.element.setAttribute('id', `trigger${trigger.triggerid}`);

        let linkMenu = L.DomUtil.create('span', 'link_menu', this.element);
        linkMenu.dataset.menuPopup = JSON.stringify({
            'type': 'trigger',
            'triggerid': trigger.triggerid,
            'showEvents': true
        });
        linkMenu.innerText = trigger.description;


        if (debugEnabled) {
            MarkerPopupActions.triggerDebugInfo(trigger, this.element);
        }

        let acknowledge = L.DomUtil.create('div', 'acknowledge', this.element);
        if (trigger.lastEvent.id) {
            let eventId = trigger.lastEvent.id;
            acknowledge.innerHTML = `${__('Ack')}: `;
            if (trigger.lastEvent.acknowledged === '1') {
                acknowledge.innerHTML += `<a class="enabled" target="_blank" href="zabbix.php?action=acknowledge.edit&eventids[]=${eventId}">${__('Yes')}</a>`;
            } else {
                acknowledge.innerHTML += `<a class="disabled" target="_blank" href="zabbix.php?action=acknowledge.edit&eventids[]=${eventId}">${__('No')}</a>`;
            }
        }

        let lastChange = L.DomUtil.create('div', 'lastchange', acknowledge);
        lastChange.setAttribute('lastchange', trigger.lastchange);
    }
}

export default MarkerPopupTrigger;