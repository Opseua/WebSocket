//await import('./@functions.js');
//await new Promise(resolve => { setTimeout(resolve, 2000) })

let _fs, _path, _cheerio, _clipboard, _WebS, _http, _run, gLet = {}, conf = ['src/config.json'];

if (typeof window !== 'undefined') { // CHROME
    _WebS = window.WebSocket
} else { // NODEJS
    const { default: WebSocket } = await import('ws'); _WebS = WebSocket; _fs = await import('fs');
    _path = await import('path'); _cheerio = await import('cheerio');
    const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
    const { default: http } = await import('http'); _http = http;
    const { exec } = await import('child_process'); _run = exec
}

function all() { }; // ******************************************************** NAO USAR !!!
if (typeof window !== 'undefined') { window['all'] = all; } else { global['all'] = all }
// *****************************************************************************************

await import('./api.js') // node chrome
await import('./chatGpt.js') // node chrome
await import('./chromeActions.js') // node chrome
await import('./clipboard.js') // node chrome
await import('./commandLine.js') // node chrome
await import('./configStorage.js') // node chrome
await import('./dateHour.js') // node chrome
await import('./devAndFun.js') // node chrome
await import('./file.js') // node chrome
await import('./getCookies.js') // node chrome
await import('./getPage.js') // node chrome
await import('./hasKey.js') // node chrome
await import('./jsonInterpret.js') // node chrome
await import('./log.js') // node chrome
await import('./notification.js') // node chrome
await import('./orderObj.js') // node chrome
await import('./promptChrome.js') // node chrome
await import('./random.js') // node chrome
await import('./regex.js') // node chrome
await import('./regexE.js') // node chrome
await import('./secToHour.js') // node chrome
await import('./sniffer.js') // node chrome
await import('./splitText.js') // node chrome
await import('./tabSearch.js') // node chrome
await import('./translate.js') // node chrome
await import('./webSocketRet.js') // node chrome
await import('./wsConnect.js') // node chrome

// ############### GLOBAL OBJECT ###############
// await new Promise(resolve => setTimeout(resolve, (1500)));
// gO.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };
// gOAdd(console.log('globalObject [import] ALTERADO →', gO.inf))
const data = { inf: '' }; const listeners = new Set(); const gO = new Proxy(data, {
    set(target, key, value) { target[key] = value; globalChanged(value); listeners.forEach(listener => listener(target)); return true }
}); function gOAdd(listener) { listeners.add(listener) }; function gORem(listener) { listeners.delete(listener) }
async function globalChanged(i) { if (i.alert !== false) {/* console.log('globalObject [export] ALTERADO →', i)*/ } }
// ############### ###############

if (typeof window !== 'undefined') { // CHROME
    // ## bibliotecas
    window['_WebS'] = _WebS;
    // ## variaveis
    window['gLet'] = gLet; window['conf'] = conf;
    // ## global object
    window['gO'] = gO; window['gOAdd'] = gOAdd; window['gORem'] = gORem;
} else { // NODEJS 
    // ## bibliotecas
    global['_WebS'] = _WebS; global['_fs'] = _fs; global['_path'] = _path;
    global['_cheerio'] = _cheerio; global['_clipboard'] = _clipboard;
    global['_http'] = _http; global['_run'] = _run
    // ## variaveis
    global['gLet'] = gLet; global['conf'] = conf;
    // ## global object
    global['gO'] = gO; global['gOAdd'] = gOAdd; global['gORem'] = gORem;

    const { WebSocketServer } = await import('ws'); global['_WebSServer'] = WebSocketServer;
}

// OBRIGATORIO FICAR APOS O EXPORT GLOBAL, NAO SUBIR!!!
const infFile = { 'action': 'inf' };
let retFile = await file(infFile);
if (typeof window !== 'undefined') { // CHROME
    conf = window['conf'] = retFile.res
} else { // NODEJS 
    conf = global['conf'] = retFile.res
}































// ############################## ANTIGO




// let _fs, _path, _cheerio, _clipboard, _WebS, _http, _run, gLet = {}, conf = ['src/config.json']; if (typeof window !== 'undefined') { _WebS = window.WebSocket }
// else { // ← CHROME ↓ NODEJS
//     _fs = await import('fs'); _path = await import('path'); _cheerio = await import('cheerio'); const { default: clipboard } = await import('clipboardy'); _clipboard = clipboard;
//     const { default: WebSocket } = await import('ws'); _WebS = WebSocket; const { default: http } = await import('http'); _http = http
//     const { exec } = await import('child_process'); _run = exec
// }

// // await import('./@functions.js');

// // let infApi, retApi
// // infApi = { // ########## TYPE → text
// //     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'content-type': 'text/plain;charset=UTF-8' }, 'body': '{"topic":"OPSEUA","message":"a"}'
// // }; infApi = { // ########## TYPE → json
// //     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'accept-language': 'application/json' }, 'body': { 'Chave': 'aaa', 'Valor': 'bbb' }
// // }; const formData = new URLSearchParams(); // ########## TYPE → x-www-form-urlencoded
// // formData.append('grant_type', 'client_credentials');
// // formData.append('resource', 'https://graph.microsoft.com'); infApi = {
// //     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, 'body': formData.toString()
// // }; retApi = await api(infApi); console.log(retApi)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // let infFile, retFile
// // infFile = { 'action': 'inf' }
// // infFile = { 'action': 'write', 'functionLocal': true, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
// // infFile = { 'action': 'read', 'functionLocal': true, 'path': './PASTA/ola.txt' }
// // infFile = { 'action': 'list', 'functionLocal': true, 'path': './PASTA/', 'max': 10 }
// // infFile = { 'action': 'change', 'functionLocal': true, 'path': './PASTA/', 'pathNew': './PASTA2/' }
// // infFile = { 'action': 'del', 'functionLocal': true, 'path': './PASTA2/' }
// // retFile = await file(infFile); console.log(retFile)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // let infConfigStorage, retConfigStorage; 
// // infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// // infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' }
// // infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
// // retConfigStorage = await configStorage(infConfigStorage); console.log(retConfigStorage)
// // @@
// // let csf = configStorage, cs; gLet = 'AAAAAAA'; cs = await csf([gLet]); gLet = cs.res; console.log('######', gLet)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const retDateHour = dateHour(); console.log(retDateHour)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infRandom = { 'min': 3, 'max': 10, 'await': true }; const retRandom = await random(infRandom); console.log(retRandom)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // for (let i = 0; i < 10; i++) { console.log(`Iteração ${i + 1}`) }
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // let i = 0; const loop = ['A', 'B', 'C', 'D', 'E']; async function runLoop() {
// //   while (i < loop.length) { i++; console.log(loop[i - 1]);
// //     if (loop[i - 1] == 'C') {  break };  const infRandom = { 'min': 1, 'max': 5, 'await': true }; const retRandom = await random(infRandom)
// //   }; console.log('Loop concluído!');
// // } ; runLoop();
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infRegex = { 'pattern': 'UM(.*?)TRES', 'text': 'UMDOISTRES' }
// // const infRegex = { 'simple': true, 'pattern': '*DOIS*', 'text': 'UMDOISTRES' }
// // const retRegex = regex(infRegex); console.log(retRegex)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // await new Promise(resolve => setTimeout(resolve, (2500)));
// // globalObject.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL';  const json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// // const infJsonInterpret = { 'json': json, 'vars': infGlobal };  let retJsonInterpret = await jsonInterpret(infJsonInterpret)
// // if (retJsonInterpret.ret) { retJsonInterpret = JSON.parse(retJsonInterpret.res) }; console.log(retJsonInterpret)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // await log({ 'folder': '#_TESTE_#', 'path': `TESTE.txt`, 'text': 'INF AQUI' })
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } };
// // const infHasKey = { 'key': 'chave3', 'obj': objeto }; const retHaskey = hasKey(infHasKey); console.log(retHaskey)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const retClipboard = await clipboard({ 'value': `Esse é o texto` }); console.log(retClipboard)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` }; const retTranslate = await translate(infTranslate);console.log(retTranslate)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // let infChatGpt = { 'provider': 'open.ai', 'input': `Qual a idade de Marte?` }; let retChatGpt = await chatGpt(infChatGpt); console.log(retChatGpt.res)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infChromeActions = { 'action': 'badge', 'text': 'OLA' }
// // const retChromeActions = await chromeActions(infChromeActions); console.log(retChromeActions)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }
// // const retGetCookies = await getCookies(infGetCookies); console.log(retGetCookies);
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infNotification = {
// //     'duration': 2, 'icon': './src/media/icon_4.png', 'buttons': [{ 'title': 'BOTAO 1' }, { 'title': 'BOTAO 2' }],
// //     'title': `TITULO`, 'text': 'TEXTO',
// // }; const retNotification = await notification(infNotification); console.log(retNotification)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const retPromptChrome = await promptChrome({ 'title': `NOME DO COMANDO` }); console.log(retPromptChrome)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const retGetPage = await getPage({ 'id': retTabSearch.res.id }); console.log(retGetPage)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infSniffer = { 'newReqSend': false, 'arrUrl': ['*google*'] } ; const retSniffer = await sniffer(infSniffer); console.log(retSniffer)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infTabSearch = { 'search': '*google*', 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': 'https://www.google.com/' }
// // const retTabSearch = await tabSearch(infTabSearch); console.log(retTabSearch)  // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const retCommandLine = await commandLine({ 'command': 'notepad' }); console.log(retCommandLine)
// // - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// // const infSplitText = { 'maxLength': 30, 'text': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' }
// // const retSplitText = await splitText(infSplitText); console.log(retSplitText)


// // ################################################################
// // for (const nameKey in json.taskName) { console.log(nameKey) }

// // async function exemploAsync() {
// //     const array = ['A', 'B', 'C', 'D', 'E']; for (let [index, value] of array.entries()) {
// //         await new Promise(resolve => { setTimeout(resolve, 1000) }); console.log('INDEX:', index, 'VALUE:', value)
// //     }; console.log('FIM')
// // }; exemploAsync()

// // await new Promise(resolve => setTimeout(resolve, (1500)));
// // gO.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };
// // gOAdd(console.log('globalObject [import] ALTERADO →', gO.inf))

// // ## resources
// await import('./excel.js');
// // ## scripts
// await import('../scripts/command1.js'); await import('../scripts/command2.js'); await import('../scripts/oneForma_MTPE.js');
// await import('../scripts/peroptyx_Search20.js'); await import('../scripts/peroptyx_QueryImageDeservingClassification.js');

// async function api(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
//             const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
//             if (inf.headers) { reqOpt['headers'] = inf.headers }
//             if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) { reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body }
//             const req = UrlFetchApp.fetch(inf.url, reqOpt); const resHeaders = req.getAllHeaders();
//             const resBody = req.getContentText(); ret['ret'] = true; ret['msg'] = 'API: OK';
//             ret['res'] = { 'code': req.getResponseCode(), 'headers': resHeaders, 'body': resBody }
//         } else { // ######################################### NODEJS ou CHROME
//             const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
//             if (inf.headers) { reqOpt['headers'] = inf.headers }; if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
//                 reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
//             }; const req = await fetch(inf.url, reqOpt); const resHeaders = {}; req.headers.forEach((value, name) => { resHeaders[name] = value })
//             const resBody = await req.text(); ret['ret'] = true; ret['msg'] = 'API: OK'; ret['res'] = { 'code': req.status, 'headers': resHeaders, 'body': resBody }
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function file(inf) {
//     let ret = { 'ret': false }; try { // PASSAR NO jsonInterpret
//         if (/\$\[[^\]]+\]/.test(JSON.stringify(inf))) { let rji = await jsonInterpret({ 'json': inf }); if (rji.ret) { rji = JSON.parse(rji.res); inf = rji } }
//         if (!inf.action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change'].includes(inf.action)) {
//             ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
//         } else if (typeof inf.functionLocal !== 'boolean' && inf.action !== 'inf' && !inf.path.includes(':')) {
//             ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'functionLocal' \n\n`
//         } else if (inf.action !== 'inf' && (!inf.path || inf.path == '')) { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n` } else {
//             let infFile, retFile, path, retFetch = '', text, jsonFile, functionLocal, fileOk, e, relative, pathFull, relativeParts, retRelative, pathOld, pathNew
//             if (inf.action == 'write') { // ########################## WRITE
//                 if (typeof inf.rewrite !== 'boolean') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`; }
//                 else if (!inf.text || inf.text == '') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'text' \n\n`; } else {
//                     text = typeof inf.text === 'object' ? JSON.stringify(inf.text) : inf.text
//                     if (inf.path.includes(':')) { path = inf.path; if (typeof window !== 'undefined') { path = path.split(':/')[1] } } else {
//                         infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
//                         retFile = await file(infFile); path = retFile.res[0]
//                     }; if (typeof window !== 'undefined') { // CHROME
//                         if (path.includes('%/')) { path = path.split('%/')[1] } else if (path.includes(':')) { path = path.split(':/')[1] } else { path = path };
//                         if (inf.rewrite) {
//                             try {
//                                 infFile = { 'action': 'read', 'path': path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
//                                 retFile = await file(infFile); if (retFile.ret) { retFetch = retFile.res }; text = `${retFetch}${text}`
//                             } catch (e) { }
//                         }; const blob = new Blob([text], { type: 'text/plain' }); const downloadOptions = { // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
//                             url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite'
//                         }; chrome.downloads.download(downloadOptions)
//                     } else { // NODEJS
//                         await _fs.promises.mkdir(_path.dirname(path), { recursive: true }); await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' })
//                     }; ret['ret'] = true; ret['msg'] = `FILE WRITE: OK`
//                 }
//             } else if (inf.action == 'read') { // ########################## READ
//                 if (inf.path.includes(':')) { path = inf.path } else {
//                     infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
//                 }; if (typeof window !== 'undefined') { // CHROME
//                     if (!inf.functionLocal) { path = `file:///${path}` }; retFetch = await fetch(path.replace('%', '')); retFetch = await retFetch.text()
//                 } else { retFetch = await _fs.promises.readFile(path, 'utf8') }; ret['ret'] = true; ret['msg'] = `FILE READ: OK`; ret['res'] = retFetch; // NODEJS
//             } else if (inf.action == 'del' && typeof window == 'undefined') { // ########################## DEL
//                 if (inf.path.includes(':')) { path = inf.path } else {
//                     infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
//                 }; async function delP(inf) {
//                     try {
//                         const s = await _fs.promises.stat(inf); if (s.isDirectory()) {
//                             const as = await _fs.promises.readdir(inf); for (const a of as) { const c = _path.join(inf, a); await delP(c) }; await _fs.promises.rmdir(inf)
//                         } else { await _fs.promises.unlink(inf) }; ret['ret'] = true; ret['msg'] = `FILE DEL: OK`;
//                     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = `\n\n #### ERRO #### FILE DEL \n ${m.res} \n\n` }
//                 }; await delP(path)
//             } else if (inf.action == 'inf') { // INF [0] config.json | [1] letra | [2] caminho do projeto atual | [3] path download/terminal | [4] arquivo atual
//                 e = JSON.stringify(new Error().stack).replace('at ', '').replace('run (', ''); if (conf.length == 1) { // NOME DO PROJETO E TERMINAL
//                     if (typeof window !== 'undefined') { // CHROME
//                         functionLocal = chrome.runtime.getURL('').slice(0, -1)
//                         jsonFile = await fetch(`${functionLocal}/${conf[0]}`); jsonFile = JSON.parse(await jsonFile.text()).conf
//                         text = e; const pattern = new RegExp(`at ${functionLocal}/(.*?)\\.js`)
//                         const res = text.match(pattern); fileOk = res[1]; conf = [conf[0], jsonFile[0], functionLocal, jsonFile[1], fileOk]
//                     } else { // NODEJS
//                         functionLocal = e.match(/ file:\/\/\/(.*?)\.js:/)[1]; fileOk = functionLocal.charAt(0).toUpperCase() + functionLocal.slice(1);
//                         async function getRoot(inf) {
//                             try { await _fs.promises.access(`${inf}/package.json`); return inf }
//                             catch { const p = inf.split('/').slice(0, -1).join('/'); return p == inf ? null : getRoot(p) }
//                         }; functionLocal = await getRoot(fileOk);
//                         fileOk = fileOk.replace(`${functionLocal}/`, ''); jsonFile = await _fs.promises.readFile(`${functionLocal}/${conf}`, 'utf8');
//                         jsonFile = JSON.parse(jsonFile).conf
//                         conf = [conf[0], jsonFile[0], functionLocal.split(':/')[1], process.cwd().replace(/\\/g, '/').split(':/')[1], `${fileOk}.js`]
//                     }
//                 } else { // NOME DO ARQUIVO
//                     text = e; const pattern = new RegExp(`at.*?${typeof window !== 'undefined' ? conf[2] : conf[3]}(.*?)\\.js`)
//                     const res = text.match(pattern); fileOk = `${res[1].slice(1)}.js`; conf[4] = fileOk
//                 }; ret['ret'] = true; ret['msg'] = `FILE INF: OK`; ret['res'] = conf
//             } else if (inf.action == 'relative') { // ########################## RELATIVE
//                 relative = inf.path; function runPath(pp, par) {
//                     if (pp.startsWith('./')) { pp = pp.slice(2) } else if (relative.startsWith('/')) { pp = pp.slice(1) }
//                     pathFull = conf[par].split('/'); relativeParts = pp.split('/');
//                     while (pathFull.length > 0 && relativeParts[0] == '..') { pathFull.pop(); relativeParts.shift(); }
//                     retRelative = pathFull.concat(relativeParts).join('/'); if (retRelative.endsWith('/.')) { retRelative = retRelative.slice(0, -2); }
//                     else if (retRelative.endsWith('.') || retRelative.endsWith('/')) { retRelative = retRelative.slice(0, -1); }; return retRelative
//                 }; ret['ret'] = true; ret['msg'] = `FILE RELATIVE: OK`
//                 ret['res'] = [`${typeof window !== 'undefined' && inf.functionLocal ? '' : `${conf[1]}:/`}${runPath(inf.path, inf.functionLocal ? 2 : 3)}`]
//             } else if (inf.action == 'list' && typeof window == 'undefined') { // ########################## LIST
//                 if (!inf.max || inf.max == '') { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`; } else {
//                     if (inf.path.includes(':')) { path = inf.path } else {
//                         infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
//                     }; let retFilesList = { 'path': path, 'max': inf.max }; function formatBytes(b, d = 2) {
//                         if (b == 0) return '0 Bytes'; const i = Math.floor(Math.log(b) / Math.log(1024));
//                         return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
//                     }; let iFilesList = 0; async function filesList(inf, files = []) {
//                         try {
//                             for (const fileOk of _fs.readdirSync(inf.path)) {
//                                 if (iFilesList >= inf.max) { break }; const name = `${inf.path}/${fileOk}`; try {
//                                     if (_fs.statSync(name).isDirectory()) { filesList({ 'max': inf.max, 'path': name }, files) } else {
//                                         iFilesList++; const stats = _fs.statSync(name)
//                                         files.push({ 'ret': true, 'file': fileOk, 'path': name, 'size': formatBytes(stats.size), 'edit': stats.mtime })
//                                     }
//                                 } catch (e) { iFilesList++; files.push({ 'ret': false, 'file': fileOk, 'path': name, 'e': JSON.stringify(e) }) }
//                             }; return files;
//                         } catch (e) { iFilesList++; files.push({ 'ret': false, 'e': JSON.stringify(e) }) }
//                     }; retFilesList = await filesList(retFilesList); ret['ret'] = true; ret['msg'] = `FILE LIST: OK`; ret['res'] = retFilesList;
//                 }
//             } else if (inf.action == 'change') {
//                 if (!inf.pathNew || inf.pathNew == '') { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'pathNew' \n\n`; } else {
//                     if (inf.path.includes(':')) { pathOld = inf.path } else {
//                         infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); pathOld = retFile.res[0]
//                     }; if (inf.pathNew.includes(':')) { pathNew = inf.pathNew } else {
//                         infFile = { 'action': 'relative', 'path': inf.pathNew, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); pathNew = retFile.res[0]
//                     }; await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true }); await _fs.promises.rename(pathOld, pathNew);
//                     ret['ret'] = true; ret['msg'] = `FILE CHANGE: OK`
//                 }
//             }
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function configStorage(inf) {
//     let ret = { 'ret': false }; try {
//         if (inf instanceof Array && inf.length == 1) { // ### CS
//             inf['path'] = `${conf[1]}:/${conf[2]}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
//                 rf = await file({ 'action': 'read', 'path': inf.path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
//             } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
//             if (!rf.ret) { rf = await file({ 'action': 'write', 'path': inf.path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
//             ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK'
//         } else {
//             let run = false; if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'action' \n\n` } else {
//                 if ((!inf.key || inf.key == '')) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR A 'key' \n\n`; }
//                 else { if (inf.action == 'set' && !inf.value) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'value' \n\n` } else { run = true } }
//             }; if (run) {
//                 if (typeof window !== 'undefined') { // CHROME
//                     if (inf.action == 'set') { // #### STORAGE: SET
//                         await storageSet(inf); async function storageSet(inf) {
//                             return new Promise((resolve) => {
//                                 const data = {}; data[inf.key] = inf.value; chrome.storage.local.set(data, async () => {
//                                     if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n` }
//                                     else { ret['ret'] = true; ret['msg'] = 'STORAGE SET: OK' }; resolve(ret);
//                                 });
//                             });
//                         }
//                     } else if (inf.action == 'get') { // #### STORAGE: GET
//                         await storageGet(inf); async function storageGet(inf) {
//                             return new Promise((resolve) => {
//                                 chrome.storage.local.get(inf.key, async (result) => {
//                                     if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n` }
//                                     else if (Object.keys(result).length == 0) {
//                                         async function checkConfig() {
//                                             const infFile = { 'action': 'read', 'path': conf[0], 'functionLocal': true }
//                                             const retFile = await file(infFile); const config = JSON.parse(retFile.res);
//                                             if (config[inf.key]) {
//                                                 const data = {}; data[inf.key] = config[inf.key]; return new Promise((resolve) => {
//                                                     chrome.storage.local.set(data, async () => {
//                                                         if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n` }
//                                                         else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = config[inf.key] }; resolve(ret)
//                                                     });
//                                                 })
//                                             } else { ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
//                                         }; await checkConfig()
//                                     } else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = result[inf.key] }; resolve(ret);
//                                 });
//                             });
//                         }
//                     } else if (inf.action == 'del') { // #### STORAGE: DEL
//                         await storageDel(inf); async function storageDel(inf) {
//                             return new Promise((resolve) => {
//                                 chrome.storage.local.get(inf.key, async (result) => {
//                                     if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n` }
//                                     else if (Object.keys(result).length == 0) { ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n` }
//                                     else { chrome.storage.local.remove(inf.key, async () => { }); ret['ret'] = true; ret['msg'] = 'STORAGE DEL: OK' }; resolve(ret)
//                                 }); return
//                             });
//                         }
//                     }
//                 } else { // ################## NODE
//                     let infFile, retFile, config, path, ret_Fs = false; if (inf.path && inf.path.includes(':')) { path = inf.path } else {
//                         if (inf.path && typeof inf.functionLocal == 'boolean') { infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal } }
//                         else { infFile = { 'action': 'relative', 'path': conf[0], 'functionLocal': true } }; retFile = await file(infFile); path = retFile.res[0]
//                     }; try { await _fs.promises.access(path); ret_Fs = true } catch (e) { }
//                     if (ret_Fs) { const configFile = await _fs.promises.readFile(path, 'utf8'); config = JSON.parse(configFile) } else { config = {} }
//                     if (!inf.key || inf.key == '') { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR A 'key' \n\n`; }
//                     else if (inf.action == 'set') { // #### CONFIG: SET
//                         if (!inf.value && !inf.value == false) { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR O 'value' \n\n` } else {
//                             if (inf.key == '*' && typeof inf.value !== 'object') { ret['msg'] = `\n\n #### ERRO #### CONFIG \n VALOR NAO É OBJETO \n\n` }
//                             else if (inf.key == '*') { config = inf.value } else { config[inf.key] = inf.value }; if (!ret.msg) {
//                                 infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
//                                 retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG SET: OK`
//                             }
//                         }
//                     } else if (inf.action == 'get') { // #### CONFIG NODE: GET
//                         if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n ARQUIVO '${path}' NAO ENCONTRADO \n\n` }
//                         else if (inf.key == '*' || (inf.key !== '*' && config[inf.key])) {
//                             ret['ret'] = true; ret['msg'] = `CONFIG GET: OK`; ret['res'] = inf.key == '*' ? config : config[inf.key]
//                         } else { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n` }
//                     } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
//                         if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL\n ARQUIVO '${path}' NAO ENCONTRADO \n\n` } else if (config[inf.key]) {
//                             delete config[inf.key]; infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
//                             retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG DEL: OK`
//                         } else { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
//                     }
//                 }
//             }
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// function dateHour(inf = 0) { // NAO POR COMO 'async'!!!
//     let ret = { 'ret': false }; try {
//         const dt1 = new Date(); dt1.setSeconds(new Date().getSeconds() + inf).setSeconds; const dt2 = Date.now() + (inf * 1000); ret['res'] = {
//             'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
//             'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
//             'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'),
//             'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)), 'timMil': String(dt2.toString()),
//             'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
//         }; ret['ret'] = true; ret['msg'] = `DATE HOUR: OK`  // manter o 'String' para forcar o '0' (zero) na frente → '001'
//     } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// function secToHour(inf) { // NAO POR COMO 'async'!!!
//     let ret = { 'ret': false }; try {
//         const hou = Math.floor(inf / 3600).toString().padStart(2, "0"); const min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
//         const sec = (inf % 60).toString().padStart(2, "0"); ret['res'] = String(`${hou}:${min}:${sec}`)
//         ret['ret'] = true; ret['msg'] = `SEC TO HOUR: OK` // manter o 'String' para forcar o '0' (zero) na frente → '001'
//     } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// function regex(inf) { // NAO POR COMO 'async'!!!
//     let ret = { 'ret': false }; try {
//         if (inf.pattern.includes('(.*?)')) {
//             let res = {}; let ok = false; const patternSplit = inf.pattern.split('(.*?)'); const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
//             const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&'); const result1 = inf.text.match(`${split1}(.*?)${split2}`);
//             const result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`); const result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
//             const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
//             res['0'] = `res.['1'] → [-|<] | res.['2'] → [-|>] | res.['3'] → [^|<] | res.['4'] → [^|>]`
//             if (result1 && result1.length > 0) { res['1'] = result1[1]; ok = true } else { res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
//             if (result2 && result2.length > 0) { res['2'] = result2[1]; ok = true } else { res['2'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
//             if (result3 && result3.length > 0) { res['3'] = result3[1]; ok = true } else { res['3'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
//             if (result4 && result4.length > 0) { res['4'] = result4[1]; ok = true } else { res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
//             if (ok) { ret['msg'] = `REGEX: OK`; ret['res'] = res; ret['ret'] = true }
//         } else {
//             const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'); const result = new RegExp(`^${pattern}$`).test(inf.text);
//             if (inf.simple) { if (result) { return true } else { return false } } else {
//                 if (result) { ret['msg'] = `REGEX: OK`; ret['res'] = 'TEXTO POSSUI O PADRAO'; ret['ret'] = true; }
//                 else { ret['msg'] = `\n\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`; }
//             }
//         }
//     } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; return ret })() }; return ret
// }

// async function random(inf) {
//     let ret = { 'ret': false }; try {
//         const min = inf.min; const max = inf.max; const message = inf.await ? true : false
//         const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
//         if (message) { console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`); await new Promise(resolve => setTimeout(resolve, number)); }
//         ret['ret'] = true; ret['msg'] = `RANDON: OK`; ret['res'] = number / 1000;
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// // ############### GLOBAL OBJECT ###############
// const data = { inf: '' }; const listeners = new Set(); const gO = new Proxy(data, {
//     set(target, key, value) { target[key] = value; globalChanged(value); listeners.forEach(listener => listener(target)); return true }
// }); function gOAdd(listener) { listeners.add(listener) }; function gORem(listener) { listeners.delete(listener) }
// async function globalChanged(i) { if (i.alert !== false) {/* console.log('globalObject [export] ALTERADO →', i)*/ } }
// // ############### ###############

// async function regexE(inf) {
//     let ret = { 'ret': false }; try {
//         ret['msg'] = `REGEX E: OK`; const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/)
//         if (match && match.length == 3) { ret['a'] = `#### ERRO #### ${match[1]} [${match[2]}]` }
//         else { ret['a'] = `NAO IDENTIFICADO [NAO IDENTIFICADA]` }; ret['b'] = inf.e.toString(); ret['res'] = `\n\n ${ret.a} \n ${ret.b} \n\n`
//         ret['c'] = typeof window == 'undefined' ? 'ALERTA: NODEJS' : 'ALERTA: CHROME'; ret['d'] = `${ret.a}\n${ret.b.substring(0, 349).replace('\n\n ', '')}`
//         if (typeof window == 'undefined') { const retLog = await log({ 'folder': 'JavaScript', 'path': `err.txt`, 'text': ret }) }
//         let r = await configStorage({ 'action': 'get', 'key': 'webSocket' }); if (r.ret) {
//             r = r.res; let a = { a: 'securityPass', b: 'notification', c: './src/media/notification_3.png', d: 'duration' }; let par = {
//                 'method': 'POST', 'body': JSON.stringify({
//                     'fun': [{ [a.a]: r[a.a], 'funRun': { 'name': a.b, 'par': { [a.d]: 5, 'icon': a.c, 'title': ret.c, 'text': ret.d } } }]
//                 })
//             }; fetch(`http://${r.ws1}:${r.portWebSocket}/${r.device1.name}`, par)
//         }; ret['ret'] = true;
//     } catch (e) { console.log(`\n\n #### ERRO REGEXe #### ${e} \n\n`) } return ret
// }

// function orderObj(o) { return Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0]))) }

// async function jsonInterpret(inf) {
//     let ret = { 'ret': false }; try {
//         const json = JSON.stringify(inf.json); const res = json.replace(/\$\[(.*?)\]/g, (match, p1) => g[p1])
//         ret['ret'] = true; ret['msg'] = `JSON INTERPRET: OK`; ret['res'] = res;
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function log(inf) {
//     let ret = { 'ret': false }; try {
//         let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`, hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, pathOk, rewrite = false
//         let text = inf.text; pathOk = `log/${inf.folder}`; if (['reg.txt', 'reg1.txt', 'reg2.txt', 'reset.js'].includes(inf.path)) { pathOk = `${pathOk}/${inf.path}` }
//         else if (['log.txt', 'err.txt'].includes(inf.path)) { pathOk = `${pathOk}/${mon}/${day}_${inf.path}`; rewrite = true }
//         else { pathOk = `${pathOk}/${mon}/${day}/${hou}_${inf.path}` }
//         if (rewrite) { text = typeof text === 'object' ? `${hou}\n${JSON.stringify(inf.text)}\n\n` : `${hou}\n${inf.text}\n\n` }
//         const infFile = { 'action': 'write', 'functionLocal': false, 'text': text, 'rewrite': rewrite, 'path': pathOk };
//         const retFile = await file(infFile); ret['msg'] = `LOG: OK`; ret['res'] = `${conf[1]}:/${conf[3]}/${pathOk}`; ret['ret'] = true
//     } catch (e) { }; return ret
// }

// function hasKey(inf) { // NAO POR COMO 'async'!!!
//     let ret = { 'ret': false }; try {
//         function hk(key, obj) {
//             if (obj.hasOwnProperty(key)) { return true }; for (let prop in obj) {
//                 if (typeof obj[prop] === 'object' && obj[prop] !== null) { if (hk(key, obj[prop])) { return true } }
//             }; return false
//         }; ret['msg'] = `HAS KEY: OK`; ret['res'] = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj)); ret['ret'] = true
//     } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function clipboard(inf) {
//     let ret = { 'ret': false }; try {
//         if (inf.value == null || inf.value == '') { ret['msg'] = `\n\n #### ERRO #### CLIPBOARD \n INFORMAR O 'value' \n\n` } else {
//             let text = inf.value; if (typeof text === 'object') { text = JSON.stringify(text, null, 2) }  // OBJETO INDENTADO EM TEXTO BRUTO
//             if (typeof window !== 'undefined') { // CHROME
//                 const element = document.createElement('textarea'); element.value = text; document.body.appendChild(element);
//                 element.select(); document.execCommand('copy'); document.body.removeChild(element)
//             } else { _clipboard.writeSync(text) }; ret['ret'] = true; ret['msg'] = 'CLIPBOARD: OK' // NODEJS
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function translate(inf) {
//     let ret = { 'ret': false }; try {
//         const infApi = { method: 'GET', url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`, headers: {} };
//         const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = retApi.res.body;
//         const retRegex = regex({ 'pattern': 'class="result-container">(.*?)</div>', 'text': res }); if (!retRegex.ret) { return ret }; let d, $
//         if (typeof window !== 'undefined') { d = new DOMParser().parseFromString(retRegex.res['3'], "text/html").documentElement.textContent } // CHROME
//         else { $ = _cheerio.load(retRegex.res['3']); d = _cheerio.load($('body').html())('body').text() } ret['res'] = d; ret['ret'] = true; ret['msg'] = `TRANSLATE: OK` // NODEJS
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function webSocketRet(inf) {

//     // {
//     //     "fun": [{
//     //         "securityPass": "####################",
//     //         "funRet": { "retUrl": false, "retInf": "1111111", "funA": "ARRAY AQUI" },
//     //         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     //     },
//     //     {
//     //         "securityPass": "####################",
//     //         "funRet": { "retUrl": false, "retInf": "1111111", "funA": "ARRAY AQUI" },
//     //         "funRun": { "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" } }
//     //     }]
//     // }

//     let ret = { 'ret': false }; try {
//         const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
//         if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
//         const data = JSON.parse(inf.data); const securityPass = retConfigStorage.securityPass
//         let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices; let dev0 = `${url}://${host}:${port}/${dev[0].name}`
//         function label(f) { return typeof (typeof window !== 'undefined' ? window : global)[f] === 'function' }
//         await Promise.all(data.fun.map(async (value, index) => { // --------------------------------------------------
//             if (value.securityPass !== securityPass) { ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n` }
//             else if (!label(value.funRun.name)) { ret['msg'] = `\n #### FUNCAO '${value.funRun.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n` } else {
//                 let name; if (typeof window !== 'undefined') { name = window[value.funRun.name] } else { name = global[value.funRun.name] } // ← CHROME   ↓ NODEJS
//                 const infName = value.funRun.par; const retName = await name(infName); if (value.funRet && value.funRet.retUrl) {
//                     let wsRet = typeof value.funRet.retUrl === 'boolean' ? dev0 : `${value.funRet.retUrl}`
//                     const send = { 'retInf': value.funRet.retInf, 'retWs': retName, 'fun': value.funRet.fun }; wsSend(wsRet, send)
//                 }; ret['ret'] = true
//             } // --------------------------------------------------
//         }))
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) {
//         console.log(ret.msg); const retLog = await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': ret.msg });
//         if (typeof window !== 'undefined') { const retConfigStorage = await configStorage({ 'action': 'del', 'key': 'webSocket' }) } // CHROME
//     }; return ret
// }

// async function chatGpt(inf) { // https://chat.openai.com/api/auth/session
//     let ret = { 'ret': false }; try {
//         let infConfigStorage, retConfigStorage; if (inf.provider == 'ora.ai') { // ######## ora.ai
//             infConfigStorage = { 'action': 'get', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
//             if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; if (!retConfigStorage['cookie']) {
//                 const infTabSearch = { 'search': retConfigStorage['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage['Referer'] }
//                 const retTabSearch = await tabSearch(infTabSearch); if (!retTabSearch.ret) {
//                     let infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO ABRIR CHATGPT`, 'text': `Não foi possível abrir a aba` }
//                     await notification(infNotification); return ret
//                 }; const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }; const retGetCookies = await getCookies(infGetCookies)
//                 if (!(retGetCookies.ret)) {
//                     if (typeof window !== 'undefined') { // CHROME
//                         infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
//                     }; if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; let infNotification = {
//                         'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PEGAR COOKIE CHATGPT`, 'text': `Verificar se a aba abriu e se está logado`
//                     }; await notification(infNotification); return ret
//                 }; retConfigStorage['cookie'] = retGetCookies.res.concat; infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
//                 const retSETConfigStorage = await configStorage(infConfigStorage); if (!retSETConfigStorage.ret) { return ret }
//             }; const infApi = {
//                 method: 'POST', url: 'https://ora.ai/api/conversation', headers: {
//                     "accept": "*/*", "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
//                     "content-type": "application/json", "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
//                     "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors",
//                     "sec-fetch-site": "same-origin", "Referer": retConfigStorage['Referer'], "cookie": retConfigStorage['cookie'],
//                     "Referrer-Policy": "strict-origin-when-cross-origin"
//                 },
//                 body: { "chatbotId": retConfigStorage['chatbotId'], "input": inf.input, "conversationId": retConfigStorage['conversationId'], "userId": retConfigStorage['userId'], "provider": "OPEN_AI", "config": false, "includeHistory": true }
//             }; const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = JSON.parse(retApi.res.body);
//             if ('response' in res) { ret['res'] = res.response; ret['ret'] = true; ret['msg'] = `CHAT GPT ORA AI: OK` } else { // CHROME
//                 if (typeof window !== 'undefined') { infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage) };
//                 let infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
//                 await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT ORA AI \n ${res.error.message} \n\n`; ret['res'] = res.error.message; ret['ret'] = true;
//             }
//         } else if (inf.provider == 'open.ai') { // ######## open.ai
//             infConfigStorage = { 'action': 'get', 'key': 'chatGptOpenAi' }; retConfigStorage = await configStorage(infConfigStorage)
//             if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const infApi = {
//                 'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`,
//                 'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}` },
//                 'body': { 'model': 'gpt-3.5-turbo', 'messages': [{ 'role': 'user', 'content': inf.input }], 'temperature': 0.7 }
//             }; const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = JSON.parse(retApi.res.body);
//             if ('choices' in res) { ret['res'] = res.choices[0].message.content; ret['ret'] = true; ret['msg'] = `CHAT GPT OPEN AI: OK` } else { // CHROME
//                 if (typeof window !== 'undefined') { infConfigStorage = { 'action': 'del', 'key': 'chatGptOpenAi' }; retConfigStorage = await configStorage(infConfigStorage) }
//                 let infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': res.error.message }
//                 await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT OPEN AI \n ${res.error.message} \n\n`; ret['res'] = res.error.message
//             }
//         } else if (inf.provider == 'aichatos') { // ######## aichatos
//             const infApi = {
//                 'method': 'POST', 'url': `https://api.aichatos.cloud/api/generateStream`, 'headers': {
//                     'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//                     'accept': 'application/json, text/plain, */*', 'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua-mobile': '?0',
//                     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
//                     'sec-ch-ua-platform': '"Windows"', 'origin': 'https://chat9.yqcloud.top', 'sec-fetch-site': 'cross-site',
//                     'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty', 'referer': 'https://chat9.yqcloud.top/',
//                     'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6'
//                 }, 'body': { "prompt": inf.input, "userId": `#/chat/${dateHour().res.timMil}`, "network": false, "system": "", "withoutContext": false, "stream": false }
//             }; const retApi = await api(infApi); if (!retApi.ret || retApi.res.code !== 200) { return ret }
//             if (retApi.res.code == 200) { ret['res'] = retApi.res.body; ret['ret'] = true; ret['msg'] = `CHAT GPT AI CHATOS: OK` } else {
//                 let infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
//                 await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT AI CHATOS \n \n\n`
//             }
//         } else if (inf.provider == 'ec2') { // ######## ec2
//             infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
//             if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }; const infApi = {
//                 'method': 'POST', 'url': `http://${retConfigStorage.ws1}:${retConfigStorage.portWebSocket}/chatgpt`,
//                 'headers': {}, 'body': { "prompt": inf.input, "network": inf.network ? true : false }
//             }; const retApi = await api(infApi); if (!retApi.ret) { return ret }
//             if (JSON.parse(retApi.res.body).ret) { ret['res'] = JSON.parse(retApi.res.body).res; ret['ret'] = true; ret['msg'] = `CHAT GPT EC2: OK` } else {
//                 let infNotification = { 'duration': 5, 'icon': './src/media/notification_3.png', 'title': `ERRO AO PESQUISAR NO CHATGPT`, 'text': '' }
//                 await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT EC2 \n \n\n`; ret['res'] = 'res.error.message'
//             }
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function devAndFun(inf) {
//     let ret = { 'ret': false }; try {
//         let dev, r = await configStorage({ 'action': 'get', 'key': 'webSocket' });
//         if (!r.ret) { return ret } else { r = r.res }; let stop = false; for (let [index, value] of r.devices.entries()) {
//             const a = value; for (let [i, v] of a.functions.entries()) { if (v == inf.name) { dev = value; stop = true; break } }; if (stop) { break }
//         }; if (stop) {
//             const url = `${r.server[dev.server].url}://${r.server[dev.server].host}:${r.server[dev.server].port}/${dev.name}`
//             const send = {
//                 'fun': [{ 'securityPass': r.securityPass, 'funRet': { 'retUrl': inf.retUrl }, 'funRun': { 'name': inf.name, 'par': inf.par } }]
//             }; wsSend(url, send); ret['ret'] = true; ret['msg'] = `[ENC] ${inf.name}: OK`;
//         }; if (!stop) { ret['msg'] = `\n\n #### ERRO #### DEV AND FUN \n NENHUM DEVICE PARA A FUNCAO '${inf.name}' \n\n` }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function chromeActions(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = {
//                 'name': 'chromeActions', 'retUrl': inf.retUrl,
//                 'par': { 'action': inf.action, 'color': inf.color, 'text': inf.text, 'tabSearch': inf.tabSearch, 'url': inf.url, 'code': inf.code }
//             }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; if (inf.action == 'badge') {
//             const action = chrome.browserAction; if (inf.color) { action.setBadgeBackgroundColor({ 'color': inf.color }) } // [25, 255, 71, 255]
//             if (inf.hasOwnProperty('text')) { action.setBadgeText({ 'text': inf.text }) }; ret['msg'] = `CHROME ACTIONS BADGE: OK`
//         } else if (inf.action == 'script') {
//             const infTabSearch = { 'search': inf.tabSearch ? inf.tabSearch : 'ATIVA', 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': inf.url }
//             const retTabSearch = await tabSearch(infTabSearch); chrome.tabs.executeScript(retTabSearch.res.id, {
//                 // XPATH
//                 // code: `document.evaluate('//*[@id="app-root"]/div/div[4]/div[2]/div/p/a/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
//                 code: inf.code
//             }); ret['msg'] = `CHROME ACTIONS SCRIPT: OK`
//         }; ret['ret'] = true;
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function getCookies(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = { 'name': 'getCookies', 'retUrl': inf.retUrl, 'par': { 'url': inf.url, 'cookieSearch': inf.cookieSearch } }
//             const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; const cookiesPromise = new Promise((resolve) => {
//             chrome.cookies.getAll({ 'url': inf.url },
//                 cookies => { const retCookies = JSON.stringify(cookies); resolve(retCookies) })
//         })
//         const retCookies = await cookiesPromise; let cookie = ''; const cookieMap = JSON.parse(retCookies).reduce((accumulator, v) => {
//             cookie += `${v.name}=${v.value}; `; return accumulator
//         }, ''); if ((inf.cookieSearch) && !(retCookies.toString().includes(inf.cookieSearch))) {
//             ret['msg'] = `\n #### ERRO #### GET COOKIES \n COOKIE '${inf.cookieSearch}' NAO CONTRADO \n\n`;
//         } else { ret['res'] = { 'array': retCookies, 'concat': cookie }; ret['ret'] = true; ret['msg'] = 'GET COOKIES: OK' }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// };

// async function notification(infOk) {
//     let ret = { 'ret': false }; try {
//         let inf, imgBase64; if (!infOk) { inf = {} } else { inf = infOk }; if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = {
//                 'name': 'notification', 'retUrl': inf.retUrl,
//                 'par': { 'buttons': inf.buttons, 'duration': inf.duration, 'icon': inf.icon, 'title': inf.title, 'text': inf.text }
//             }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; if (!inf.icon || inf.icon.length > 1) {
//             const imgSrc = !inf.icon ? './src/media/icon_3.png' : inf.icon; const imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer())
//             imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)))
//         } else { imgBase64 = inf.icon }; const json = {
//             duration: ((!inf.duration) || !(inf.duration > 0)) ? 5 : inf.duration, type: 'basic', icon: `data:image/png;base64,${imgBase64}`,
//             title: ((!inf.title) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`, text: ((!inf.text) || (inf.text == '')) ? `TEXT VAZIO` : `${inf.text}`,
//             buttons: inf.buttons ? inf.buttons : [],
//         }; const not = {
//             type: json.type, iconUrl: json.icon, title: json.title.substring(0, 88),   // máximo [considerando tudo 'i'] + 1 caractere
//             message: json.text.substring(0, 349), buttons: json.buttons // máximo [considerando tudo 'i'] + 1 caractere
//         }; chrome.notifications.create(not, (notificationId) => {
//             chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => { // ALGUM BOTAO PRESSIONADO
//                 if (notifId === notificationId && btnIdx === 0) { alert('1') }; if (notifId === notificationId && btnIdx === 1) { alert('2') }
//             }); setTimeout(() => { chrome.notifications.clear(notificationId) }, json.duration * 1000)
//         }); ret['ret'] = true; ret['msg'] = 'NOTIFICATION: OK'
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function promptChrome(inf) {
//     let ret = { 'ret': false }; try {
//         const title = (inf.title) ? `${inf.title} | Digite o comando:` : `Digite o comando:`; if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = { 'name': 'promptChrome', 'retUrl': inf.retUrl, 'par': { 'title': inf.title } }
//             const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; let retPrompt = prompt(`${title}`); if (!retPrompt) { ret['msg'] = `\n #### ERRO #### PROMPT CHROME \n EM BRANCO \n\n` } else {

//             const infApi = {
//                 'method': 'POST', 'url': `http://18.119.140.20:8888/OPSEUA_CHROME/`, 'headers': { 'accept-language': 'application/json' },
//                 'body': { "other": "peroptyx_QueryImageDeservingClassification", "inf": [retPrompt.split(',').map(Number)], "query": "#####" }
//             }; const retApi = await api(infApi);

//             ret['res'] = retPrompt; ret['ret'] = true; ret['msg'] = 'PROMPT CHROME: OK'
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function getPage(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = { 'name': 'getPage', 'retUrl': inf.retUrl, 'par': { 'id': inf.id } }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; function getContent(inf) {
//             return new Promise((resolve) => {
//                 chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, function (data) {
//                     if (data) {
//                         const blob = new Blob([data], { type: 'application/x-mimearchive' }); const reader = new FileReader();
//                         reader.onloadend = async function () { ret['res'] = reader.result; ret['ret'] = true; ret['msg'] = `GET PAGE: OK`; resolve(true) }; reader.readAsText(blob)
//                     } else { ret['msg'] = `GET PAGE: 'data' é 'false'`; resolve(false) }
//                 });
//             });
//         }; await getContent(inf)
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function sniffer(inf) {
//     let ret = { 'ret': false, 'res': { 'req': {}, 'res': {} } };
//     if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//         const infDevAndFun = { 'name': 'sniffer', 'retUrl': inf.retUrl, 'par': { 'newReqSend': inf.newReqSend, 'arrUrl': inf.arrUrl } }
//         const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//     }; return new Promise(resolve => {
//         let lisOnBeforeRequest, lisOnBeforeSendHeaders, lisOnCompleted; function snifferOff(inf) {
//             if (inf) { console.log('sniffer parou'); resolve({ 'ret': false }) } else { console.log('sniffer off'); resolve(ret) }
//             chrome.webRequest.onBeforeRequest.removeListener(lisOnBeforeRequest); chrome.webRequest.onBeforeSendHeaders.removeListener(lisOnBeforeSendHeaders);
//             chrome.webRequest.onCompleted.removeListener(lisOnCompleted);
//         }; try {
//             gO.inf = { 'sniffer': 1 }; const gOEve = async (i) => { if (i.inf.sniffer === 2) { gO.inf = { 'sniffer': 0 }; gORem(gOEve); snifferOff(true) } };
//             gOAdd(gOEve); const filters = { urls: ["<all_urls>"] };
//             lisOnBeforeRequest = function (infLis) { intercept(infLis, 'onBeforeRequest'); }; lisOnBeforeSendHeaders = function (infLis) { intercept(infLis, 'onBeforeSendHeaders') }
//             lisOnCompleted = function (infLis) { intercept(infLis, 'onCompleted'); }; chrome.webRequest.onBeforeRequest.addListener(lisOnBeforeRequest, filters, ['requestBody'])
//             chrome.webRequest.onBeforeSendHeaders.addListener(lisOnBeforeSendHeaders, filters, ['requestHeaders']);
//             chrome.webRequest.onCompleted.addListener(lisOnCompleted, filters, ['responseHeaders']); let sendPri, newResBlock = false, newReqSend = inf.newReqSend ? true : false
//             chrome.browserAction.setBadgeBackgroundColor({ color: [25, 255, 71, 255] }); if (newReqSend) {
//                 chrome.browserAction.setBadgeText({ text: 'SIM' })
//             } else { chrome.browserAction.setBadgeText({ text: 'NAO' }) }
//             if (inf && inf.arrUrl) { sendPri = { 'arrUrl': inf.arrUrl } } else { sendPri = { 'arrUrl': ['https://ntfy.sh/'] } }; async function intercept(infOk, eventType) {
//                 if (!!sendPri.arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': infOk.url }))) {
//                     if (eventType == 'onBeforeRequest') {
//                         if (infOk.requestBody && infOk.requestBody.raw && infOk.requestBody.raw[0].hasOwnProperty('bytes')) {
//                             ret.res.req['requestBodyType'] = 'binary';
//                             ret.res.req['requestBody'] = new TextDecoder("utf-8").decode(new Uint8Array(infOk.requestBody.raw[0].bytes));
//                         } else if (infOk.requestBody && infOk.requestBody.formData && infOk.requestBody.hasOwnProperty('formData')) {
//                             ret.res.req['requestBodyType'] = 'formData'; ret.res.req['requestBody'] = infOk.requestBody.formData;
//                         }; ret.res.req['type'] = infOk.type; // 'main_frame' (requisicao inicial 'doc')
//                     }; if (eventType == 'onBeforeSendHeaders') {
//                         if (JSON.stringify(infOk.requestHeaders).includes('naoInterceptar')) { newResBlock = true; console.log('BLOCK') }
//                         else {
//                             newResBlock = false; ret.res.req['method'] = infOk.method; ret.res.req['url'] = infOk.url; ret.res.req['tabId'] = infOk.tabId;
//                             ret.res.req['requestHeaders'] = infOk.requestHeaders;
//                         }
//                     }; if (eventType == 'onCompleted' && ret.res.req.url && !newResBlock) {
//                         if ((infOk.statusCode !== 200)) { console.log('DEU ERRO', 'CODE:', infOk.statusCode, infOk.url) }; ret.res.req['code'] = infOk.statusCode;
//                         ret['ret'] = true; if (newReqSend) {
//                             newReqSend = false; console.log('REENVIAR REQUISICAO'); const hea = {};
//                             for (let header of ret.res.req.requestHeaders) { hea[header.name] = header.value; }; hea['naoInterceptar'] = 'naoInterceptar';
//                             const infApi = { 'url': ret.res.req.url, 'method': ret.res.req.method, 'headers': hea };
//                             if (typeof ret.res.res.requestBody !== 'undefined') { infApi['body'] = ret.res.req.requestBody }
//                             const retApi = await api(infApi); ret.res.res['method'] = ret.res.req.method; ret.res.res['code'] = retApi.res.code;
//                             ret.res.res['url'] = ret.res.req.url; ret.res.res['headers'] = retApi.res.headers; ret.res.res['body'] = retApi.res.body;
//                         }; snifferOff()
//                     }
//                 }
//             }
//         } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; snifferOff() })() }
//     });
// }

// async function openTab(inf) { // NAO USAR
//     try {
//         const active = inf.active ? true : false; const pinned = inf.pinned ? true : false; const url = inf.url ? inf.url : 'https://www.google.com';
//         return await new Promise((resolve, reject) => {
//             chrome.tabs.create({ 'url': url, 'active': active, 'pinned': pinned }, function (novaAba) {
//                 chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
//                     if (tabId === novaAba.id && changeInfo.status === 'complete') {
//                         chrome.tabs.get(novaAba.id, function (tab) {
//                             chrome.tabs.onUpdated.removeListener(listener)
//                             resolve({ 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned })
//                         })
//                     }
//                 })
//             })
//         })
//     } catch (e) { (async () => { const m = await regexE({ 'e': e }); return `\n #### ERRO #### SEARCH TAB \n ${m.res}` })() }
// }; async function tabSearch(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
//             const infDevAndFun = {
//                 'name': 'tabSearch', 'retUrl': inf.retUrl, 'par': { 'search': inf.search, 'openIfNotExist': inf.openIfNotExist, 'active': inf.active, 'pinned': inf.pinned, 'url': inf.url }
//             }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; let result = {}; if (inf.search == 'ATIVA') { // ATIVA search
//             result = await new Promise(resolve => {
//                 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//                     if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
//                         const tab = tabs[0];
//                         const abaInf = { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned }; resolve({ 'res': abaInf })
//                     } else { resolve(result) }
//                 })
//             })
//         } else {
//             result = await new Promise(resolve => {
//                 chrome.tabs.query({}, function (tabs) {
//                     if (!(typeof tabs === 'undefined') && (tabs.length > 0)) {
//                         const abaInf = tabs.map(function (tab) { return { 'id': tab.id, 'title': tab.title, 'url': tab.url, 'active': tab.active, 'index': tab.index, 'pinned': tab.pinned } })
//                         resolve({ 'res': abaInf })
//                     } else { resolve(result) }
//                 })
//             })
//         }; if (result.hasOwnProperty('res')) { // ATIVA ret
//             if (inf.search == 'ATIVA') {
//                 ret['res'] = { 'id': result.res.id, 'title': result.res.title, 'url': result.res.url, 'active': result.res.active, 'index': result.res.index, 'pinned': result.res.pinned }
//             } else if (inf.search == 'TODAS') { ret['res'] = result.res }  // TODAS ret
//             else if (typeof inf.search === 'number') { // ID ret
//                 for (const obj of result.res) {
//                     const infRegex = { 'pattern': inf.search.toString(), 'text': obj.id.toString() }; const retRegex = regex(infRegex)
//                     if (retRegex.ret) { ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned }; break }
//                 }
//             } else {
//                 for (const obj of result.res) {
//                     let infRegex, retRegex; infRegex = { 'pattern': inf.search, 'text': obj.url }; retRegex = regex(infRegex); if (retRegex.ret) { // URL ret
//                         ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned }; break
//                     }; infRegex = { 'pattern': inf.search, 'text': obj.title }; retRegex = regex(infRegex); if (retRegex.ret) { // TITULO ret
//                         ret['res'] = { 'id': obj.id, 'title': obj.title, 'url': obj.url, 'active': obj.active, 'index': obj.index, 'pinned': obj.pinned }; break
//                     }
//                 }
//             }; if (ret.hasOwnProperty('res')) { ret['ret'] = true; ret['msg'] = `SEARCH TAB: OK` }
//             else {
//                 if (typeof inf.search === 'number') { ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA ID '${inf.search}' NAO ENCONTRADA \n\n` } else {
//                     ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
//                 }
//             }
//         } else {
//             if (inf.search == 'ATIVA' || inf.search == 'TODAS') { ret['msg'] = `\n #### ERRO #### SEARCH TAB \n NENHUM ABA ATIVA \n\n` } else {
//                 ret['msg'] = `\n #### ERRO #### SEARCH TAB \n ABA '${inf.search}' NAO ENCONTRADA \n\n`;
//             }
//         }
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }
//     if (!ret.ret) {
//         if (inf.openIfNotExist) {
//             const retOpenTab = await openTab(inf); if (retOpenTab.hasOwnProperty('id')) { ret['res'] = retOpenTab; ret['ret'] = true; ret['msg'] = `SEARCH TAB: OK` }
//             else { ret['msg'] = retOpenTab }
//         }
//     }; if (!ret.ret && ret.msg) { console.log(ret.msg) }; return ret
// }

// async function commandLine(inf) {
//     let ret = { 'ret': false }; try {
//         if (typeof window !== 'undefined') { // [ENCONTRAR DEVICE] CHROME
//             const infDevAndFun = { 'name': 'commandLine', 'retUrl': inf.retUrl, 'par': { 'command': inf.command } }
//             const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
//         }; let command = `"${conf[1]}:/ARQUIVOS/WINDOWS/BAT/RUN_PORTABLE/1_BACKGROUND.exe" ${inf.command}`; const retorno = new Promise((resolve, reject) => {
//             _run(command, { maxBuffer: 1024 * 5000 }, (err, stdout, stderr) => { if (err) { reject(err) } else { resolve('COMMAND LINE: OK') } })
//         }); return retorno
//             .then((result) => { ret['ret'] = true; ret['msg'] = `${result}`; return ret; }).catch((e) => {
//                 (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })()
//             })
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function splitText(inf) {
//     let ret = { 'ret': false }; try {
//         const text = inf.text.replace(/\n/g, '\\n'); const maxLength = inf.maxLength; const chunks = []; let currentChunk = ''; for (let word of text.split(/\s+/)) {
//             if (currentChunk.length + word.length > maxLength) { chunks.push(currentChunk.trim()); currentChunk = '' }
//             currentChunk += (currentChunk ? ' ' : '') + word; if (/\n/.test(word)) { chunks.push(currentChunk.trim()); currentChunk = '' }
//         }; if (currentChunk) { chunks.push(currentChunk.trim()) }; ret['res'] = chunks; ret['ret'] = true; ret['msg'] = 'SPLIT TEXT: OK';
//     } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
// }

// async function logWs(inf) { if (typeof window == 'undefined') { await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf }) } } // NODEJS
// let wsCli = {}, lis = {}; async function wsConnect(inf) { wsCli = wsRun(inf); await logWs('ONSTART CHROME/NODEJS: START') }; async function wsFun(inf) {
//     let ws = new _WebS(inf); ws.onmessage = (event) => { if (lis[inf] && typeof lis[inf] === 'function') { lis[inf](event.data) } }
//     ws.onerror = (e) => { }; ws.onopen = async () => { let a = `WS OK:\n${inf}`; console.log(a); await logWs(a) }
//     ws.onclose = async () => { let a = `WS RECONEXAO EM 5 SEGUNDOS:\n${inf}`; console.log(a); await logWs(a); await new Promise(r => setTimeout(r, 5000)); ws = wsFun(inf) }; return ws
// }; function wsRun(inf) { const wsB = []; inf.forEach((inf) => { const wsA = wsFun(inf); wsB.push(wsA) }); return wsB }; function wsSend(s, m) {
//     m = typeof m === 'object' ? JSON.stringify(m) : m; let ok = false; wsCli.forEach((wsC) => { if (wsC.inf === s) { wsC.send(m); ok = true } });
//     if (!ok) { let ws = new _WebS(s); ws.onopen = () => { ws.send(m); ws.close() } }
// }; function wsList(inf, listener) { lis[inf] = listener };

// // ############### CLEAR CONSOLE ###############
// console.clear(); let msgQtd = 0; const clearConsole = console.log;
// console.log = async function () { clearConsole.apply(console, arguments); msgQtd++; if (msgQtd >= 50) { console.clear(); msgQtd = 0; console.log('CONSOLE LIMPO!') } }
// // ###############               ###############

// const infFile = { 'action': 'inf', 'functionLocal': false }; const retFile = await file(infFile);
// if (typeof window !== 'undefined') { // CHROME
//     window['gLet'] = gLet; window['conf'] = retFile.res; window['_WebS'] = _WebS; window['wsList'] = wsList; window['wsSend'] = wsSend;
//     // ## functions
//     window['api'] = api; window['file'] = file; window['configStorage'] = configStorage; window['dateHour'] = dateHour; window['secToHour'] = secToHour; window['regex'] = regex;
//     window['random'] = random; window['regexE'] = regexE; window['gO'] = gO; window['gOAdd'] = gOAdd; window['gORem'] = gORem; window['orderObj'] = orderObj;
//     window['jsonInterpret'] = jsonInterpret; window['log'] = log; window['hasKey'] = hasKey; window['clipboard'] = clipboard; window['translate'] = translate;
//     window['webSocketRet'] = webSocketRet; window['chatGpt'] = chatGpt; window['devAndFun'] = devAndFun; window['chromeActions'] = chromeActions; window['getCookies'] = getCookies;
//     window['notification'] = notification; window['promptChrome'] = promptChrome; window['getPage'] = getPage; window['sniffer'] = sniffer; window['tabSearch'] = tabSearch;
//     window['commandLine'] = commandLine; window['splitText'] = splitText; window['wsConnect'] = wsConnect;
// } else { // NODEJS 
//     global['gLet'] = gLet; global['conf'] = retFile.res;
//     global['_WebS'] = _WebS; global['_fs'] = _fs; global['_path'] = _path; global['_cheerio'] = _cheerio; global['_clipboard'] = _clipboard; global['_run'] = _run
//     global['_http'] = _http; const { WebSocketServer } = await import('ws'); global['_WebSServer'] = WebSocketServer; global['wsList'] = wsList; global['wsSend'] = wsSend;
//     // ## functions
//     global['api'] = api; global['file'] = file; global['configStorage'] = configStorage; global['dateHour'] = dateHour; global['secToHour'] = secToHour; global['regex'] = regex;
//     global['random'] = random; global['regexE'] = regexE; global['gO'] = gO; global['gOAdd'] = gOAdd; global['gORem'] = gORem; global['orderObj'] = orderObj;
//     global['jsonInterpret'] = jsonInterpret; global['log'] = log; global['hasKey'] = hasKey; global['clipboard'] = clipboard; global['translate'] = translate;
//     global['webSocketRet'] = webSocketRet; global['chatGpt'] = chatGpt; global['devAndFun'] = devAndFun; global['chromeActions'] = chromeActions; global['getCookies'] = getCookies;
//     global['notification'] = notification; global['promptChrome'] = promptChrome; global['getPage'] = getPage; global['sniffer'] = sniffer; global['tabSearch'] = tabSearch;
//     global['commandLine'] = commandLine; global['splitText'] = splitText; global['wsConnect'] = wsConnect;
// }










