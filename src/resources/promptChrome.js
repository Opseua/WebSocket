// const retPromptChrome = await promptChrome({ 'title': `NOME DO COMANDO` })
// console.log(retPromptChrome)

async function promptChrome(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`; if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
            const infDevAndFun = { 'name': 'promptChrome', 'retUrl': inf.retUrl, 'par': { 'title': inf.title } }
            const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; let retPrompt = prompt(`${title}`); if (!retPrompt) { ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n` } else {

            const infApi = {
                'method': 'POST', 'url': `http://18.119.140.20:8888/OPSEUA_CHROME/`, 'headers': { 'accept-language': 'application/json' },
                'body': { "other": "peroptyx_QueryImageDeservingClassification", "inf": [retPrompt.split(',').map(Number)], "query": "#####" }
            }; const retApi = await api(infApi);

            ret['res'] = retPrompt; ret['ret'] = true; ret['msg'] = 'PROMPT CHROME: OK'
        }
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['promptChrome'] = promptChrome;
} else { // NODEJS
    global['promptChrome'] = promptChrome;
}
