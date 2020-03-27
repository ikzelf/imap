import {__} from '../helpers';
import eventBus from '../services/bus';
import {WANT_CHANGE_HOST_LOCATION} from '../events';

class MarkerPopupActions {
    static create({title, image, onAction}) {
        let button = L.DomUtil.create('button', 'btn-alt');
        button.setAttribute('title', title);
        button.innerHTML = `<img src="${image}" alt="" />`;
        if (!onAction || typeof onAction !== 'function') {
            button.setAttribute('disabled', true);
            button.setAttribute('title', 'Invalid action');
            console.error('Invalid popup action');
        }

        L.DomEvent.on(button, 'click', (event) => {
            event.preventDefault();
            onAction();
        }, this);

        return button;
    }

    static changeLocation(host) {
        return this.create({
            title: __('Change location'),
            image: '/imapify/images/target.png',
            onAction: () => {
                eventBus.emit(WANT_CHANGE_HOST_LOCATION, null, host);
            },
        });
    }

    static removeHostLocation(host) {
        return this.create({
            title: __('Delete location'),
            image: '/imapify/images/target-del.png',
            onAction: () => {
                eventBus.emit('RemoveHostLocationService.confirm-remove', null, host);
            }
        });
    }

    static hostDebugInfo(host) {
        return this.create({
            tagName: 'button',
            title: __('Show debug information'),
            image: '/imapify/images/debug.png',
            onAction: () => {
                eventBus.emit('debug-info-service.show-dump', null, host);
            }
        });
    }

    static triggerDebugInfo(trigger) {
        return this.create({
            title: __('Show debug information'),
            image: '/imapify/images/debug.png',
            onAction: () => {
                eventBus.emit('debug-info-service.show-dump', null, 'trigger', trigger);
            }
        });
    }

    static getHardware(host) {
        return this.create({
            title: __('Set a hardware type'),
            image: '/imapify/images/hardware.png',
            onAction: () => {
                eventBus.emit('GetHardwareImagesService.update-list', null, host);
            }
        });
    }

    static addLink(host) {
        return this.create({
            title: __('Add a link to another host'),
            image: '/imapify/images/link.png',
            onAction: () => {
                eventBus.emit('CreateHostLinkService.open-dialog', null, host);
            }
        });
    }
}

export default MarkerPopupActions;