// {
//     "fun": [{
//         "securityPass": "####################",
//         "funRet": { "retUrl": false, "retInf": "1111111", "funA": "ARRAY AQUI" },
//         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     },
//     {
//         "securityPass": "####################",
//         "funRet": { "retUrl": false, "retInf": "1111111", "funA": "ARRAY AQUI" },
//         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     }]
// }

async function webSocketRet(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const data = JSON.parse(inf.data); const securityPass = retConfigStorage.securityPass
        let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev0 = `${url}://${host}:${port}/${dev[0].name}`
        function label(f) { return typeof (typeof window !== 'undefined' ? window : global)[f] === 'function' }
        await Promise.all(data.fun.map(async (value, index) => { // --------------------------------------------------
            if (value.securityPass !== securityPass) { ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n` }
            else if (!label(value.funRun.name)) { ret['msg'] = `\n #### FUNCAO '${value.funRun.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n` } else {
                let name; if (typeof window !== 'undefined') { name = window[value.funRun.name] } else { name = global[value.funRun.name] } // ← CHROME   ↓ NODEJS
                let infName = value.funRun.par; let retUrl = false; if (value.funRet && value.funRet.retUrl) {
                    retUrl = typeof value.funRet.retUrl === 'boolean' ? dev0 : `${value.funRet.retUrl}`
                }; infName['retUrl'] = retUrl; let retName = await name(infName); retName = JSON.stringify(retName)
                if (retUrl && !retName.includes('"msg":"[ENC]')) {
                    retName = !value.funRun.par.devAndFun ? retName : retName.replace('"msg":"', '"msg":"[ENC] ')
                    const send = { 'retInf': value.funRet.retInf, 'retWs': JSON.parse(retName), 'fun': value.funRet.fun }; wsSend(retUrl, send)
                }; ret['ret'] = true
            } // --------------------------------------------------
        }))
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
        console.log(ret.msg); const retLog = await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': ret.msg });
        if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) } // CHROME
    }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['webSocketRet'] = webSocketRet;
} else { // NODEJS
    global['webSocketRet'] = webSocketRet;
}