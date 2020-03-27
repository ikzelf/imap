class HostNameElement {
    constructor(host, parent) {
        this.element = L.DomUtil.create('div', 'hostname', parent);

        this.refresh(host);
    }

    refresh(host) {
        this.element.innerHTML = '';

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