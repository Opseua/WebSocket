// http://127.0.0.1:1234/?act=PasswordAqui-screenshot&roo=SalaAqui&mes=MensagemAqui

// let infRoomParams, retRoomParams
// infRoomParams = { e, 'wsClients': wsClients, 'resWs': res, 'server': req, }
// retRoomParams = await roomParams(infRoomParams); console.log(retRoomParams)

let e = import.meta.url, ee = e;
async function roomParams(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { server, resWs, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _parse === 'undefined') { await funLibrary({ 'lib': '_parse' }); };

        let url = decodeURIComponent(server.url); let { query } = _parse(url, true); let urlParams = Object.keys(query).length === 0 ? false : query; let room, action, message;
        let method = server.upgrade ? 'WEBSOCKET' : server.method; let host = server.headers.host.includes('192.168.') ? `127.0.0.1:${server.headers.host.split(':')[1]}` : server.headers.host;
        let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`, urlParts = url.split('/'); let headers = server.headers;

        if (!urlParams) {
            room = false
        } else {
            action = urlParams.act || false; let { par1, par11, par12, par13, } = gW; let actionPar = false;
            for (let [index, value] of [par1, par11, par12, par13,].entries()) { if (action && value.toLowerCase() === action.toLowerCase()) { actionPar = true; break } };
            room = action && actionPar ? 'x' : urlParams.roo || false;
            if (method == 'GET' || method == 'POST') {
                if (method == 'GET') {
                    message = urlParams.mes || urlParts.slice(2).join('/')
                } else {
                    // message = await new Promise((resolve) => { server.on('data', (chunk) => { resolve(chunk.toString()) }) });
                    message = await new Promise((resolve) => {
                        let bodyOk = ''; server.on('data', (chunk) => { if (chunk) { bodyOk += chunk.toString(); } });
                        server.on('end', () => { if (bodyOk) { resolve(bodyOk); } else { resolve(null); } }); server.on('error', () => { resolve(null); });
                    });
                }
            }
        }

        let body; let hostRoom = `${host}/?roo=${room}`;

        // ERROS
        if (!room || (method == 'GET' && !action && !message) || (method == 'POST' && !message)) {
            body = `HTTP: ERRO | INFORMAR A SALA|ACTION/MENSAGEM\n\n→ http://127.0.0.1:1234/?act=ACTION_AQUI&roo=SALA_AQUI&mes=MENSAGEM_AQUI`
        } else if (method !== 'WEBSOCKET' && !['GET', 'POST'].includes(method)) {
            body = `HTTP: ERRO | METODOS ACEITOS 'GET' OU 'POST'`
        }

        // ENCAMINHAR NOTIFICAÇÃO
        if (method == 'POST' && message && message.includes('"name": "notification"')) {
            try {
                let funOk = JSON.parse(message).fun[0]; if (funOk.securityPass == gW.securityPass && funOk.name == 'notification') {
                    delete funOk.par['legacy']; let retNotification = await notification({ ...funOk, ...funOk.par, 'encNot': room.includes('CHROME_EXTENSION-USUARIO_'), });
                    body = { 'ret': retNotification.ret, 'msg': retNotification.msg, 'res': retNotification.res, 'type': 'obj', 'title': 'Notification', }; message = false;
                }
            } catch (catchErr) {
                // NÃO PASSAR O 'inf' PARA A 'regexE' PORQUE DA ERRO DEVIDO O SERVIDOR HTTP SER ENVIADO JUNTO!!!
                let retRegexE = await regexE({ 'inf': message, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
                body = `HTTP: ERRO | AO ENCAMINHAR NOTIFICAÇÃO`; message = false
            }
        }

        // DEU ALGUM ERRO
        if (body) {
            if (method == 'WEBSOCKET') {
                // ### WEBSOCKET
                resWs.send(body); resWs.terminate();
            } else {
                // ### HTTP
                if (!(typeof body === 'object')) { body = { 'ret': false, 'msg': body, 'res': null, 'type': 'obj', 'title': 'Server', } }
                else { body = { 'ret': body.ret, 'msg': body.msg, 'res': null, 'type': body.type, 'title': body.title, } };
                html({
                    e, 'server': resWs, 'body': { 'ret': body.ret, ...(body.msg && { 'msg': body.msg }), ...(body.res && { 'res': body.res }) },
                    'room': room, 'infAdd': { 'type': body.type, 'title': body.title }, 'method': method, 'headers': headers,
                });
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
                'action': action || '',
                'message': message || '',
                'headers': headers,
            }
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['roomParams'] = roomParams;
