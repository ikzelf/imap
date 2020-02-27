const INTERFACE_TYPES = {
    '1': 'Agent',
    '2': 'SNMP',
    '3': 'IPMI',
    '4': 'JMX'
};

class HostInterfacesElement {
    constructor(host, parent) {
        this.element = L.DomUtil.create('div', 'host-interfaces', parent);

        this.refresh(host);
    }

    refresh(host) {
        this.element.innerHTML = '';

        if (Array.isArray(host.interfaces) && host.interfaces.length > 0) {
            host.interfaces.forEach(hostInterface => {
                let interfaceLine = L.DomUtil.create('div', 'host_interfaces_line', this.element);

                let address;
                if ((hostInterface.useip === '1') && (hostInterface.ip !== '')) {
                    address = hostInterface.ip;
                } else if (hostInterface.dns) {
                    address = hostInterface.dns;
                } else {
                    address = 'unknown';
                }

                interfaceLine.innerHTML = `<b>${INTERFACE_TYPES[hostInterface.type]}</b> ${address}:${hostInterface.port}`;
            });
        }
    }

}

export default HostInterfacesElement;