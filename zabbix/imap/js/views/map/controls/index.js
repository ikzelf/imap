import HostControl from './host';
import LastTriggers from './last-triggers';
import MyLocationControl from "./my-location-button";
import {maps, overlays} from "../../../map/layers";

class Controls {
    static cornerPositions = {
        0: 'topleft',
        1: 'topright',
        2: 'bottomright',
        3: 'bottomleft',
    };

    constructor({mapCorners, settings, filter}) {
        this.attribution = L.control.attribution({
            position: this.getPosition(mapCorners.attribution)
        });

        this.scale = L.control.scale({
            position: this.getPosition(mapCorners.scale),
            metric: true
        });

        this.measure = L.control.measure({
            position: this.getPosition(mapCorners.measure)
        });

        this.hosts = new HostControl(this.getPosition(mapCorners.hosts));

        this.lastTriggers = new LastTriggers(this.getPosition(mapCorners.lastTriggers));

        this.myLocationButton = new MyLocationControl(this.getPosition(mapCorners.myLocationButton));

        const zoomPosition = this.getPosition(mapCorners.zoom);

        this.zoom = settings.useZoomSlider ? new L.Control.Zoomslider({position: zoomPosition})
            : L.control.zoom({position: zoomPosition});

        this.layers = L.control.layers(maps, overlays, {position: this.getPosition(mapCorners.layers)});
    }

    appendToMap(map) {
        this.attribution.addTo(map);
        this.scale.addTo(map);
        this.measure.addTo(map);
        this.hosts.addTo(map);
        this.lastTriggers.addTo(map);
        this.myLocationButton.addTo(map);
        this.zoom.addTo(map);
        this.layers.addTo(map);
    }

    getPosition(positionIndex) {
        return Controls.cornerPositions[positionIndex] || Controls.cornerPositions[0];
    }
}

export default Controls;