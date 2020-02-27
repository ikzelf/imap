import eventBus from '../bus';
import {loadHardwareList, setHardwareType} from '../../api/hardware';
import {__} from '../../helpers';
import NotificationService from '../notification';
import {NOTIFY_NEW_HOST_INFORMATION} from '../../events';

const makeLi = (hostId, name, image, onSet) => {
    let li = L.DomUtil.create('li', 'hardware-select');
    li.innerHTML = `<img alt="" width="20px" src="/imap/hardware/${image}"> ${name ? name : 'none'}`;
    L.DomEvent.on(li, 'click', () => {
        console.log('click li');
        onSet(name);
    });
    L.DomEvent.on(li, 'mouseover', () => {
        L.DomUtil.addClass(li, 'active');
    });
    L.DomEvent.on(li, 'mouseout', () => {
        L.DomUtil.removeClass(li, 'active');
    });

    return li;
};

class UpdateHardwareService {
    constructor() {
        eventBus.on('GetHardwareImagesService.update-list', (host) => this.updateList(host));
    }

    updateList(host) {
        loadHardwareList()
            .then(result => {
                if (result.data.result) {
                    let hardwareDialog = L.DomUtil.create('ul');
                    hardwareDialog.setAttribute('id', 'select-hardware-form');

                    hardwareDialog.append(makeLi(host.hostid, '', 'none.png', (value) => this.setHardware(host, value)));

                    result.data.result.forEach(image => {
                        let name = image.substring(0, -4);
                        hardwareDialog.append(makeLi(host.hostid, name, image, (value) => this.setHardware(host, value)));
                    });

                    this.dialogueId = getOverlayDialogueId();
                    overlayDialogue({
                        'dialogueid': this.dialogueId,
                        'title': __('Set a hardware type'),
                        'content': hardwareDialog,
                        'buttons': [
                            {
                                'title': __('Cancel'),
                                'class': 'btn-alt',
                                'action': function () {
                                }
                            }
                        ]
                    }, this, undefined);
                }
            });
    }

    setHardware(host, value) {
        setHardwareType(host.hostid, value)
            .then(_ => {
                overlayDialogueDestroy(this.dialogueId);
                NotificationService.info(__('Hardware type updated'));
                eventBus.emit(NOTIFY_NEW_HOST_INFORMATION, null, host.hostid, {hardware: value});
            });
    }

}

export default UpdateHardwareService;