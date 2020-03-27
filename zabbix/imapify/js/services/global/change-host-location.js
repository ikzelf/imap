import eventBus from '../bus';
import {__} from '../../helpers';
import {updateHostLocation} from '../../api/host';
import NotificationService from '../notification';
import {NOTIFY_NEW_HOST_INFORMATION, WANT_CHANGE_HOST_LOCATION} from '../../events';

class ChangeHostLocationService {
    constructor(map) {
        this.map = map;

        eventBus.on(WANT_CHANGE_HOST_LOCATION, (host) => this.getNewLocation(host));
    }

    getNewLocation(host) {
        this.map.off('click');

        this.element = L.DomUtil.create('div', '', document.getElementById('imapify-messages'));
        this.element.append(`${__('Select a new position')} (${host.name}) `);

        let cancelButton = L.DomUtil.create('button', '', this.element);
        cancelButton.innerText = __('Cancel');
        cancelButton.on('click', () => this.cancel());
        cancelButton.style.color = 'red';

        this.map._container.style.cursor = 'crosshair';

        this.map.on('click', (e) => this.setLocation(host, e.latlng.lat, e.latlng.lng));
    }

    cancel() {
        this.map.off('click');
        this.map._container.style.cursor = '';

        this.element.remove();
        this.element = null;
    }

    setLocation(host, lat, lng) {
        this.cancel();
        updateHostLocation(host.hostid, lat, lng)
            .then((response) => {
                let data = response.data;
                if (data.result) {
                    eventBus.emit(NOTIFY_NEW_HOST_INFORMATION, null, host.hostid, data.result);
                } else {
                    NotificationService.error(__('Failed to update data'), __('Error'));
                }
            });
    }

}

export default ChangeHostLocationService;