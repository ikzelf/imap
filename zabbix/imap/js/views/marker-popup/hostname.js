class HostNameElement {
    constructor(host, parent, {
        showIcons
    }) {
        this.showIcons = showIcons;

        this.element = L.DomUtil.create('div', 'hostname', parent);

        this.refresh(host);
    }

    refresh(host) {
        this.element.innerHTML = '';

        if (host.hardware && this.showIcons) {
            let image = L.DomUtil.create('img', 'hardwareIcon', this.element);
            image.onerror = () => {
                image.src = 'imap/hardware/none.png';
            };
            image.setAttribute('title', hardware);
            image.setAttribute('src', `imap/hardware/${hardware}.png`);
        }


        if (Array.isArray(host.scripts) && host.scripts.length > 0) {
            let linkMenu = L.DomUtil.create('span', 'link_menu', this.element);
            linkMenu.innerText = host.name;
            let scripts = [];

            host.scripts.forEach(script => {
                scripts.push({
                    'name': script.name + '',
                    'scriptid': script.scriptid,
                    'confirmation': '',
                });
            });

            linkMenu.setAttribute('data-menu-popup', JSON.stringify({
                'type': 'host',
                'data': {
                    'hostid': host.hostid,
                    'showGraphs': true,
                    'showScreens': true,
                    'showTriggers': true,
                    'hasGoTo': true,
                    'scripts': scripts,
                },
            }));
        } else {
            this.element.append(host.name);
        }
    }
}

export default HostNameElement;