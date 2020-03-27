import {__, getPosition} from '../../../helpers';

class MyLocationControl extends L.Control {
    constructor(position) {
        super({position: position});
    }

    onAdd(map) {
        // create the control container with a particular class name
        let container = L.DomUtil.create('div', 'my-location-control leaflet-control-layers');

        let button = L.DomUtil.create('a', '', container);
        button.title = __('My location');
        button.setAttribute('href', '#');

        L.DomEvent.on(button, 'click', (event) => this.onMyLocation(event, map), this);

        return container;
    }

    onMyLocation(event, map) {
        event.preventDefault();

        getPosition((position) => this.showPosition(map, position));
    }

    showPosition(map, position) {
        map.setView([position.coords.latitude, position.coords.longitude], map.getMaxZoom());
    }

}

export default MyLocationControl;


