// http://127.0.0.1:1234/?act=PasswordAqui-screenshot&roo=SalaAqui&mes=MensagemAqui

// let infRoomParams, retRoomParams
// infRoomParams = { 'e': e, 'wsClients': wsClients, 'resWs': res, 'server': req, }
// retRoomParams = await roomParams(infRoomParams); console.log(retRoomParams)

let e = import.meta.url, ee = e;
async function roomParams(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let { server, resWs, wsClients } = inf
        let rooms = wsClients.rooms
        let url = decodeURIComponent(server.url)
        let { query } = _parse(url, true);
        let urlParams = Object.keys(query).length === 0 ? false : query
        let room, action, message, method = server.upgrade ? 'WEBSOCKET' : server.method
        let host = server.headers.host
        let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`, urlParts = url.split('/')
        let headers = server.headers

        if (!urlParams) {
            room = false
        } else {
            action = urlParams.act ? urlParams.act : false;
            let { par1, } = globalWindow
            let actionPar = false; for (let [index, value] of [par1].entries()) { if (action && value.toLowerCase() === action.toLowerCase()) { actionPar = true; break } }
            room = action && actionPar ? 'x' : urlParams.roo ? urlParams.roo : false;
            if (method == 'GET' || method == 'POST') {
                if (method == 'GET') {
                    message = urlParams.mes ? urlParams.mes : urlParts.slice(2).join('/')
                } else {
                    message = await new Promise((resolve) => { server.on('data', (chunk) => { resolve(chunk.toString()) }) });
                }
            }
        }

        let hostRoom = `${host}/?roo=${room}`

        // ERROS
        let body
        if (!room || (method == 'GET' && !action && !message) || (method == 'POST' && !message)) {
            body = `ERRO | INFORMAR A SALA|ACTION/MENSAGEM\n\n→ ws|http://127.0.0.1:1234/?act=ACTION_AQUI&roo=SALA_AQUI&mes=MENSAGEM_AQUI`
        } else if (method !== 'WEBSOCKET' && !['GET', 'POST'].includes(method)) {
            body = `ERRO | METODOS ACEITOS 'GET' OU 'POST'`
        } else if (method !== 'WEBSOCKET' && !rooms[`${hostRoom}`] && room !== 'x') {
            body = `ERRO | NÃO EXISTE '${room}'`
        }
        // DEU ALGUM ERRO
        if (body) {
            if (method == 'WEBSOCKET') {
                // ### WEBSOCKET
                resWs.send(body); resWs.terminate()
            } else {
                // ### HTTP
                html({ 'e': e, 'server': resWs, 'body': body, 'room': room, 'infAdd': { 'type': 'text', 'title': 'Server' }, 'method': method, 'headers': headers, })
            }
        } else {
            ret['ret'] = true;
            ret['msg'] = `ROOM PARAMS: OK`;
            ret['res'] = {
                'method': method,
                'host': host,
                'room': room,
                'hostRoom': hostRoom,
                'locWeb': locWeb,
                'action': action ? action : '',
                'message': message ? message : '',
                'headers': headers,
            }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['roomParams'] = roomParams;
