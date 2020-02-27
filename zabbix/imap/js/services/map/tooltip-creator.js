import HostMarkerTooltip from '../../views/map/host-marker-tooltip';

class TooltipCreator {
    constructor({showMarkersLabels, useIconsInMarkers}) {
        this.showMarkersLabels = showMarkersLabels;
        this.useIconsInMarkers = useIconsInMarkers;
    }

    buildEmptyTooltip() {
        return new HostMarkerTooltip({
            showMarkersLabels: this.showMarkersLabels,
            useIconsInMarkers: this.useIconsInMarkers,
        });
    }

}

export default TooltipCreator;