// let infRoomParams, retRoomParams;
// infRoomParams = { e, 'server': 'req/res', };
// retRoomParams = await roomParams(infRoomParams); console.log(retRoomParams);

// http://127.0.0.1:1234/?act=PasswordAqui-screenshot&roo=SalaAqui&mes=MensagemAqui

let e = import.meta.url, ee = e;
async function roomParams(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { server, } = inf;

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _parse === 'undefined') { await funLibrary({ 'lib': '_parse', }); };

        let headers = server.headers; let url = server.url, host = headers.host, room = false, locWeb, action = false, message = false, pass = false, messageTemp, title = false;
        let method = server.upgrade ? 'WEBSOCKET' : server.method; host = host.includes('192.168.') ? `127.0.0.1:${host.split(':')[1]}` : host; locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`;

        // CAPTURAR URL/PARÂMETROS/MENSAGEM|BODY
        try {
            if (method !== 'WEBSOCKET' && !['GET', 'POST',].includes(method)) { ret['msg'] = `METODOS ACEITOS 'GET' OU 'POST'`; } else {
                function scapeNotEncode(input) {
                    // CORRIGIR PRAMENTROS COM JSON BRUTO
                    let substituicoes = [
                        ['%', '%25',], // MANTER EM PRIMEIRO!!!
                        ['{', '%7B',], ['}', '%7D',], ['"', '%22',], ["'", '%27',], [':', '%3A',], [',', '%2C',], ['[', '%5B',], [']', '%5D',], ['/', '%2F',], ['#', '%23',],
                        ['`', '%60',], ['@', '%40',], ['=', '%3D',], ['&', '%26',], ['?', '%3F',],
                    ]; return substituicoes.reduce((str, [antigo, novo,]) => { return str.replace(new RegExp(antigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), novo); }, input);
                }; if (url && (url.includes('{') || url.includes('['))) { url = `/${scapeNotEncode(url.replace('/', ''))}`; };

                url = decodeURIComponent(url); let { query, } = _parse(url, true); let urlParams = Object.keys(query).length === 0 ? false : query;
                if (urlParams) { action = urlParams.act || false; room = urlParams.roo || false; if (method === 'GET') { message = urlParams.mes || false; } }; if (method === 'POST') {
                    message = await new Promise((resolve) => {
                        let bodyOk = ''; server.on('data', (chunk) => { if (chunk) { bodyOk += chunk.toString(); } });
                        server.on('end', () => { if (bodyOk) { resolve(bodyOk); } else { resolve(null); } }); server.on('error', () => { resolve(null); });
                    });
                }
            }
        } catch (catchErr) { ret['msg'] = `AO CAPTURAR URL/PARÂMETROS/MENSAGEM|BODY\n\n${catchErr}`; };

        // VALIDAÇÕES INICIAIS
        if (!ret.msg && method !== 'WEBSOCKET' && (action || message)) {
            let { par1, par3, par4, par5, par8, par9, par10, par11, par12, par13, } = gW; let arrActMes = [par1, par3, par4, par5, par8, par9, par10, par11, par12, par13, message,];
            for (let [index, v,] of arrActMes.entries()) {
                if (index + 1 < arrActMes.length) {
                    // ACTION
                    if (action && v.toLowerCase() === action.toLowerCase()) { pass = true; break; };
                } else if (message) {
                    //  MESSAGE
                    try {
                        messageTemp = JSON.parse(message); if (!(messageTemp.fun && Array.isArray(messageTemp.fun))) { ret['msg'] = `CHAVE 'fun' NÃO ENCONTRADA/NÃO É ARRAY`; }
                        else if (messageTemp.fun.length === 0) { ret['msg'] = `CHAVE 'fun' VAZIA`; }
                        else if (!messageTemp.fun.every(item => item.securityPass === gW.securityPass)) { ret['msg'] = `SECURITY PASS INVÁLIDO`; } else { pass = true; break; };
                    } catch (catchErr) { ret['msg'] = `AO FAZER PARSE DA MENSAGEM\n\n${catchErr}`; };
                }
            }; if (pass) { room = room || 'x'; } else if (method === 'GET') { ret['msg'] = `NENHUMA AÇÃO VÁLIDA`; };
        }

        let hostRoom = `${host}/?roo=${room}`;

        // VALIDAÇÃO FINAL
        if (!ret.msg && !room) {
            ret['msg'] = `INFORMAR A SALA${method === 'WEBSOCKET' ? ' → ws://127.0.0.1:1234/?roo=SALA_AQUI' : '|ACTION/MENSAGEM → http://127.0.0.1:1234/?act=ACTION_AQUI&roo=SALA_AQUI&mes=MENSAGEM_AQUI'}`;
        }

        // ENVIAR NOTIFICAÇÃO
        if (!ret.msg && method !== 'WEBSOCKET' && !!messageTemp && messageTemp?.fun[0]?.name === 'notification' && hostRoom === gW.devSever) {
            try {
                let funOk = messageTemp.fun[0]; delete funOk.par['legacy']; funOk.par['ignoreErr'] = true;
                let retNot = await notification(funOk.par); ret['ret'] = retNot.ret; ret['msg'] = retNot.msg; title = 'Notification';
            } catch (catchErr) { ret['msg'] = `AO ENCAMINHAR NOTIFICAÇÃO\n\n${catchErr}`; }; messageTemp = false;
        }

        ret['ret'] = title ? ret.ret : !ret.msg;
        ret['msg'] = `${title ? ret.msg : ret.ret ? 'ROOM PARAMS: OK' : `ROOM PARAMS: ERRO | ${ret.msg}`}`;
        ret['res'] = {
            'method': method,
            'host': host,
            'room': room || '',
            'hostRoom': hostRoom,
            'locWeb': locWeb,
            'action': action || '',
            'message': message || '',
            'headers': headers,
            'title': title,
        };

        if (!ret.ret) {
            let text = `→ [${method}] ${host}${url}\n${ret.msg}`;
            logConsole({ e, ee, 'write': true, 'msg': `${text}\n\n${JSON.stringify({ 'ret': ret.ret, 'msg': ret.msg, })}\n\nHEADERS:\n${JSON.stringify(headers)}\n\nMENSAGEM/BODY:\n${message || ''}`, });
            if (!title) { notification({ 'keepOld': true, 'ntfy': true, 'title': `# SERVER (${gW.devMaster}) [NODEJS]`, text, 'ignoreErr': true, }); }; // ALERTAR SOBRE O ERRO
        }

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['roomParams'] = roomParams;
