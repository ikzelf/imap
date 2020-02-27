import eventBus from '../bus';
import {OPEN_GOOGLE_STREET_VIEW} from '../../events';
import NotificationService from '../notification';
import {__, getCookie, setCookie} from '../../helpers';


class GoogleStreetViewService {

    constructor(map) {
        this.map = map;
        this.google = window.google;
        this.isAvailable = !!this.google;

        this.viewer = null;
        this.marker = null;
        this.dialogueId = null;

        eventBus.on(OPEN_GOOGLE_STREET_VIEW, latLng => this.open(latLng));

        jQuery.subscribe('overlay.close', (event, data) => {
            if(data.dialogueid === this.dialogueId) {
                this.destroy();
            }
        });

    }

    create(latLng) {
        let googleStreetViewer = L.DomUtil.create('div');
        googleStreetViewer.setAttribute('id', 'googlestreetview');

        let panoramaOptions = {
            pov: {
                heading: 0,
                pitch: 0
            }
        };
        let width = 500;
        let height = 300;

        let cookieSizes = getCookie('imap_googlestreetview_size');
        if (cookieSizes) {
            cookieSizes = cookieSizes.split(',');
            width = parseFloat(cookieSizes[0]);
            height = parseFloat(cookieSizes[1]);
        }

        googleStreetViewer.style.width = `${width}px`;
        googleStreetViewer.style.height = `${height}px`;

        this.dialogueId = getOverlayDialogueId();
        overlayDialogue({
            'dialogueid': this.dialogueId,
            'title': __('Google Street View'),
            'content': googleStreetViewer,
        }, this, undefined);

        this.viewer = new google.maps.StreetViewPanorama(googleStreetViewer, panoramaOptions);
        this.viewer.setPosition(latLng);

        google.maps.event.addListener(this.viewer, 'position_changed', () => this.onViewMove());
        google.maps.event.addListener(this.viewer, 'pov_changed', () => this.onViewRotate());

        let icon = L.divIcon({
            className: 'googlestreetview_marker',
            html: '',
            iconSize: [50, 50],
            iconAnchor: [25, 31]
        });

        this.marker = L.marker(app.imap.map.getCenter(), {
            draggable: true,
            icon: icon
        }).addTo(app.imap.map);

        this.marker.on('dragend', (event) => this.open(event.target.getLatLng()));
    }

    destroy() {
        this.map.removeLayer(this.marker);
        this.viewer = null;
        this.marker = null;
    }

    /**
     *
     * @param latLng
     */
    open(latLng) {
        if (!this.isAvailable) {
            NotificationService.warn(__('Google service isn\'t available'));
            return;
        }

        let streetViewService = new this.google.maps.StreetViewService();
        streetViewService.getPanoramaByLocation(new google.maps.LatLng(latLng.lat, latLng.lng), 50, (data, status) => {
            if (status !== google.maps.StreetViewStatus.OK) {
                if (this.viewer && this.marker) {
                    this.marker.setLatLng([
                        this.viewer.getPosition().lat(), this.viewer.getPosition().lng(),
                    ]);
                }
            } else {
                if (!this.viewer) {
                    this.create(data.location.latLng);
                }
                this.viewer.setPosition(data.location.latLng);
            }
        });
    }


    onViewMove() {
        if (this.viewer) {
            this.marker.setLatLng([this.viewer.getPosition().lat(), this.viewer.getPosition().lng()]);
        }
    }

    onViewRotate() {
        if (this.viewer) {
            let heading = this.viewer.getPov().heading;
            heading = heading - 24;
            heading = heading % 360;
            if (heading < 0) {
                heading = 360 + heading;
            }

            heading = 360 - heading;
            let sm = 52 * (Math.round(heading / 24));
            $(this.marker._icon).css('background-position', '0px ' + sm + 'px');
        }
    }

    onViewResize() {
        if (this.viewer) {
            setCookie('imap_googlestreetview_size', $(this.viewer.b).width() + ',' + $(this.viewer.b).height(), {
                expires: 36000000,
                path: '/'
            });
            google.maps.event.trigger(this.viewer, 'resize');
        }
    }
}

export default GoogleStreetViewService;