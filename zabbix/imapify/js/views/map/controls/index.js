import MyLocationControl from './my-location-button';
import {maps, overlays} from '../../../map/layers';
import HostListControl from './host-list-control';


class Controls {
    static #cornerPositions = {
        0: 'topleft',
        1: 'topright',
        2: 'bottomright',
        3: 'bottomleft',
    };
    #hostListControl;

    constructor({mapCorners, settings, filter}) {
        this.attribution = L.control.attribution({
            position: Controls.#getCornerPosition(mapCorners.attribution)
        });

        // this.scale = L.control.scale({
        //     position: Controls.#getCornerPosition(mapCorners.scale),
        //     metric: true
        // });

        // this.measure = L.control.measure({
        //     position: Controls.#getCornerPosition(mapCorners.measure)
        // });

        this.#hostListControl = new HostListControl(Controls.#getCornerPosition(mapCorners.hosts));

        // TODO: restore
        // this.lastTriggers = new LastTriggers(Controls.#getCornerPosition(mapCorners.lastTriggers));

        this.myLocationButton = new MyLocationControl(Controls.#getCornerPosition(mapCorners.myLocationButton));

        // const zoomPosition = Controls.#getCornerPosition(mapCorners.zoom);
        //
        // this.zoom = settings.useZoomSlider ? new L.Control.Zoomslider({position: zoomPosition})
        //     : L.control.zoom({position: zoomPosition});

        this.layers = L.control.layers(maps, overlays, {position: Controls.#getCornerPosition(mapCorners.layers)});
    }

    static #getCornerPosition(positionIndex) {
        return Controls.#cornerPositions[positionIndex] || Controls.#cornerPositions[0];
    }

    appendToMap(map) {
        this.attribution.addTo(map);
        // this.scale.addTo(map);
        // this.measure.addTo(map);

        this.#hostListControl.addTo(map);

        // TODO: restore
        // this.lastTriggers.addTo(map);
        this.myLocationButton.addTo(map);
        // this.zoom.addTo(map);

        this.layers.addTo(map);
    }
}

export default Controls;