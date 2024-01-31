// let retSendRoom // 'logFun': true,
// retSendRoom = sendRoom({ 'e': e, 'rooms': rooms, 'room': room, 'message': message, 'sender': ws }) // MESMO CLIENTE
// retSendRoom = sendRoom({ 'e': e, 'rooms': rooms, 'room': room, 'message': message, 'sender': null }) // CLIENTE DIFERENTE
// retSendRoom = sendRoom({ 'e': e, 'rooms': rooms, 'room': room, 'message': message, 'sender': null, 'res': res, 'bodyHtml': bodyHtml }) // HTTP GET/POST
// console.log(retSendRoom)

let e = import.meta.url, ee = e
function sendRoom(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let rooms = inf.rooms
        let room = inf.room
        let message = typeof inf.message === 'object' ? JSON.stringify(inf.message) : inf.message
        let sender = inf.sender
        let clientsInRoom = rooms[room];
        if (clientsInRoom) {
            clientsInRoom.forEach((client) => {
                if (client !== sender) {
                    client.send(message)
                } else if (message.toLowerCase().includes(par2.toLowerCase())) {
                    client.send(`WEBSOCKET: OK '${room}'`);
                }
            })
        }
        if (inf.res) {
            let res = inf.res
            let bodyHtml = inf.bodyHtml
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(bodyHtml.replace('####REPLACE####', `<pre>OK '${room}'</pre>`));
        }
        ret['ret'] = true;
        ret['msg'] = `SEND ROOM: OK`

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (e) {
        (async () => {
            let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
            ret['msg'] = retRegexE.res
        })()
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['sendRoom'] = sendRoom;
} else { // NODEJS
    global['sendRoom'] = sendRoom;
}
