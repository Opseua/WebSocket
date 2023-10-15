// PARAMETRO 'retUrl' true/false direto no objeto passado para a funcao

async function devAndFun(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        let dev, r = await configStorage({ 'action': 'get', 'key': 'webSocket' });
        if (!r.ret) { return ret } else { r = r.res }; let stop = false; for (let [index, value] of r.devices.entries()) {
            const a = value; for (let [i, v] of a.functions.entries()) { if (v == inf.name) { dev = value; stop = true; break } }; if (stop) { break }
        }; if (stop) {
            const url = `${r.server[dev.server].url}://${r.server[dev.server].host}:${r.server[dev.server].port}/${dev.name}`
            let par = inf.par; par['devAndFun'] = true; const send = {
                'fun': [{
                    'securityPass': r.securityPass,
                    'funRet': { 'retUrl': inf.retUrl },
                    'funRun': { 'name': inf.name, 'par': par }
                }]
            }; wsSend(url, send); ret['ret'] = true; ret['msg'] = `[ENC] ${inf.name}: OK`;
        }; if (!stop) { ret['msg'] = `\n\n #### ERRO #### DEV AND FUN \n NENHUM DEVICE PARA A FUNCAO '${inf.name}' \n\n` }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['devAndFun'] = devAndFun;
} else { // NODEJS
    global['devAndFun'] = devAndFun;
}