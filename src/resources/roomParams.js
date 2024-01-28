// http://127.0.0.1:8888/?act=PasswordAqui=screenshot&roo=OPSEUA&mes=MensagemAqui

let e = import.meta.url;
async function roomParams(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let url = decodeURIComponent(inf.server.url)
        let { query } = _parse(url, true);
        let urlParams = Object.keys(query).length === 0 ? false : query
        let room, action, message
        let method = inf.method == 'WEBSOCKET' ? 'WEBSOCKET' : inf.server.method
        let urlParts = url.split('/')

        if (!urlParams && urlParts.length < 3 && urlParts['1'] == '') {
            room = false
        } else {
            room = urlParams.roo ? urlParams.roo : urlParts[1];
            action = urlParams.act ? urlParams.act : false;
            if (method == 'GET' || method == 'POST') {
                message = '';
                if (method == 'GET') {
                    message = urlParams.mes ? urlParams.mes : urlParts.slice(2).join('/')
                } else {
                    await new Promise((resolve) => {
                        inf.server.on('data', (chunk) => { message += chunk.toString() });
                        inf.server.on('end', () => { resolve(message) })
                    })
                }
            }
        }
        ret['ret'] = true;
        ret['msg'] = `ROOM PARAMS: OK`;
        ret['res'] = {
            'method': method,
            'room': room ? room : '',
            'action': action ? action : message ? message : '',
            'message': message ? message : '',
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
        }
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['roomParams'] = roomParams;
} else { // NODEJS
    global['roomParams'] = roomParams;
}


