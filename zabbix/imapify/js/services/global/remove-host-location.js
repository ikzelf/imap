import eventBus from '../bus';
import {__} from '../../helpers';
import {updateHostLocation} from '../../api/host';
import NotificationService from '../notification';
import {NOTIFY_NEW_HOST_INFORMATION} from '../../events';

class RemoveHostLocationService {
    constructor() {
        eventBus.on('RemoveHostLocationService.confirm-remove', (host) => this.confirmRemove(host));
    }

    confirmRemove(host) {
        overlayDialogue({
            'title': __('Execution confirmation'),
            'content': `${__('Delete location')} (${host.name})?`,
            'buttons': [
                {
                    'title': __('Cancel'),
                    'class': 'btn-alt',
                    'action': () => {
                    }
                },
                {
                    'title': __('Execute'),
                    'action': () => this.removeHostLocation(host),
                }
            ]
        }, this, undefined);

    }

    removeHostLocation(host) {
        updateHostLocation(host.hostid, null, null)
            .then((response) => {
                let data = response.data;
                if (data.result) {
                    eventBus.emit(NOTIFY_NEW_HOST_INFORMATION, null, host.hostid, data.result);
                } else {
                    NotificationService.error(__('Failed to update data'), __('Error'));
                }
            });


    }

}

export default RemoveHostLocationService;