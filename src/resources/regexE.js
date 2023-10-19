async function regexE(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        ret['msg'] = `REGEX E: OK`; const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/)
        if (match && match.length == 3) { ret['a'] = `#### ERRO #### ${match[1]} [${match[2]}]` }
        else { ret['a'] = `NAO IDENTIFICADO [NAO IDENTIFICADA]` }; ret['b'] = inf.e.toString(); ret['res'] = `\n\n ${ret.a} \n ${ret.b} \n\n`
        ret['c'] = typeof window == 'undefined' ? 'ALERTA: NODEJS' : 'ALERTA: CHROME'; ret['d'] = `${ret.a}\n${ret.b.substring(0, 349).replace('\n\n ', '')}`
        if (typeof window == 'undefined') { const retLog = await log({ 'folder': 'JavaScript', 'path': `err.txt`, 'text': ret }) }
        let r = await configStorage({ 'action': 'get', 'key': 'webSocket' }); if (r.ret) {
            r = r.res; let a = { a: 'securityPass', b: 'notification', c: './src/media/notification_3.png', d: 'duration' }; let par = {
                'method': 'POST', 'body': JSON.stringify({
                    'fun': [{ [a.a]: r[a.a], 'funRun': { 'name': a.b, 'par': { [a.d]: 5, 'icon': a.c, 'title': ret.c, 'text': ret.d } } }]
                })
            }; fetch(`http://${r.ws1}:${r.portWebSocket}/${r.device1.name}`, par)
        }; ret['ret'] = true;
    } catch (e) { console.log(`\n\n #### ERRO REGEXe #### ${e} \n\n`) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['regexE'] = regexE;
} else { // NODEJS
    global['regexE'] = regexE;
}