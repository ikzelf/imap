class ClusterMarkerIcon extends L.DivIcon {
    constructor({
                    maxStatus,
                    counters: {
                        ok,
                        problem,
                        maintenance,
                    },
                }) {
        super({
            className: `icon-status-cluster icon-status-${maxStatus}`,
            html: `<span class="status-ok">${ok}/</span>` +
                `<span class="status-problem">${problem}/</span>` +
                `<span class="status-maintenance">${maintenance}</span>`,
            iconAnchor: [14, 14]
        });
    }
}

export default ClusterMarkerIcon;