import Im from './im-core.js';

let init = () => {
    let IM = new Im({
        showLog: true
    });

    IM.api.connect();

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

    IM.http.getUnread({
        ret_count: 1,
        ret_unread_msg: 1,
        t: '122,114,115,119,125,126',
        tid: 'u1',
    }).then((rs) => {
        console.log('rs', rs);
    }).catch(err => {
        console.log('err', err);
    });

    // IM.util.request(
    //     'http://localhost:9999/pub/api/record',
    //     {
    //         params: {
    //             last_speed: 16,
    //             token: '052571C3D959102969DEF257A0DB2CD4'
    //         },
    //         data: [
    //             {
    //                 "host": "localhost",
    //                 "key": "/",
    //                 "used": 11000,
    //                 "hash": [],
    //                 "query": {},
    //                 "user": {"mouseMove": [{"val": "0", "used": 11000}]}
    //             }
    //         ]
    //     }
    // ).then((rs) => {
    //     console.log('rs', rs);
    // }).catch(err => {
    //     console.log('err', err);
    // });
};

init();