import {__, getCookie, setCookie} from '../../../helpers';
import eventBus from '../../../services/bus';
import filter from '../../../models/filter';
import {MOVE_TO_HOST, NOTIFY_TRIGGER_REMOVED, NOTIFY_TRIGGER_UPDATED} from '../../../events';

class LastTriggers extends L.Control {
    constructor(position) {
        super({position: position});

        this.triggerElements = {};

        eventBus.on(NOTIFY_TRIGGER_UPDATED, (trigger) => {
            if (trigger.value === 1 && trigger.priority > filter.showSeverity && trigger.hasHost()) {
                this.addTrigger(trigger);
            } else {
                this.removeTrigger(trigger);
            }
        });
        eventBus.on(NOTIFY_TRIGGER_REMOVED, (trigger) => this.removeTrigger(trigger));
    }

    onAdd(map) {
        // create the control container with a particular class name
        let container = L.DomUtil.create('div', 'last_triggers');
        container.setAttribute('aria-haspopup', 'true');

        this.lastTriggersCap = L.DomUtil.create('div', 'last_triggers_cap', container);
        this.lastTriggersCap.innerText = __('Triggers');

        this.lastTriggersDiv = L.DomUtil.create('div', 'nicescroll last_triggers_div', container);

        L.DomEvent.on(container, 'mouseleave', () => this.mouseLeave(map), this)
            .on(container, 'mouseover', () => this.mouseOver(map), this);

        this.lastTriggersSortType = L.DomUtil.create('select', 'last_triggers_sort_type', container);
        this.lastTriggersSortType.innerHTML = `<option value="status" selected>${__('Sort by severity')}</option><option value="time">${__('Sort by time')}</option>`;
        let cookieValue = getCookie('imap_lasttriggers_sorttype');
        if (cookieValue) {
            this.lastTriggersSortType.value = cookieValue;
        }
        L.DomEvent.on(this.lastTriggersSortType, 'change', () => {
            this.sorting();
            setCookie('imap_lasttriggers_sorttype', this.lastTriggersSortType.value, {expires: 36000000, path: '/'});
        }, this);


        this.lastTriggersKeep = L.DomUtil.create('div', 'last_triggers_keep', container);

        let keepLabel = L.DomUtil.create('label', '', this.lastTriggersKeep);
        keepLabel.innerText = __('Keep');

        this.lastTriggersKeepInput = L.DomUtil.create('input', 'last_triggers_keep_input', keepLabel);
        this.lastTriggersKeepInput.type = 'checkbox';
        this.lastTriggersKeepInput.checked = getCookie('imap_lasttriggers_keep') === 'true';
        L.DomEvent.on(this.lastTriggersKeepInput, 'change', this.keep, this);

        L.DomEvent
            .on(container, 'click', this.onClick, this)
            .on(container, 'dblclick', this.onDblClick, this)
            .on(container, 'mousemove', this.onMouseMove, this)
            .on(container, 'scroll', this.onScroll, this)
        ;

        this.container = container;
        this.mouseLeave(map);

        return container;
    }

    keep(event) {
        setCookie('imap_lasttriggers_keep', event.currentTarget.checked, {expires: 36000000, path: '/'});
    }

    mouseLeave(map) {
        this.lastTriggersCap.style.display = 'none';
        if (!this.lastTriggersKeepInput.checked) {
            this.lastTriggersCap.style.display = 'block';
            this.lastTriggersDiv.style.display = 'none';
            this.lastTriggersKeep.style.display = 'none';
            this.lastTriggersSortType.style.display = 'none';
        }

        map.scrollWheelZoom.enable();
    }

    mouseOver(map) {
        this.lastTriggersDiv.style.display = ' block';
        this.lastTriggersCap.style.display = 'none';
        this.lastTriggersKeep.style.display = 'none';
        this.lastTriggersSortType.style.display = 'block';

        map.scrollWheelZoom.disable();
    }

    addTrigger(trigger) {
        this.removeTrigger(trigger);

        let container = L.DomUtil.create('div', `trigger triggerst${trigger.priority}`, this.lastTriggersDiv);

        this.triggerElements[trigger.id] = container;

        container.setAttribute('id', 'lasttrigger' + trigger.triggerid);
        container.setAttribute('status', trigger.priority);
        container.setAttribute('time', trigger.lastchange);

        let linkMenuContainer = L.DomUtil.create('div', '', container);
        let linkMenu = L.DomUtil.create('span', 'link_menu', linkMenuContainer);
        linkMenu.innerText = trigger.hosts.map(host => host.name).join('; ');
        L.DomEvent.on(linkMenu, 'click', () => {
            eventBus.emit(MOVE_TO_HOST, null, trigger.hosts[0], true);
        });

        L.DomUtil.create('span', '', container).innerText = trigger.description;

        if (trigger.lastEvent && trigger.lastEvent.id) {
            let acknowledged = trigger.lastEvent.acknowledged === '1';

            let acknowledgeContainer = L.DomUtil.create('div', 'acknowledge', container);
            acknowledgeContainer.append(`${__('Ack')}: `);

            let a = L.DomUtil.create('a', acknowledged ? 'enabled' : 'disabled', acknowledgeContainer);
            a.setAttribute('target', '_blank');
            a.setAttribute('href', `zabbix.php?action=acknowledge.edit&eventids[]=${trigger.lastEvent.id}`);
            a.innerText = acknowledged ? __('Yes') : __('No')
        }

        L.DomUtil.create('div', 'lastchange', container)
            .setAttribute('lastchange', trigger.lastchange);

        this.sorting();
    }

    removeTrigger(trigger) {
        if (this.triggerElements.hasOwnProperty(trigger.id)) {
            this.triggerElements[trigger.id].remove();
            delete this.triggerElements[trigger.id];
        }
    }

    sorting() {
        let sortAttribute = this.lastTriggersSortType.value;
        Object.values(this.triggerElements)
            .sort((aElement, bElement) => {
                let a = aElement.getAttribute(sortAttribute) * 1;
                let b = bElement.getAttribute(sortAttribute) * 1;

                return a === b ? 0 : (-1 * (a - b));
            })
            .forEach(element => {
                element.remove();
                this.lastTriggersDiv.append(element);
            });
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

export default LastTriggers;