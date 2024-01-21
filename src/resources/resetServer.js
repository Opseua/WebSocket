// let retResetServer // 'logFun': true,
// retResetServer = resetServer({ 'rooms': rooms, 'res': res, 'params': params, 'room': room, 'bodyHtml': bodyHtml })
// console.log(retResetServer)

let e = import.meta.url;
function resetServer(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let rooms = inf.rooms
        let res = inf.res
        let params = inf.params.split('/')
        let room = params[0]
        let bodyHtml = inf.bodyHtml
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(bodyHtml.replace('####REPLACE####', `<pre>OK ### RESET ###</pre>`));
        let message = {
            'fun': [
                {
                    'securityPass': securityPass, 'retInf': false,
                    'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F` }
                },
                {
                    'securityPass': securityPass, 'retInf': false,
                    'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe" --restart-service` }
                },
                {
                    'securityPass': securityPass, 'retInf': false,
                    'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe"` }
                },
                {
                    'securityPass': securityPass, 'retInf': false,
                    'name': 'log', 'par': { 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' }
                },
                {
                    'securityPass': securityPass, 'retInf': false,
                    'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': `"${letter}:/ARQUIVOS/PROJETOS/WebSocket/src/z_OutrosWebSocket/z_RestartAll.lnk"` }
                },
            ]
        }
        sendRoom({ 'rooms': rooms, 'room': room, 'message': message, 'sender': null })
        ret['ret'] = true;
        ret['msg'] = `RESET SERVER: OK`

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
    window['resetServer'] = resetServer;
} else { // NODEJS
    global['resetServer'] = resetServer;
}
