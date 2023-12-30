// let retGetClients // 'logFun': true,
// retGetClients = getClients({ 'rooms': rooms, 'res': res, 'bodyHtml': bodyHtml })
// console.log(retGetClients)

let e = import.meta.url;
function getClients(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let rooms = inf.rooms
        let res = inf.res
        let bodyHtml = inf.bodyHtml
        let resClients = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
        let dH = dateHour().res;
        resClients.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(bodyHtml.replace('####REPLACE####', `<pre>OK | CLIENTS:\n\n${JSON.stringify(resClients)}</pre>`));
        ret['ret'] = true;
        ret['msg'] = `GET CLIENTS: OK`

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            (async () => {
                let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
                infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
            })()
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
    window['getClients'] = getClients;
} else { // NODEJS
    global['getClients'] = getClients;
}
