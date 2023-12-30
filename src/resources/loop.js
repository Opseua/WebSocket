// let retLoop // 'logFun': true,
// retLoop = await loop({ 'rooms': rooms })
// console.log(retLoop)

let e = import.meta.url;
function loop(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let rooms = inf.rooms
        let sender = inf.sender
        let message = {
            'fun': [{
                'securityPass': securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    'awaitFinish': true, 'command': `nircmd savescreenshot "!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshot.png"`
                }
            }]
        };
        for (let room in rooms) {
            if (room.toLowerCase().includes(`nodejs`)) {
                // ENVIAR COMANDO PARA TIRAR PRINT
                sendRoom({ 'rooms': rooms, 'room': room, 'message': message, 'sender': sender })
            }
        }
        ret['ret'] = true;
        ret['msg'] = `LOOP: OK`

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
    window['loop'] = loop;
} else { // NODEJS
    global['loop'] = loop;
}
