import eventBus from '../../services/bus';
import {SHOW_CONTEXT_MENU} from '../../events';
import 'leaflet';
import {__} from '../../helpers';

class Map extends L.Map {

    constructor(settings) {
        super('map-container', {
            maxZoom: 18,
            fadeAnimation: settings.mapAnimation,
            zoomAnimation: settings.mapAnimation,
            markerZoomAnimation: settings.mapAnimation,
            zoomControl: false,
            attributionControl: false
        });

        this.setView(settings.startCoordinates, settings.startZoom);

        this.initEvents();

        this.checkSize();

    }

    initEvents() {
        // this.on('contextmenu', (e) => this.onContextMenu(e.originalEvent, e.latlng));
    }

    onContextMenu(event, latLng) {
        let items = [];

        let data = [
            {
                label: `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`,
                items: items,
            },
        ];

        eventBus.emit(SHOW_CONTEXT_MENU, null, data, event);
    }


    checkSize() {
        let windowHeight = window.innerHeight;
        let footerHeight = (document.getElementsByTagName('footer')[0] || {}).clientHeight || 0;
        let workAreaTop = (document.getElementById('imapify-work-area') || {}).offsetTop || 0;
        let messageHeight = (document.querySelector('.msg-bad') || {}).clientHeight || 0;

        const newHeight = windowHeight - footerHeight - workAreaTop - messageHeight;

        if (this._container.clientHeight !== newHeight) {
            this._container.style.height = `${newHeight}px`;
            this.invalidateSize();
        }

        document.getElementsByTagName('body')[0].style.marginBottom = '0';

        // TODO: fire event and add listeners
        let lastTrigger = document.querySelector('.last_triggers_div');
        if (lastTrigger) {
            lastTrigger.style.maxHeight = `${newHeight * 0.7}px`;
        }

        let hostsList = document.getElementById('hosts_list');
        if (hostsList) {
            hostsList.style.maxHeight = `${newHeight * 0.7}px`;
        }
    }


    /**
     * Select coordinates from map.
     *
     * @param {string} message
     * @return {Promise<{number, number}>}
     */
    getCoordinates(message = '') {
        return new Promise((resolve, reject) => {
            this.off('click');
            let messageElement = L.DomUtil.create('div', '', document.getElementById('imapify-messages'));
            messageElement.append(`${__('Select a position')}` + (message ? ` ${message}` : ''));
            let cancelButton = L.DomUtil.create('button', '', messageElement);
            cancelButton.innerText = __('Cancel');
            cancelButton.style.color = 'red';
            this._container.style.cursor = 'crosshair';

            const clear = () => {
                this.off('click');
                this._container.style.cursor = '';
                messageElement.remove();
            };

            this.on('click', (e) => {
                clear();
                resolve({lat: e.latlng.lat, lng: e.latlng.lng});
            });

            L.DomEvent.on(cancelButton, 'click', () => {
                clear();
                reject();
            });
        });
    }
}

export default Map;

