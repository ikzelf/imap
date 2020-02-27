import {__} from '../../helpers';
import eventBus from '../../services/bus';
import {OPEN_GOOGLE_STREET_VIEW, SHOW_CONTEXT_MENU} from '../../events';

class Map extends L.Map {
    constructor(settings) {
        super('mapdiv', {
            maxZoom: 18,
            fadeAnimation: settings.mapAnimation,
            zoomAnimation: settings.mapAnimation,
            markerZoomAnimation: settings.mapAnimation,
            zoomControl: false,
            attributionControl: false
        });

        this.setView(settings.startCoordinates, settings.startZoom);
        this.weatherApiKey = settings.weatherApiKey;

        this.initEvents();

        this.checkSize();

    }

    initEvents() {
        this.on('contextmenu', (e) => this.onContextMenu(e.originalEvent, e.latlng));
    }

    onContextMenu(event, latLng) {
        let items = [
            {
                label: __('Google street view'),
                clickCallback: () => {
                    eventBus.emit(OPEN_GOOGLE_STREET_VIEW, null, {lat: latLng.lat, lng: latLng.lng});
                },
            },
        ];

        if (this.weatherApiKey !== '-') {
            items.push({
                label: __('Show weather'),
                clickCallback: () => {
                    // TODO: openweathermap
                    console.log('TODO: openweathermap');
                    openweathermap({lat: latLng.lat, lng: latLng.lng});
                    return false;
                }
            });
        }

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
        let workAreaTop = (document.getElementById('imapworkarea') || {}).offsetTop || 0;
        let messageHeight = (document.querySelector('.msg-bad') || {}).clientHeight || 0;

        const newHeight = windowHeight - footerHeight - workAreaTop - messageHeight;

        if (this._container.clientHeight !== newHeight) {
            this._container.style.height = `${newHeight}px`;
            this.invalidateSize();

            // TODO: doMapControl
            // if (app.imap.settings.doMapControl) {
            //     mapBbox();
            // }
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
}

export default Map;

