class ImageIcon extends L.DivIcon {
    constructor({
                    isTriggered,
                    isMaintenance,
                    status,
                    hardware,
                }) {
        let classNames = [
            'icon-status-img',
            `icon-status-${status}`,
        ];

        if (!isTriggered) {
            classNames.push('not-trigger');
        }

        if (isMaintenance) {
            classNames.push('maintenance');
        }

        let image = new Image();
        const statusGif = `/imap/images/status${status}.gif`;

        image.onerror = () => {
            image.src = statusGif;
        };

        image.src = hardware ? `/imap/hardware/${hardware}.png` : statusGif;

        super({
            className: classNames.join(' '),
            html: image,
            iconAnchor: [8, 8]
        });
    }

}

export default ImageIcon;