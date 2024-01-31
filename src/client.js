let e = import.meta.url, ee = e
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `[WebSocket]\n` });

        // DEV - SEND
        let dev1 = devSend
        // DEV - GET [WEB|LOC]
        let dev2 = devGet[0]
        let dev3 = devGet[1]

        // CONNECT
        // await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3,] })
        await wsConnect({ 'e': e, 'url': [dev1, , dev3,] })

        // LISTENER SOMENTE SE NÃO FOR 'Sniffer_Python'
        let retGetPath
        retGetPath = await getPath({ 'e': new Error() })
        if (retGetPath?.res[6] !== 'Sniffer_Python') {
            // LIST - [WEB]
            wsList(dev2, async (nomeList, param1) => {
                runLis(nomeList, param1)
            });

            // LISTENER SOMENTE SE FOR [NOTEBOOK]
            if (retGetPath?.res[1] == 'D') {
                // LIST - [LOC]
                wsList(dev3, async (nomeList, param1) => {
                    runLis(nomeList, param1)
                });
            }

            // RUN LIS
            async function runLis(nomeList, param1) {
                let data = {};
                try { data = JSON.parse(param1) } catch (e) { };
                if (data.fun) { // FUN
                    let infDevFun = { 'e': e, 'data': data, 'wsOrigin': nomeList }
                    devFun(infDevFun)
                } else if (data.other) { // OTHER
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OTHER\n${data.other}` });
                } else {
                    logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `MENSAGEM DO WEBSCKET\n${param1}` });
                }
            }
        }

        ret['ret'] = true
        ret['msg'] = `CLIENT [WebSocket]: OK`
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            configStorage({ 'e': e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}
await client()

// if (eng) { // CHROME
//     window['client'] = client;
// } else { // NODEJS
//     global['client'] = client;
// }











