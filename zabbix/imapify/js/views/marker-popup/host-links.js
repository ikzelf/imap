class HostLinksElement {
    constructor(host, parent) {
        // TODO: test me
        this.element = L.DomUtil.create('div', 'host_links', parent);

        this.refresh(host);
    }

    static buildLink(href, title) {
        let link = L.DomUtil.create('div', 'link');

        let a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('target', '_blank');
        a.innerText = title;

        link.append(a);

        return link;
    }

    refresh(host) {
        this.element.innerHTML = '';
        if (!host.inventory) {
            return;
        }

        if (host.inventory.url_a) {
            this.element.append(HostLinksElement.buildLink(host.inventory.url_a, 'URL A'));
        }
        if (host.inventory.url_b) {
            this.element.append(HostLinksElement.buildLink(host.inventory.url_b, 'URL B'));
        }
        if (host.inventory.url_c) {
            this.element.append(HostLinksElement.buildLink(host.inventory.url_c, 'URL C'));
        }
    }
}

export default HostLinksElement;