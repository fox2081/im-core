import imSocket from './im-websocket.js';

let init = () => {
    let im = new imSocket({
        url: 'wss://test.io:14002/im',
        reconnect: true,
        log: true
    });

    im.on('error', (e) => {
        console.log('get event:', e)
    });
};

init();