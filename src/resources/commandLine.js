// const retCommandLine = await commandLine({ 'command': 'notepad' });
// console.log(retCommandLine)

async function commandLine(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (typeof window !== 'undefined') { // [ENCONTRAR DEVICE] CHROME
            const infDevAndFun = { 'name': 'commandLine', 'retUrl': inf.retUrl, 'par': { 'command': inf.command } }
            const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; let command = `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`; const retorno = new Promise((resolve, reject) => {
            _run(command, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => { if (err) { reject(err) } else { resolve('COMMAND LINE: OK') } })
        }); return retorno
            .then((result) => { ret['ret'] = true; ret['msg'] = `${result}`; return ret; }).catch((e) => {
                (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })()
            })
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['commandLine'] = commandLine;
} else { // NODEJS
    global['commandLine'] = commandLine;
}
