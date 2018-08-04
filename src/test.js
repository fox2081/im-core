import Im from './im-core.js';

let init = () => {
    let IM = new Im({
        showLog: true
    });

    IM.util.connect();

    IM.on('error', (e) => {
        console.log('get event error:', e)
    });

    IM.on('open', (e) => {
        console.log('get event open:', e)
        IM.send({
            i: 1,
            t: 1,
            r: ['u1'],
            c: 'Hola'
        })
    });

};

init();