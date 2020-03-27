import Map from './views/map/map';
import Controls from './views/map/controls';
import {__, getCookie, setCookie} from './helpers';

import LastUpdateService from './services/last-update';
import MapResizeService from './services/map-resize';
import eventBus from './services/bus';
import MarkerClusterGroup from './views/map/layers/marker-cluster-group';
import GlobalServices from './services/global';
import {APP_LOADED, NOTIFY_LINK_LAYER_UPDATED} from './events';
import {DEFAULT_MAP_CORNERS, DEFAULT_SETTINGS, ZOOM_METERS} from './settings';
import LinkLayerGroup from './views/map/layers/link-group';
import HostService from './services/host-service';
import NotificationService from './services/notification';
import StaffService from './services/staff-service';
import StaffClusterGroup from './views/map/layers/staff-cluster-group';
import * as moment from 'moment';
import ZabbixAPI from './api/zabbix';
import ProblemService from './services/problem-service';

class IMapify {
    settings = DEFAULT_SETTINGS;

    // Фильтр для отбора хостов и групп
    filter = {
        showSeverity: 0,
        hostId: null,
        groupId: null,
    };

    version = null;
    zabbixVersion = null;

    markersList = {};
    bbox = false;
    vars = {
        it_first: true,
        timeoutHostSearch2: false,
    };
    messages = {
        count: 0,
        text: {},
    };

    constructor(externalOptions) {
        Object.assign(this, externalOptions);
        this.mapCorners = Object.assign({}, DEFAULT_MAP_CORNERS, externalOptions.mapCorners);
    }

    init() {
        // TODO: API to fetch and renew token
        const zabbixAPI = new ZabbixAPI(window.location.origin, window['_imapify_token']);
        delete window['_imapify_token'];

        // TODO: remove this
        console.log('zabbixAPI', zabbixAPI);

        this.map = new Map(this.settings);

        moment.locale(this.settings.lang);

        this.markers = new MarkerClusterGroup({
            spiderfyDistanceMultiplier: this.settings.spiderfyDistanceMultiplier,
        });

        this.markers.on('clustercontextmenu', (a) => {
            if ((a.layer._childCount < this.settings.maxMarkersSpiderfy) || (this.map.getMaxZoom() === this.map.getZoom())) {
                a.layer.spiderfy();
            } else {
                a.layer.zoomToBounds();
            }
        });


        this.links = new LinkLayerGroup(this.markers);

        this.controls = new Controls({
            mapCorners: this.mapCorners,
            settings: this.settings,
            filter: this.filter
        });

        this.map.on('moveend', () => eventBus.emit(NOTIFY_LINK_LAYER_UPDATED));
        this.map.on('zoomend', () => eventBus.emit(NOTIFY_LINK_LAYER_UPDATED));
        this.map.on('layerremove', (event) => this.onLayerRemove(event));

        this.map.on('layeradd', (event) => this.onLayerAdd(event));

        this.controls.appendToMap(this.map);

        let layerSelector = document.querySelector('.leaflet-control-layers-selector');
        L.DomEvent.on(layerSelector, 'change', (event) => this.saveLayersMap(event), this);

        this.map.on('overlayremove', () => this.onUpdateOverlay());
        this.map.on('overlayadd', () => this.onUpdateOverlay());
        this.map.on('baselayerchange', event => this.onBaseLayerChange(event));

        this.staffLayer = null;
        if (imapify.settings.staffApi.enable) {
            new StaffService().run();

            this.staffLayer = new StaffClusterGroup();
        }

        this.setLayersMap();

        eventBus.on('update-lines-marker', (hostId) => this.updateLinesMarker(hostId));
        eventBus.on('update-line', (line) => this.updateLine(line));


        new LastUpdateService().run();
        new MapResizeService({map: this.map}).run();

        GlobalServices.init({
            map: this.map,
            lang: this.settings.lang,
        });


        // Init Services
        new HostService(zabbixAPI, this.settings.hostUpdateInterval);
        new ProblemService(zabbixAPI, this.settings.problemUpdateInterval);

        // const triggerService = new TriggerService(this.settings.problemUpdateInterval);
        // const linkService = new LinkService(this.links);
        //
        // // Always after loaded
        // eventBus.on(NOTIFY_HOST_SUCCESSFULLY_LOADED, (hostList) => {
        //     triggerService.refreshHostList(hostList);
        //
        //     linkService.refreshHostList(hostList);
        //     if (this.settings.linksEnabled) {
        //         linkService.updateLinkList();
        //     }
        // });
        //
        // // First boot
        // eventBus.once(NOTIFY_HOST_SUCCESSFULLY_LOADED, (hostList) => {
        //     triggerService.updateTriggerList();
        // });
        //
        // eventBus.on(MOVE_TO_HOST, (host, openPopup) => this.viewHostOnMap(this.map, host, openPopup));

        // Notify all, App was loaded.
        eventBus.emit(APP_LOADED);
    }


    viewHostOnMap(map, host, openPopup) {
        let marker = this.markers.markerList[host.hostid];
        if (!marker) {
            NotificationService.error(__('Host not loaded'), host.name);
            return;
        }

        map.setView(marker.getLatLng(), map.getMaxZoom());

        if (!!openPopup) {
            marker.openPopup();
        }
    }

    setLayersMap() {
        let layerNames = getCookie('imap_layer') || '';
        let isBaseLayer = false;
        layerNames = layerNames.split('|*|');

        if (this.settings.startBaseLayer) {
            for (let layerId in this.controls.layers._layers) {
                if (this.controls.layers._layers.hasOwnProperty(layerId)) {
                    let layer = this.controls.layers._layers[layerId];
                    if (layer.name === this.settings.startBaseLayer) {
                        this.map.addLayer(layer.layer);
                        isBaseLayer = true;
                        break;
                    }
                }
            }
        }

        for (let layerNameIndex in layerNames) {
            if (layerNames.hasOwnProperty(layerNameIndex)) {
                for (let layerId in this.controls.layers._layers) {
                    if (this.controls.layers._layers.hasOwnProperty(layerId)) {
                        let layer = this.controls.layers._layers[layerId];
                        if (layerNames[layerNameIndex] === layer.name) {
                            if (layer.overlay !== true) {
                                if (isBaseLayer) {
                                    continue;
                                }

                                isBaseLayer = true;
                            }
                            this.map.addLayer(layer.layer);
                        }
                    }
                }
            }
        }

        if (!isBaseLayer) {
            // TODO: duplicate code with startBaseLayer
            for (let layerId in this.controls.layers._layers) {
                if (this.controls.layers._layers.hasOwnProperty(layerId)) {
                    let layer = this.controls.layers._layers[layerId];
                    if (layer.name === this.settings.defaultBaseLayer) {
                        this.map.addLayer(layer.layer);
                        isBaseLayer = true;
                        break;
                    }
                }
            }
        }

        if (!isBaseLayer) {
            for (let layerId in this.controls.layers._layers) {
                if (this.controls.layers._layers.hasOwnProperty(layerId)) {
                    let layer = this.controls.layers._layers[layerId];
                    if (layer.overlay !== true) {
                        this.map.addLayer(layer.layer);
                        isBaseLayer = true;
                        break;
                    }
                }
            }
        }
        this.map.addLayer(this.markers);
        // TODO: enable layer
        // this.map.addLayer(this.links);

        this.controls.layers.addOverlay(this.markers, __('Hosts'));

        if (this.settings.linksEnabled) {
            this.controls.layers.addOverlay(this.links, __('Host\'s links'));
        }

        if (this.staffLayer) {
            // TODO: enable layer
            // this.map.addLayer(this.staffLayer);
            this.controls.layers.addOverlay(this.staffLayer, __('Staffs'));
        }
    }

    onLayerRemove(event) {
        if (event.layer.options) {
            if (event.layer.options.host_id) {
                this.updateLinesMarker(event.layer.options.host_id);
            }
        }
    }

    onLayerAdd(event) {
        if (event.layer.options) {
            if (event.layer.options.host_id) {
                this.updateLinesMarker(event.layer.options.host_id);
            }
        }
    }

    onUpdateOverlay() {
        eventBus.emit(NOTIFY_LINK_LAYER_UPDATED);
        this.saveLayersMap();
    }


    onBaseLayerChange(event) {
        /*this.map.options.maxZoom=event.layer.options.maxZoom;*/
        this.saveLayersMap(event.name);
    }

    saveLayersMap(layerName) {
        let text = '';

        let baseLayer = '';

        for (let layerId in this.controls.layers._layers) {
            if (this.controls.layers._layers.hasOwnProperty(layerId)) {
                let layer = this.controls.layers._layers[layerId];
                if (this.map.hasLayer(layer.layer)) {
                    if (layer.overlay !== true) {
                        baseLayer = layer.name;
                    } else {
                        text = text + layer.name + '|*|';
                    }
                }
            }
        }

        if (typeof layerName !== 'undefined') {
            baseLayer = layerName;
        }

        text = text + baseLayer + '|*|';

        setCookie('imap_layer', text, {expires: 36000000, path: '/'});
    }

    updateLinesMarker(hostId) {
        if (!this.settings.linksEnabled) {
            return;
        }

        for (let lineId in this.lines) {
            if (this.lines.hasOwnProperty(lineId)) {
                if ((hostId === this.lines[lineId][0]) || (hostId === this.lines[lineId][1])) {
                    this.updateLine(lineId);
                }
            }
        }
    }

    /* обновляем линию связи */
    updateLine(line) {
        if (!this.settings.linksEnabled) {
            return;
        }

        let markerHost1 = line.host1,
            markerHost2 = line.host2;

        if (markerHost1 && markerHost1.marker && markerHost2 && markerHost2.marker
            && this.markers.hasLayer(markerHost1.marker) && this.markers.hasLayer(markerHost2.marker)
            && (this.markers.getVisibleParent(markerHost1.marker) || this.markers.getVisibleParent(markerHost2.marker))
            && this.markers.getVisibleParent(markerHost1.marker) !== this.markers.getVisibleParent(markerHost2.marker)) {

            line.polyline.getLatLngs().splice(0, 2);
            line.polyline.addLatLng(markerHost1.marker._latlng);
            line.polyline.addLatLng(markerHost2.marker._latlng);

            if (markerHost1.marker._latlng.distanceTo(markerHost2.marker._latlng) > ZOOM_METERS[this.map.getZoom()]) {
                if (!this.links.hasLayer(line.polyline)) {
                    this.links.addLayer(line.polyline);
                }
                return;
            }
        }
        this.links.removeLayer(line.polyline);
    }

}

const imapify = new IMapify(window._imap);


export default imapify;
