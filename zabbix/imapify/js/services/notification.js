import * as Toastr from 'toastr';


class NotificationService {
    constructor({type, message, title, timeout}) {
        let options = {};

        if (timeout === 0) {
            options['timeOut'] = 0;
            options['extendedTimeOut'] = 0;
        } else if (!!timeout && timeout > 0) {
            options['timeOut'] = timeout;
        }

        this.type = type || 'info';
        this.message = message;
        this.title = title;
        this.options = options;
    }

    static success(message, title, timeout) {
        new NotificationService({
            type: 'success',
            message: message,
            title: title,
            timeout: timeout,
        }).show();
    }

    static info(message, title, timeout) {
        new NotificationService({
            type: 'info',
            message: message,
            title: title,
            timeout: timeout,
        }).show();
    }

    static warn(message, title, timeout) {
        new NotificationService({
            type: 'warning',
            message: message,
            title: title,
            timeout: timeout,
        }).show();
    }

    static error(message, title, timeout) {
        new NotificationService({
            type: 'error',
            message: message,
            title: title,
            timeout: timeout,
        }).show();
    }

    show() {
        Toastr[this.type](this.message, this.title, this.options)
    }

}

export default NotificationService;