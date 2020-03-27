import eventBus from '../bus';
import {__} from '../../helpers';
import {CONFIRM_REMOVE_LINK} from '../../events';

class RemoveLinkService {
    constructor() {
        eventBus.on(CONFIRM_REMOVE_LINK, (host, onConfirm) => this.confirmRemove(host, onConfirm));
    }

    confirmRemove(link, onConfirm) {
        let message = `${__('Delete link')} `;
        if (link.name) {
            message += link.name;
        } else {
            message += `ID: ${link.id}`;
        }
        message += '?';

        overlayDialogue({
            'title': __('Execution confirmation'),
            'content': message,
            'buttons': [
                {
                    'title': __('Cancel'),
                    'class': 'btn-alt',
                    'action': () => {
                    }
                },
                {
                    'title': __('Execute'),
                    'action': () => onConfirm(),
                }
            ]
        }, this, undefined);

    }

}

export default RemoveLinkService;