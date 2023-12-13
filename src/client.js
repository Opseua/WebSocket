let e = import.meta.url;
async function client(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, 'client [WebSocket]');

        // DEV - [WEB] WEB {IMPAR}
        let dev1 = devChromeWeb
        let dev3 = letter == 'D' ? devNodeJSWeb : devEC2Web
        // DEV - [LOC] LOCAL {PAR}
        let dev2 = devChromeLocal
        let dev4 = letter == 'D' ? devNodeJSLocal : devEC2Local

        // [WEB-LOC]
        if (letter == 'D') {
            // CONNECT - NOTEBOOK
            await wsConnect({ 'e': e, 'url': [dev1, dev2, dev3, dev4,] })

            // LIST - [WEB] WEB
            wsList(dev3, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
            // LIST - [LOC] LOCAL
            wsList(dev4, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
        } else {
            // ### CONNECT - EC2
            await wsConnect({ 'e': e, 'url': [dev1, dev3,] })

            // LIST - [WEB] WEB
            wsList(dev3, async (nomeList, par1) => {
                runLis(nomeList, par1)
            });
        }

        // RUN LIS
        async function runLis(nomeList, par1) {
            let data = {};
            try {
                data = JSON.parse(par1)
            } catch (e) { };
            if (data.fun) { // FUN
                let infDevFun = { 'ea': e, 'data': data, 'wsOrigin': nomeList }
                let retDevFun = await devFun(infDevFun)
            } else if (data.other) { // OTHER
                console.log('OTHER', data.other)
            } else {
                console.log(`\nMENSAGEM DO WEBSCKET\n\n${par1}\n`)
            }
        }

        // async function keepCookieLiveRun() {
        //     await new Promise(resolve => { setTimeout(resolve, 15000) });
        //     wsSend({ 'e': e, 'url': devChrome, 'message': { 'other': 'keepCookieLive' } })

        // };
        // // keepCookieLiveRun();

        ret['ret'] = true
        ret['msg'] = `CLIENT [Chrome_Extension]: OK`
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











