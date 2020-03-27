import {__} from '../helpers';
import eventBus from '../services/bus';
import {CONFIRM_REMOVE_LINK} from '../events';

class LinkOptions {

    /**
     *
     * @param link {Link}
     * @param onDeleteLink
     * @param onUpdateLink
     */
    constructor({link, onDeleteLink, onUpdateLink}) {
        this.link = link;

        let template = L.DomUtil.create('div', '');

        // linkname
        let nameInput = document.createElement('input');
        nameInput.setAttribute('name', 'link-name');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('value', link.name);

        L.DomUtil.create('label', '', template)
            .append(__('Link name'), nameInput);

        let colorInput = document.createElement('input');
        colorInput.setAttribute('name', 'link-color');
        colorInput.setAttribute('type', 'colorpicker');
        colorInput.setAttribute('value', link.color);

        L.DomUtil.create('label', '', template)
            .append(__('Link color'), colorInput);

        let weightInput = document.createElement('input');
        weightInput.setAttribute('name', 'link-weight');
        weightInput.setAttribute('type', 'number');
        weightInput.setAttribute('min', '1');
        weightInput.setAttribute('max', '20');
        weightInput.setAttribute('step', '1');
        weightInput.setAttribute('value', link.weight);

        L.DomUtil.create('label', '', template)
            .append(`${__('Link width')}, px`, weightInput);

        let opacityInput = document.createElement('input');
        opacityInput.setAttribute('name', 'link-opacity');
        opacityInput.setAttribute('type', 'number');
        opacityInput.setAttribute('min', '0');
        opacityInput.setAttribute('max', '100');
        opacityInput.setAttribute('step', '10');
        opacityInput.setAttribute('value', `${link.opacity * 100}`);

        L.DomUtil.create('label', '', template)
            .append(`${__('Link opacity')}, %`, opacityInput);

        let dashInput = document.createElement('input');
        dashInput.setAttribute('name', 'link-dash');
        dashInput.setAttribute('type', 'hidden');
        dashInput.setAttribute('value', link.dash);


        let dashContainer = L.DomUtil.create('div', 'link-dash', template);
        L.DomUtil.create('label', '', dashContainer)
            .append(__('Link dash'), dashInput);

        let dashList = document.createElement('ul');
        dashList.style.display = 'none';

        let dashSpan = document.createElement('span');
        dashSpan.innerHTML = `<svg height="8" width="100%"><g><path stroke="#2F2F2F" stroke-dasharray="${link.dash}" stroke-width="5" d="M5 0 l215 0"></path></g></svg>`;
        dashSpan.on('click', () => {
            dashList.style.display = 'block';
        });


        ['5,5', '2,5', '5,15,10', '2,15'].forEach((dashArray) => {
            let li = document.createElement('li');

            li.innerHTML = `<a href="#"><svg height="8" width="100%"><g><path stroke-dasharray="${dashArray}" stroke="#2F2F2F" stroke-width="5" d="M5 0 l215 0"></path></g></svg></a>`;

            dashList.append(li);
        });

        dashContainer.append(dashSpan, dashList);


        this.dialogContent = document.createElement('div');
        this.dialogContent.id = 'link-options-dialog';
        this.dialogContent.style.height = '300px';
        this.dialogContent.style.whiteSpace = 'normal';
        this.dialogContent.append(template);


        this.nameInput = nameInput;
        this.colorInput = colorInput;
        this.weightInput = weightInput;
        this.opacityInput = opacityInput;
        this.dashInput = dashInput;

        this.buttons = [
            {
                'title': __('Delete link'),
                'class': 'btn-alt',
                'action': () => {
                    eventBus.emit(CONFIRM_REMOVE_LINK, null, link, onDeleteLink);
                }
            },
            {
                'title': __('Execute'),
                'class': 'btn-alt',
                'action': () => {
                    onUpdateLink({
                        name: nameInput.value,
                        color: colorInput.value,
                        weight: weightInput.value,
                        opacity: opacityInput.value,
                        dash: dashInput.value,
                    });
                }
            },
            {
                'title': __('Cancel'),
                'class': 'btn-alt',
                'action': () => {
                }
            }
        ];


        // TODO: replace with npm package
        jQuery('input[type=\'colorpicker\']').colorPicker();
        jQuery('input[type=\'number\']').css('width', '80%').stepper();

    }

    open() {
        overlayDialogue({
            'title': __('Link options'),
            'content': this.dialogContent,
            'buttons': this.buttons,
        }, this, undefined);
    }
}

export default LinkOptions;