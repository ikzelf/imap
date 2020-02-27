import eventBus from '../bus';
import {SHOW_CONTEXT_MENU} from '../../events';

class MenuPopup2Service {
    constructor() {
        eventBus.on(SHOW_CONTEXT_MENU, (data, event) => this.show(data, event));
    }

    show(data, event) {
        let target = event.target,
            item_data = {
                id: target.dataset['id'],
                type: target.dataset['type'],
                popupid: target.dataset['menu-popup-id'],
            };

        event.preventDefault();
        event.stopPropagation();

        // Recreate menu every time due copy/paste function availability changes.
        if (item_data.popupid) {
            document.getElementById(item_data.popupid).remove();
        }

        event.originalEvent = event.originalEvent || event;
        jQuery(event.target).menuPopup(data, event);
    }
}

export default MenuPopup2Service;