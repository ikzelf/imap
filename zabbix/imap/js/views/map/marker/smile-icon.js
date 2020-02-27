class SmileIcon extends L.DivIcon {
    constructor({
                    isTriggered,
                    isMaintenance,
                    status,
                }) {

        let classNames = [
            'icon-status',
            `icon-status-smile-${status}`,
            `icon-status-${status}`,
        ];
        if (!isTriggered) {
            classNames.push('not-trigger');
        }

        if (isMaintenance) {
            classNames.push('maintenance');
        }

        super({
            className: classNames.join(' '),
            html: '',
            iconAnchor: [8, 8]
        });
    }

}

export default SmileIcon;