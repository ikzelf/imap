/**
 * Cluster marker icon.
 */
class ClusterMarkerIcon extends L.DivIcon {

    /**
     * Constructor.
     * @param {string} priority
     * @param {number} ok
     * @param {number} problem
     * @param {number} maintenance
     */
    constructor({
                    priority,
                    counters: {
                        ok,
                        problem,
                        maintenance,
                    },
                }) {
        super({
            className: `icon-status-cluster icon-status-${priority}`,
            html: `<span class="status-ok">${ok}/</span>` +
                `<span class="status-problem">${problem}/</span>` +
                `<span class="status-maintenance">${maintenance}</span>`,
            iconAnchor: [14, 14]
        });
    }
}

export default ClusterMarkerIcon;