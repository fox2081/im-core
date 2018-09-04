let eventList = {};

class ImEvent {
    constructor() {

    }

    static on(name, fn, context, once) {
        if (eventList[name] && eventList[name].length) {
            eventList[name].push({fn: fn, context: context || this, once: once});
        } else {
            eventList[name] = [{fn: fn, context: context || this, once: once}];
        }
        return this;
    }

    static trigger(name) {
        let arg = [].slice.call(arguments, 1);
        if (eventList[name] && eventList[name].length) {
            eventList[name].forEach(item => {
                if (item.once && item.called) {
                    return;
                }
                item.fn.apply(item.context, arg);
                item.called = true;
            })
        }
    }
}

export default ImEvent;