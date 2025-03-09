// let infRoomParams, retRoomParams;
// infRoomParams = { e, 'server': 'req/res', };
// retRoomParams = await roomParams(infRoomParams); console.log(retRoomParams);

// http://127.0.0.1:1234/?act=PasswordAqui-screenshot&roo=SalaAqui&mes=MensagemAqui

let e = import.meta.url, ee = e; let libs = ['parse',];
async function roomParams(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODEJS] */ if (libs.length > 0) { libs = await importLibs(libs, [{ 'm': 'url', 'l': ['parse',], },]); }

        let { server, } = inf;

        let headers = server.headers || {}; let url = server.url, h = headers.host || '', room = false, locWeb, action = false, message = false, pass = false, mesTem, title = false, sendAlert = false;
        let method = server.upgrade ? 'WEBSOCKET' : server.method; let host = h.includes('192.168.') ? `127.0.0.1:${h.split(':')[1]}` : h; locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`;

        // CAPTURAR URL/PARÂMETROS/MENSAGEM|BODY
        try {
            function scapeNotEncode(input) { // CORRIGIR PRAMENTROS COM JSON BRUTO
                let substituicoes = [
                    ['%', '%25',] /* MANTER EM PRIMEIRO!!! */, ['{', '%7B',], ['}', '%7D',], ['"', '%22',], ["'", '%27',], [':', '%3A',], [',', '%2C',], ['[', '%5B',], [']', '%5D',],
                    ['/', '%2F',], ['#', '%23',], ['`', '%60',], ['@', '%40',], ['=', '%3D',], ['&', '%26',], ['?', '%3F',],
                ]; return substituicoes.reduce((str, [antigo, novo,]) => { return str.replace(new RegExp(antigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), novo); }, input);
            } if (url && (url.includes('{') || url.includes('['))) { url = `/${scapeNotEncode(url.replace('/', ''))}`; }

            url = decodeURIComponent(url); let { query, } = _parse(url, true); let urlParams = Object.keys(query).length === 0 ? false : query;
            if (urlParams) { action = urlParams.act || false; room = urlParams.roo || false; if (method === 'GET') { message = urlParams.mes || false; } } if (method === 'POST') {
                message = await new Promise((resolve) => {
                    let b = ''; server.on('data', (c) => { if (c) { b += c.toString(); } }); server.on('end', () => { if (b) { resolve(b); } else { resolve(null); } }); server.on('error', () => { resolve(null); });
                });
            }
        } catch (catchErr) { ret['msg'] = `AO CAPTURAR URL/PARÂMETROS/MENSAGEM|BODY`; sendAlert = true; }

        // VALIDAÇÕES INICIAIS
        if (!ret.msg && method !== 'WEBSOCKET' && (action || message)) {
            let { par1, par3, par4, par5, par8, par9, par10, par11, par12, par13, } = gW; let arrActMes = [par1, par3, par4, par5, par8, par9, par10, par11, par12, par13, message,];
            for (let [index, v,] of arrActMes.entries()) { // ACTION | MESSAGE
                if (index + 1 < arrActMes.length) { if (action && v.toLowerCase() === action.toLowerCase()) { pass = true; break; } } else if (message) {
                    try {
                        mesTem = JSON.parse(message); if (!(mesTem.fun && Array.isArray(mesTem.fun))) { ret['msg'] = `CHAVE 'fun' NÃO ENCONTRADA/NÃO É ARRAY`; sendAlert = true; }
                        else if (mesTem.fun.length === 0) { ret['msg'] = `CHAVE 'fun' VAZIA`; sendAlert = true; }
                        else if (!mesTem.fun.every(item => item.securityPass === gW.securityPass)) { ret['msg'] = `SECURITY PASS INVÁLIDO`; sendAlert = true; } else { pass = true; break; }
                    } catch (catchErr) { ret['msg'] = `AO FAZER PARSE DA MENSAGEM`; if (room || method === 'GET') { sendAlert = true; } }
                }
            } if (pass) { room = room || 'x'; } else if (!ret.msg && method === 'GET' && !room) { ret['msg'] = `NENHUMA AÇÃO VÁLIDA`; sendAlert = true; }
        }

        let hostRoom = `${host}/?roo=${room}`;

        // VALIDAÇÃO FINAL
        if ((!ret.msg && !room) || (!room && method === 'POST')) {
            ret['msg'] = `INFORMAR A SALA${method === 'WEBSOCKET' ? ' → ws://127.0.0.1:1234/?roo=SALA_AQUI' : '|ACTION/MENSAGEM → http://127.0.0.1:1234/?act=ACTION_AQUI&roo=SALA_AQUI&mes=MENSAGEM_AQUI'}`;
        } else if (!ret.msg && !pass && ['GET', 'POST',].includes(method) && !message) { ret['msg'] = `INFORMAR O BODY`; sendAlert = true; }

        // ENVIAR NOTIFICAÇÃO
        if (!ret.msg && method !== 'WEBSOCKET' && !!mesTem && mesTem?.fun[0]?.name === 'notification' && hostRoom === gW.devSever) {
            try { let f = mesTem.fun[0]; f.par['legacy'] = false; f.par['ignoreErr'] = true; f.par['retInf'] = f.retInf; let r = await notification(f.par); ret['ret'] = r.ret; ret['msg'] = r.msg; title = 'Notification'; }
            catch (catchErr) { ret['msg'] = `AO ENCAMINHAR NOTIFICAÇÃO`; } mesTem = false; ret['stop'] = true; return ret;
        }

        // ALERTAR SOBRE O ERRO
        if (ret.msg && !title) {
            if (sendAlert) {
                let text = `→ {${method}} ${ret.msg}\n🔗 ${locWeb} ${url}`; logConsole({ e, ee, 'msg': `${text}\n\nHEADERS:\n${JSON.stringify(headers)}\n\nMENSAGEM/BODY:\n${message || ''}`, });
                notification({ 'keepOld': true, 'ntfy': true, 'title': `# SERVER (${gW.devMaster}) [NODEJS]`, text, 'ignoreErr': true, });
            } ret['stop'] = true; return ret;
        }

        ret['ret'] = title ? ret.ret : true;
        ret['msg'] = title ? ret.msg : 'ROOM PARAMS: OK';
        ret['res'] = {
            method,
            host,
            'room': room || '',
            hostRoom,
            locWeb,
            'action': action || '',
            'message': message || '',
            'headers': headers || {},
            title,
        };

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['roomParams'] = roomParams;


