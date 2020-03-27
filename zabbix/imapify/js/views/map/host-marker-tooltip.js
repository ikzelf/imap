/**
 * Marker tooltip
 */
class HostMarkerTooltip extends L.Tooltip {

    /**
     * Tooltip constructor.
     * @param {boolean} [permanent]
     */
    constructor(permanent = false) {
        super({
            offset: [-12, 0],
            direction: 'left',
            permanent: permanent,
        });
    }

    /**
     * @param {string} hostName
     */
    updateContent(hostName) {
        let labelContent = L.DomUtil.create('div', '');
        labelContent.append(hostName);

        this.setContent(labelContent);
    }
}

export default HostMarkerTooltip;