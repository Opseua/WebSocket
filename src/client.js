let e = import.meta.url;
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, 'client [WebSocket]');

        // DEV - SEND
        let dev1 = devSend
        // DEV - GET [WEB|LOC]
        let dev2 = devGet[0]
        let dev3 = devGet[1]

        // CONNECT
        await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3,] })

        // LISTENER SOMENTE SE NÃO FOR 'Sniffer_Python'
        let retGetPath
        retGetPath = await getPath({ 'e': new Error() })
        if (retGetPath?.res[6] !== 'Sniffer_Python') {
            // LIST - [WEB]
            wsList(dev2, async (nomeList, param1) => {
                runLis(nomeList, param1)
            });

            // LISTENER SOMENTE SE NÃO FOR [EC2]
            if (retGetPath?.res[1] !== 'C') {
                // LIST - [LOC]
                wsList(dev3, async (nomeList, param1) => {
                    runLis(nomeList, param1)
                });
            }

            // RUN LIS
            async function runLis(nomeList, param1) {
                let data = {};
                try {
                    data = JSON.parse(param1)
                } catch (e) { };
                if (data.fun) { // FUN
                    let infDevFun = { 'ea': e, 'data': data, 'wsOrigin': nomeList }
                    let retDevFun = await devFun(infDevFun)
                } else if (data.other) { // OTHER
                    console.log('OTHER', data.other)
                } else {
                    console.log(`\nMENSAGEM DO WEBSCKET\n\n${param1}\n`)
                }
            }
        }

        // async function keepCookieLiveRun() {
        //     await new Promise(resolve => { setTimeout(resolve, 15000) });
        //     wsSend({ 'e': e, 'url': devSend, 'message': { 'other': 'keepCookieLive' } })

        // };
        // // keepCookieLiveRun();

        ret['ret'] = true
        ret['msg'] = `CLIENT [WebSocket]: OK`
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    if (!ret.ret) {
        if (eng) { // CHROME
            let retConfigStorage = await configStorage({ 'e': e, 'action': 'del', 'key': 'webSocket' })
        } else { // NODEJS
            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `SERVER NODEJS: ${ret.msg}` })
        }
    }
}
await client()

// if (eng) { // CHROME
//     window['client'] = client;
// } else { // NODEJS
//     global['client'] = client;
// }











