/**
 * Observer pattern
 * @see https://en.wikipedia.org/wiki/Observer_pattern
 */
class Observable {
    #listeners;

    /**
     * Observable constructor.
     */
    constructor() {
        this.#listeners = {};
    }

    /**
     * Subscribe.
     * @param {string} e
     * @param {Function} callback
     * @return {this}
     */
    on(e, callback) {
        if (this.#listeners[e] === undefined) {
            this.#listeners[e] = {};

            this.#listeners[e].eventProperty = {};
            this.#listeners[e].eventProperty.isOnOnce = false;

            this.#listeners[e].data = [];
        }
        this.#listeners[e].data.push(callback);

        return this;
    }

    /**
     * Subscribe once.
     * @param {string} e
     * @param {Function} callback
     */
    onOnce(e, callback) {
        this.on(e, callback);
        this.#listeners[e].eventProperty.isOnOnce = true;
    }

    /**
     * Unsubscribe.
     * @param {string} e
     * @param {Function} callback
     */
    off(e, callback) {
        this.#listeners[e].data = this.#listeners[e].data.filter((listener) => {
            return listener !== callback;
        });
    }

    /**
     * Notify subject
     * @param {string} e
     * @param data
     */
    emit(e, data) {
        if (this.#listeners[e] === undefined || this.#listeners[e].data === undefined) {
            return;
        }

        this.#listeners[e].data.forEach(listener => {
            if (this.#listeners[e].eventProperty.isOnOnce) {
                this.off(e, this.#listeners[e].data[0]);
            }
            listener(data);
        });
    }
}

export default Observable;