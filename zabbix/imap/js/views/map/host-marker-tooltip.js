class HostMarkerTooltip extends L.Tooltip {
    constructor({showMarkersLabels, useIconsInMarkers}) {
        super({
            offset: [-12, 0],
            direction: 'left',
            permanent: showMarkersLabels,
        });

        this.useIconsInMarkers = useIconsInMarkers;
    }

    /**
     * @param marker {HostMarker}
     */
    updateContent(marker) {
        let labelContent = L.DomUtil.create('div', '');
        if (this.useIconsInMarkers) {
            let image = new Image();
            image.style.maxHeight = '1.5em';

            const failBackIcon = `imap/images/status${marker.status}.gif`;
            image.onerror = () => {
                image.src = failBackIcon;
            };
            image.src = marker.hardware ? `imap/hardware/${marker.hardware}.png` : failBackIcon;

            labelContent.append(image);
        }
        labelContent.append(marker.hostName);

        this.setContent(labelContent);
    }
}

export default HostMarkerTooltip;