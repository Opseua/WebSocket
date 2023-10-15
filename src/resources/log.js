// const infLog = { 'folder': '#_TESTE_#', 'path': `TESTE.txt`, 'text': 'INF AQUI' }
// const retLog = await log(infLog);
// console.log(retLog)

async function log(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`, hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, pathOk, rewrite = false
        let text = inf.text; pathOk = `log/${inf.folder}`; if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(inf.path)) { pathOk = `${pathOk}/${inf.path}` }
        else if (['log.txt', 'err.txt'].includes(inf.path)) { pathOk = `${pathOk}/${mon}/${day}_${inf.path}`; rewrite = true }
        else { pathOk = `${pathOk}/${mon}/${day}/${hou}_${inf.path}` }
        if (rewrite) { text = typeof text === 'object' ? `${hou}\n${JSON.stringify(inf.text)}\n\n` : `${hou}\n${inf.text}\n\n` }
        const infFile = { 'action': 'write', 'functionLocal': false, 'text': text, 'rewrite': rewrite, 'path': pathOk };
        const retFile = await file(infFile); ret['msg'] = `LOG: OK`; ret['res'] = `${conf[1]}:/${conf[3]}/${pathOk}`; ret['ret'] = true
    } catch (e) { }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['log'] = log;
} else { // NODEJS
    global['log'] = log;
}