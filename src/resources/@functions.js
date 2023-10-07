let _fs, _path, _cheerio, _clipboard, _WebS, _http, p, ws1, conf = ['src/config.json']
if (typeof window !== 'undefined') { _WebS = window.WebSocket } else { // ← CHROME     ↓ NODEJS
    _fs = await import('fs'); _path = await import('path'); _cheerio = await import('cheerio'); const { default: clipboard } = await import('clipboardy');
    _clipboard = clipboard; const { default: WebSocket } = await import('ws'); _WebS = WebSocket; const { default: http } = await import('http'); _http = http
}

// await import('./@functions.js');

// let infApi, retApi
// infApi = {                                    // ########## TYPE → text
//     'method': 'PUT', 'url': `https://ntfy.sh/`,
//     'headers': { 'content-type': 'text/plain;charset=UTF-8' },
//     'body': '{"topic":"OPSEUA","message":"a"}'
// };
// infApi = {                                    // ########## TYPE → json
//     'method': 'PUT', 'url': `https://ntfy.sh/`,
//     'headers': { 'accept-language': 'application/json' },
//     'body': { 'Chave': 'aaaaaaaaaaa', 'Valor': 'bbbbbbbbb' }
// };
// const formData = new URLSearchParams();       // ########## TYPE → x-www-form-urlencoded
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com');
// infApi = {
//     'method': 'PUT', 'url': `https://ntfy.sh/`,
//     'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': formData.toString()
// };
// retApi = await api(infApi);
// console.log(retApi)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// let infFile, retFile
// infFile = { 'action': 'inf' }
// infFile = { 'action': 'write', 'functionLocal': true, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'action': 'read', 'functionLocal': true, 'path': './PASTA/ola.txt' }
// infFile = { 'action': 'list', 'functionLocal': true, 'path': './PASTA/', 'max': 10 }
// infFile = { 'action': 'change', 'functionLocal': true, 'path': './PASTA/', 'pathNew': './PASTA2/' }
// infFile = { 'action': 'del', 'functionLocal': true, 'path': './PASTA2/' }
// retFile = await file(infFile); console.log(retFile)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// let infConfigStorage, retConfigStorage; 
// infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' }
// infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const RetDateHour = dateHour()
// console.log(RetDateHour)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const infRandom = { 'min': 3, 'max': 10, 'await': true }
// const retRandom = await random(infRandom)
// console.log(retRandom)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// for (let i = 0; i < 10; i++) {
//     console.log(`Iteração ${i + 1}`);
// }
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// let i = 0; const loop = ['A', 'B', 'C', 'D', 'E'];
// async function runLoop() {
//   while (i < loop.length) { i++; console.log(loop[i - 1]);
//     if (loop[i - 1] == 'C') {  break }
//     const infRandom = { 'min': 1, 'max': 5, 'await': true }
//     const retRandom = await random(infRandom)
//   }; console.log('Loop concluído!');
// } ; runLoop();
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const infRegex = { 'pattern': 'UM(.*?)TRES', 'text': 'UMDOISTRES' }
// const infRegex = { 'simple': true, 'pattern': '*DOIS*', 'text': 'UMDOISTRES' }
// const retRegex = regex(infRegex)
// console.log(retRegex)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// await new Promise(resolve => setTimeout(resolve, (2500)));
// globalObject.inf = { 'alert': true, 'function': 'Nome', 'res': 'AAAAA' };
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL'
// const json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// const infJsonInterpret = { 'json': json, 'vars': infGlobal }
// let retJsonInterpret = await jsonInterpret(infJsonInterpret)
// if (retJsonInterpret.ret) { retJsonInterpret = JSON.parse(retJsonInterpret.res) }
// console.log(retJsonInterpret)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// await log({ 'folder': '#_TESTE_#', 'path': `TESTE.txt`, 'text': 'INF AQUI' })
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } };
// const infHasKey = { 'key': 'chave3', 'obj': objeto }; const retHaskey = hasKey(infHasKey); console.log(retHaskey)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const retClipboard = await clipboard({ 'value': `Esse é o texto` }); console.log(retClipboard)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// const retTranslate = await translate(infTranslate);console.log(retTranslate)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -
// let infChatGpt = { 'provider': 'railway', 'input': `Qual a idade de Marte?` }
// let retChatGpt = await chatGpt(infChatGpt)
// console.log(retChatGpt.res)

// for (const nameKey in json.taskName) { console.log(nameKey) }

async function api(inf) {
    let ret = { 'ret': false }
    try {
        if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
            if (inf.headers) { reqOpt['headers'] = inf.headers }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) { reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body }
            const req = UrlFetchApp.fetch(inf.url, reqOpt); const resHeaders = req.getAllHeaders();
            const resBody = req.getContentText(); ret['ret'] = true; ret['msg'] = 'API: OK';
            ret['res'] = { 'code': req.getResponseCode(), 'headers': resHeaders, 'body': resBody }
        } else { // ######################################### NODEJS ou CHROME
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
            if (inf.headers) { reqOpt['headers'] = inf.headers }; if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            const req = await fetch(inf.url, reqOpt); const resHeaders = {}; req.headers.forEach((value, name) => { resHeaders[name] = value })
            const resBody = await req.text(); ret['ret'] = true; ret['msg'] = 'API: OK'; ret['res'] = { 'code': req.status, 'headers': resHeaders, 'body': resBody }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function file(inf) {
    let ret = { 'ret': false }
    try {
        if (/\$\[[^\]]+\]/.test(JSON.stringify(inf))) { // PASSAR NO jsonInterpret
            let rji = await jsonInterpret({ 'json': inf }); if (rji.ret) { rji = JSON.parse(rji.res); inf = rji };
        } if (!inf.action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change'].includes(inf.action)) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
        } else if (typeof inf.functionLocal !== 'boolean' && inf.action !== 'inf' && !inf.path.includes(':')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'functionLocal' \n\n`
        } else if (inf.action !== 'inf' && (!inf.path || inf.path == '')) { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n` }
        else {
            let infFile, retFile, path, retFetch = '', text, jsonFile, functionLocal, fileOk, e, relative, pathFull, relativeParts, retRelative, pathOld, pathNew
            if (inf.action == 'write') { // ########################## WRITE
                if (typeof inf.rewrite !== 'boolean') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`; }
                else if (!inf.text || inf.text == '') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'text' \n\n`; }
                else {
                    text = typeof inf.text === 'object' ? JSON.stringify(inf.text) : inf.text
                    if (inf.path.includes(':')) { path = inf.path; if (typeof window !== 'undefined') { path = path.split(':/')[1] } }
                    else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
                        retFile = await file(infFile); path = retFile.res[0]
                    }
                    if (typeof window !== 'undefined') { // CHROME
                        if (path.includes('%/')) { path = path.split('%/')[1] } else if (path.includes(':')) { path = path.split(':/')[1] }
                        else { path = path }; if (inf.rewrite) {
                            try {
                                infFile = { 'action': 'read', 'path': path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
                                retFile = await file(infFile); if (retFile.ret) { retFetch = retFile.res }; text = `${retFetch}${text}`
                            } catch (e) { }
                        }; const blob = new Blob([text], { type: 'text/plain' });
                        const downloadOptions = {
                            url: URL.createObjectURL(blob), filename: path, saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                            conflictAction: 'overwrite' // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                        }; chrome.downloads.download(downloadOptions);
                    } else { // NODEJS
                        await _fs.promises.mkdir(_path.dirname(path), { recursive: true }); await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' })
                    }; ret['ret'] = true; ret['msg'] = `FILE WRITE: OK`;
                }
            } else if (inf.action == 'read') { // ########################## READ
                if (inf.path.includes(':')) { path = inf.path } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
                }; if (typeof window !== 'undefined') { // CHROME
                    if (!inf.functionLocal) { path = `file:///${path}` }; retFetch = await fetch(path.replace('%', '')); retFetch = await retFetch.text()
                } else { retFetch = await _fs.promises.readFile(path, 'utf8') } // NODEJS
                ret['ret'] = true; ret['msg'] = `FILE READ: OK`; ret['res'] = retFetch;
            } else if (inf.action == 'del' && typeof window == 'undefined') { // ########################## DEL
                if (inf.path.includes(':')) { path = inf.path } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile);
                    path = retFile.res[0]
                }; async function delP(inf) {
                    try {
                        const s = await _fs.promises.stat(inf); if (s.isDirectory()) {
                            const as = await _fs.promises.readdir(inf)
                            for (const a of as) { const c = _path.join(inf, a); await delP(c) }; await _fs.promises.rmdir(inf)
                        } else { await _fs.promises.unlink(inf) }; ret['ret'] = true; ret['msg'] = `FILE DEL: OK`;
                    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = `\n\n #### ERRO #### FILE DEL \n ${m.res} \n\n` }
                }; await delP(path)
            } else if (inf.action == 'inf') { // ########################## INF
                e = JSON.stringify(new Error().stack).replace('at ', '')
                // [0] config.json | [1] letra | [2] caminho do projeto atual | [3] path download/terminal | [4] arquivo atual
                if (conf.length == 1) { // NOME DO PROJETO E TERMINAL
                    if (typeof window !== 'undefined') { // CHROME
                        functionLocal = chrome.runtime.getURL('').slice(0, -1)
                        jsonFile = await fetch(`${functionLocal}/${conf[0]}`); jsonFile = JSON.parse(await jsonFile.text()).conf
                        text = e; const pattern = new RegExp(`at ${functionLocal}/(.*?)\\.js`)
                        const res = text.match(pattern); fileOk = res[1]; conf = [conf[0], jsonFile[0], functionLocal, jsonFile[1], fileOk]
                    } else { // NODEJS
                        functionLocal = e.match(/ file:\/\/\/(.*?)\.js:/)[1]; fileOk = functionLocal.charAt(0).toUpperCase() + functionLocal.slice(1);
                        async function getRoot(inf) {
                            try { await _fs.promises.access(`${inf}/package.json`); return inf }
                            catch { const p = inf.split('/').slice(0, -1).join('/'); return p == inf ? null : getRoot(p) }
                        }; functionLocal = await getRoot(fileOk);
                        fileOk = fileOk.replace(`${functionLocal}/`, ''); jsonFile = await _fs.promises.readFile(`${functionLocal}/${conf}`, 'utf8'); jsonFile = JSON.parse(jsonFile).conf
                        conf = [conf[0], jsonFile[0], functionLocal.replace(`${jsonFile[0]}:/`, ''), process.cwd().replace(/\\/g, '/').replace(`${jsonFile[0]}:/`, ''), `${file}.js`]
                    }
                } else { // NOME DO ARQUIVO
                    text = e; const pattern = new RegExp(`at.*?${typeof window !== 'undefined' ? conf[2] : conf[3]}(.*?)\\.js`)
                    const res = text.match(pattern); fileOk = `${res[1].slice(1)}.js`; conf[4] = fileOk
                }; ret['ret'] = true; ret['msg'] = `FILE INF: OK`; ret['res'] = conf
            } else if (inf.action == 'relative') { // ########################## RELATIVE
                relative = inf.path; function runPath(pp, par) {
                    if (pp.startsWith('./')) { pp = pp.slice(2) } else if (relative.startsWith('/')) { pp = pp.slice(1) }
                    pathFull = conf[par].split('/'); relativeParts = pp.split('/');
                    while (pathFull.length > 0 && relativeParts[0] == '..') { pathFull.pop(); relativeParts.shift(); }
                    retRelative = pathFull.concat(relativeParts).join('/'); if (retRelative.endsWith('/.')) { retRelative = retRelative.slice(0, -2); }
                    else if (retRelative.endsWith('.') || retRelative.endsWith('/')) { retRelative = retRelative.slice(0, -1); }; return retRelative
                }; ret['ret'] = true; ret['msg'] = `FILE RELATIVE: OK`
                ret['res'] = [`${typeof window !== 'undefined' && inf.functionLocal ? '' : `${conf[1]}:/`}${runPath(inf.path, inf.functionLocal ? 2 : 3)}`]
            } else if (inf.action == 'list' && typeof window == 'undefined') { // ########################## LIST
                if (!inf.max || inf.max == '') { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`; }
                else {
                    if (inf.path.includes(':')) { path = inf.path } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile); path = retFile.res[0]
                    }; let retFilesList = { 'path': path, 'max': inf.max }; function formatBytes(b, d = 2) {
                        if (b == 0) return '0 Bytes'; const i = Math.floor(Math.log(b) / Math.log(1024));
                        return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
                    }; let iFilesList = 0; async function filesList(inf, files = []) {
                        try {
                            for (const fileOk of _fs.readdirSync(inf.path)) {
                                if (iFilesList >= inf.max) { break }; const name = `${inf.path}/${fileOk}`;
                                try {
                                    if (_fs.statSync(name).isDirectory()) { filesList({ 'max': inf.max, 'path': name }, files) }
                                    else {
                                        iFilesList++; const stats = _fs.statSync(name)
                                        files.push({ 'ret': true, 'file': fileOk, 'path': name, 'size': formatBytes(stats.size), 'edit': stats.mtime })
                                    }
                                } catch (e) { iFilesList++; files.push({ 'ret': false, 'file': fileOk, 'path': name, 'e': JSON.stringify(e) }) }
                            }; return files;
                        } catch (e) { iFilesList++; files.push({ 'ret': false, 'e': JSON.stringify(e) }) }
                    }; retFilesList = await filesList(retFilesList); ret['ret'] = true; ret['msg'] = `FILE LIST: OK`; ret['res'] = retFilesList;
                }
            } else if (inf.action == 'change') {
                if (!inf.pathNew || inf.pathNew == '') { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'pathNew' \n\n`; } else {
                    if (inf.path.includes(':')) { pathOld = inf.path } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile); pathOld = retFile.res[0]
                    }; if (inf.pathNew.includes(':')) { pathNew = inf.pathNew } else {
                        infFile = { 'action': 'relative', 'path': inf.pathNew, 'functionLocal': inf.functionLocal };
                        retFile = await file(infFile); pathNew = retFile.res[0]
                    }; await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true })
                    await _fs.promises.rename(pathOld, pathNew); ret['ret'] = true; ret['msg'] = `FILE CHANGE: OK`
                }
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function configStorage(inf) {
    let ret = { 'ret': false }
    try {
        let run = false; if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) {
            ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'action' \n\n`;
        } else {
            if ((!inf.key || inf.key == '')) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR A 'key' \n\n`; }
            else { if (inf.action == 'set' && !inf.value) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'value' \n\n` } else { run = true } }
        }
        if (run) {
            if (typeof window !== 'undefined') { // CHROME
                if (inf.action == 'set') { // #### STORAGE: SET
                    await storageSet(inf); async function storageSet(inf) {
                        return new Promise((resolve) => {
                            const data = {}; data[inf.key] = inf.value; chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n`;
                                } else { ret['ret'] = true; ret['msg'] = 'STORAGE SET: OK' }; resolve(ret);
                            });
                        });
                    }
                } else if (inf.action == 'get') { // #### STORAGE: GET
                    await storageGet(inf); async function storageGet(inf) {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length == 0) {
                                    async function checkConfig() {
                                        const infFile = { 'action': 'read', 'path': conf[0], 'functionLocal': true }
                                        const retFile = await file(infFile); const config = JSON.parse(retFile.res);
                                        if (config[inf.key]) {
                                            const data = {}; data[inf.key] = config[inf.key]; return new Promise((resolve) => {
                                                chrome.storage.local.set(data, async () => {
                                                    if (chrome.runtime.lastError) {
                                                        ret['msg'] = `\n\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n`;
                                                    } else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = config[inf.key] }
                                                    resolve(ret);
                                                });
                                            })
                                        } else { ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                                    }; await checkConfig()
                                } else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = result[inf.key] }; resolve(ret);
                            });
                        });
                    }
                } else if (inf.action == 'del') { // #### STORAGE: DEL
                    await storageDel(inf); async function storageDel(inf) {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length == 0) {
                                    ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                } else {
                                    chrome.storage.local.remove(inf.key, async () => { }); ret['ret'] = true; ret['msg'] = 'STORAGE DEL: OK';
                                }; resolve(ret);
                            }); return
                        });
                    }
                }
            } else { // ################## NODE
                let infFile, retFile, config, path, ret_Fs = false; if (inf.path && inf.path.includes(':')) { path = inf.path }
                else {
                    if (inf.path && typeof inf.functionLocal == 'boolean') {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }
                    } else { infFile = { 'action': 'relative', 'path': conf[0], 'functionLocal': true } }
                    retFile = await file(infFile); path = retFile.res[0]
                }; try { await _fs.promises.access(path); ret_Fs = true } catch (e) { }
                if (ret_Fs) { const configFile = await _fs.promises.readFile(path, 'utf8'); config = JSON.parse(configFile) } else { config = {} }
                if (!inf.key || inf.key == '') { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR A 'key' \n\n`; }
                else if (inf.action == 'set') { // CONFIG: SET
                    if (!inf.value && !inf.value == false) { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR O 'value' \n\n` }
                    else {
                        config[inf.key] = inf.value;
                        infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                        retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG SET: OK`
                    }
                } else if (inf.action == 'get') { // #### CONFIG NODE: GET
                    if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n ARQUIVO '${path}' NAO ENCONTRADO \n\n`; }
                    else if (inf.key == '*' || (inf.key !== '*' && config[inf.key])) {
                        ret['ret'] = true; ret['msg'] = `CONFIG GET: OK`; ret['res'] = inf.key == '*' ? config : config[inf.key]
                    } else { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
                    if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL\n ARQUIVO '${path}' NAO ENCONTRADO \n\n`; }
                    else if (config[inf.key]) {
                        delete config[inf.key]
                        infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                        retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG DEL: OK`
                    } else { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                }
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

function dateHour(inf = 0) { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false }
    try {
        const dt1 = new Date(); dt1.setSeconds(new Date().getSeconds() + inf).setSeconds; const dt2 = Date.now() + (inf * 1000);
        ret['res'] = {
            'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
            'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
            'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'),
            'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)), 'timMil': String(dt2.toString()),
            'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
        }; // manter o 'String' para forcar o '0' (zero) na frente → '001'
        ret['ret'] = true; ret['msg'] = `DATE HOUR: OK`
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

function secToHour(inf) { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false }
    try {
        const hou = Math.floor(inf / 3600).toString().padStart(2, "0");
        const min = Math.floor((inf % 3600) / 60).toString().padStart(2, "0");
        const sec = (inf % 60).toString().padStart(2, "0");
        ret['res'] = String(`${hou}:${min}:${sec}`) // manter o 'String' para forcar o '0' (zero) na frente → '001'
        ret['ret'] = true; ret['msg'] = `SEC TO HOUR: OK`
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

function regex(inf) { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false }
    try {
        if (inf.pattern.includes('(.*?)')) {
            let res = {}; let ok = false; const patternSplit = inf.pattern.split('(.*?)');
            const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const result1 = inf.text.match(`${split1}(.*?)${split2}`);
            const result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`);
            const result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
            const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
            res['0'] = `res.['1'] → [-|<] | res.['2'] → [-|>] | res.['3'] → [^|<] | res.['4'] → [^|>]`
            if (result1 && result1.length > 0) { res['1'] = result1[1]; ok = true }
            // SEM QUEBRA DE LINHA ATE A PRIMEIRA OCORRENCIA
            else { res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result2 && result2.length > 0) { res['2'] = result2[1]; ok = true }
            // SEM QUEBRA DE LINHA ATE A ULTIMA OCORRENCIA
            else { res['2'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result3 && result3.length > 0) { res['3'] = result3[1]; ok = true }
            // COM QUEBRA DE LINHA ATE A PRIMEIRA OCORRENCIA
            else { res['3'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result4 && result4.length > 0) { res['4'] = result4[1]; ok = true }
            // COM QUEBRA DE LINHA ATE A ULTIMA OCORRENCIA
            else { res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (ok) { ret['msg'] = `REGEX: OK`; ret['res'] = res; ret['ret'] = true; }
        } else {
            const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const result = new RegExp(`^${pattern}$`).test(inf.text);
            if (inf.simple) { if (result) { return true } else { return false } } else {
                if (result) { ret['msg'] = `REGEX: OK`; ret['res'] = 'TEXTO POSSUI O PADRAO'; ret['ret'] = true; }
                else { ret['msg'] = `\n\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`; }
            }
        }
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; return ret })() }; return ret
}

async function random(inf) {
    let ret = { 'ret': false }
    try {
        const min = inf.min; const max = inf.max; const message = inf.await ? true : false
        const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) { console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`); await new Promise(resolve => setTimeout(resolve, number)); }
        ret['ret'] = true; ret['msg'] = `RANDON: OK`; ret['res'] = number / 1000;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

// ############### GLOBAL OBJECT ###############
const data = { inf: '' }; const listeners = new Set();
const gO = new Proxy(data, {
    set(target, key, value) { target[key] = value; globalChanged(value); listeners.forEach(listener => listener(target)); return true }
});
function gOAdd(listener) { listeners.add(listener) }; function gORem(listener) { listeners.delete(listener) }
async function globalChanged(i) {
    // if (i.alert !== false) { console.log('globalObject ALTERADO →', i)}
}
// ############### ###############

async function regexE(inf) {
    let ret = { 'ret': false }
    try {
        ret['msg'] = `REGEX E: OK`; const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/)
        if (match && match.length == 3) { ret['res'] = `\n\n #### ERRO #### ${match[1]} [${match[2]}] \n ${inf.e.toString()} \n\n` }
        else { ret['res'] = `\n\n #### ERRO #### NAO IDENTIFICADO [NAO IDENTIFICADA] \n ${inf.e.toString()} \n\n` }
        if (typeof window == 'undefined') { const retLog = await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `err.txt`, 'text': ret }) }; ret['ret'] = true;
    } catch (e) { console.log(`\n\n #### ERRO REGEXe #### ${e} \n\n`) } return ret
}

function orderObj(o) {
    return Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));
}

async function jsonInterpret(inf) {
    let ret = { 'ret': false }
    try {
        const json = JSON.stringify(inf.json); const res = json.replace(/\$\[(.*?)\]/g, (match, p1) => g[p1])
        ret['ret'] = true; ret['msg'] = `JSON INTERPRET: OK`; ret['res'] = res;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function log(inf) {
    let ret = { 'ret': false }
    try {
        let time = dateHour().res, mon = `MES_${time.mon}_${time.monNam}`, day = `DIA_${time.day}`, hou = `${time.hou}.${time.min}.${time.sec}.${time.mil}`, pathOk
        let text = inf.text; pathOk = `log/${inf.folder}`; if (['reg.txt', 'reset.js'].includes(inf.path)) { pathOk = `${pathOk}/${inf.path}` }
        else if (inf.rewrite) {
            text = typeof inf.text === 'object' ? `${hou}\n${JSON.stringify(inf.text)}\n\n` : `${hou}\n${inf.text}\n\n`; pathOk = `${pathOk}/${mon}/${day}/${inf.path}`
        } else { pathOk = `${pathOk}/${mon}/${day}/${hou}_${inf.path}` }
        const infFile = { 'action': 'write', 'functionLocal': false, 'text': text, 'rewrite': inf.rewrite ? true : false, 'path': pathOk };
        const retFile = await file(infFile); ret['msg'] = `LOG: OK`; ret['res'] = `${conf[1]}:/${conf[3]}/${pathOk}`; ret['ret'] = true
    } catch (e) { }; return ret
}

function hasKey(inf) { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false }
    try {
        function hk(key, obj) {
            if (obj.hasOwnProperty(key)) { return true }; for (let prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) { if (hk(key, obj[prop])) { return true } }
            }; return false
        }; ret['msg'] = `HAS KEY: OK`; ret['res'] = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj)); ret['ret'] = true
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; console.log(ret.msg); return ret })() }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function clipboard(inf) {
    let ret = { 'ret': false }
    try {
        if (inf.value == null || inf.value == '') { ret['msg'] = `\n\n #### ERRO #### CLIPBOARD \n INFORMAR O 'value' \n\n` }
        else {
            let text = inf.value; if (typeof text === 'object') { text = JSON.stringify(text, null, 2) }  // OBJETO INDENTADO EM TEXTO BRUTO
            if (typeof window !== 'undefined') { // CHROME
                const element = document.createElement('textarea'); element.value = text; document.body.appendChild(element);
                element.select(); document.execCommand('copy'); document.body.removeChild(element);
            } else { _clipboard.writeSync(text); /*console.log(clipboard.readSync())*/ } // NODEJS
            ret['ret'] = true; ret['msg'] = 'CLIPBOARD: OK';
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function translate(inf) {
    let ret = { 'ret': false }
    try {
        const infApi = {
            method: 'GET', url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`,
            headers: {}
        }; const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = retApi.res.body;
        const retRegex = regex({ 'pattern': 'class="result-container">(.*?)</div>', 'text': res }); if (!retRegex.ret) { return ret }; let d, $
        if (typeof window !== 'undefined') { d = new DOMParser().parseFromString(retRegex.res['3'], "text/html").documentElement.textContent } // CHROME
        else { $ = _cheerio.load(retRegex.res['3']); d = _cheerio.load($('body').html())('body').text() } // NODEJS
        ret['res'] = d; ret['ret'] = true; ret['msg'] = `TRANSLATE: OK`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

async function webSocketRet(inf) {

    // {
    //     "fun": [{
    //         "securityPass": "####################",
    //         "funRet": { "retUrl": false, "funA": "ARRAY AQUI" },
    //         "funRun": {
    //             "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" }
    //         }
    //     },
    //     {
    //         "securityPass": "####################",
    //         "funRet": { "retUrl": false, "funA": "ARRAY AQUI" },
    //         "funRun": {
    //             "name": "notification", "par": { "title": "TITULO 1", "text": "TEXTO" }
    //         }
    //     }]
    // }

    let ret = { 'ret': false }
    try {
        const infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; let retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
        const data = JSON.parse(inf.data); const wsHost = retConfigStorage.ws1; const portWebSocket = retConfigStorage.portWebSocket;
        const device0Ret = retConfigStorage.device0.ret; const securityPass = retConfigStorage.securityPass
        function label(f) { return typeof (typeof window !== 'undefined' ? window : global)[f] === 'function' }
        await Promise.all(data.fun.map(async (value, index) => {
            // --------------------------------------------------
            if (value.securityPass !== securityPass) { ret['msg'] = `\n #### SECURITYPASS INCORRETO #### \n\n ${JSON.stringify(data)} \n\n` }
            else if (!label(value.funRun.name)) { ret['msg'] = `\n #### FUNCAO '${value.funRun.name}' NAO EXITE #### \n\n ${JSON.stringify(data)} \n\n` }
            else {
                let name; if (typeof window !== 'undefined') { name = window[value.funRun.name] } // CHROME
                else { name = global[value.funRun.name] } // NODEJS
                const infName = value.funRun.par; const retName = await name(infName)
                if (value.funRet && value.funRet.retUrl) {
                    let wsRet; if (typeof value.funRet.retUrl === 'boolean') { wsRet = `ws://${wsHost}:${portWebSocket}/${device0Ret}` }
                    else { wsRet = `${value.funRet.retUrl}` }
                    wsRet = new _WebS(wsRet); wsRet.onerror = (e) => { console.error(`WEBSOCKET RET: ERRO WS`) }
                    wsRet.onopen = () => {
                        wsRet.send(JSON.stringify({ 'inf': value.funRet.retInf, 'retWs': retName, 'fun': value.funRet.fun }))
                        wsRet.close()
                    }
                }; ret['ret'] = true;
            }
            // --------------------------------------------------
        }))
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res; }
    if (!ret.ret) {
        console.log(ret.msg);
        const retLog = await log({ 'folder': 'JavaScript', 'rewrite': true, 'path': `log.txt`, 'text': ret.msg })
        if (typeof window !== 'undefined') { // CHROME
            const infConfigStorage = { 'action': 'del', 'key': 'webSocket' }; const retConfigStorage = await configStorage(infConfigStorage)
        }
    }; return ret
}

async function chatGpt(inf) { // https://chat.openai.com/api/auth/session
    let ret = { 'ret': false }
    try {
        let infConfigStorage, retConfigStorage
        if (inf.provider == 'ora.ai') {
            infConfigStorage = { 'action': 'get', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
            if (!retConfigStorage['cookie']) {
                const infTabSearch = { 'search': retConfigStorage['Referer'], 'openIfNotExist': true, 'active': false, 'pinned': true, 'url': retConfigStorage['Referer'] } // 'ATIVA', 'TODAS', '*google*' ou 12345678 (ID)
                const retTabSearch = await tabSearch(infTabSearch)
                if (!retTabSearch.ret) {
                    let infNotification =
                    {
                        'duration': 5, 'icon': './src/media/notification_3.png',
                        'title': `ERRO AO ABRIR CHATGPT`,
                        'text': `Não foi possível abrir a aba`,
                    }; await notification(infNotification); return ret
                }; const infGetCookies = { 'url': retTabSearch.res.url, 'cookieSearch': '__Secure-next-auth.session-token' }; const retGetCookies = await getCookies(infGetCookies)
                if (!(retGetCookies.ret)) {
                    infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
                    if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
                    let infNotification =
                    {
                        'duration': 5, 'icon': './src/media/notification_3.png',
                        'title': `ERRO AO PEGAR COOKIE CHATGPT`,
                        'text': `Verificar se a aba abriu e se está logado`,
                    }; await notification(infNotification); return ret
                }; retConfigStorage['cookie'] = retGetCookies.res.concat;
                infConfigStorage = { 'action': 'set', 'key': 'chatGptOra.ai', 'value': retConfigStorage }
                const retSETConfigStorage = await configStorage(infConfigStorage); if (!retSETConfigStorage.ret) { return ret }
            }; const infApi = {
                method: 'POST', url: 'https://ora.ai/api/conversation',
                headers: {
                    "accept": "*/*", "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json", "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                    "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin", "Referer": retConfigStorage['Referer'], "cookie": retConfigStorage['cookie'],
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: { "chatbotId": retConfigStorage['chatbotId'], "input": inf.input, "conversationId": retConfigStorage['conversationId'], "userId": retConfigStorage['userId'], "provider": "OPEN_AI", "config": false, "includeHistory": true }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = JSON.parse(retApi.res.body);
            if ('response' in res) { ret['res'] = res.response; ret['ret'] = true; ret['msg'] = `CHAT GPT ORA AI: OK` }
            else {
                infConfigStorage = { 'action': 'del', 'key': 'chatGptOra.ai' }; retConfigStorage = await configStorage(infConfigStorage)
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': res.error.message,
                }; await notification(infNotification)
                ret['msg'] = `\n #### ERRO #### CHAT GPT ORA AI \n ${res.error.message} \n\n`; ret['res'] = res.error.message; ret['ret'] = true;
            }
        }
        else if (inf.provider == 'open.ai') {
            infConfigStorage = { 'action': 'get', 'key': 'chatGptOpenAi' }; retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
            const infApi = {
                'method': 'POST', 'url': `https://api.openai.com/v1/chat/completions`,
                'headers': { 'Content-Type': 'application/json', 'Authorization': `Bearer ${retConfigStorage.Authorization}` },
                'body': { "model": "gpt-3.5-turbo", "messages": [{ "role": "user", "content": inf.input }] }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = JSON.parse(retApi.res.body);
            if ('choices' in res) { ret['res'] = res.choices[0].message.content; ret['ret'] = true; ret['msg'] = `CHAT GPT OPEN AI: OK` }
            else {
                infConfigStorage = { 'action': 'del', 'key': 'chatGptOpenAi' }; retConfigStorage = await configStorage(infConfigStorage)
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': res.error.message,
                }; await notification(infNotification)
                ret['msg'] = `\n #### ERRO #### CHAT GPT OPEN AI \n ${res.error.message} \n\n`; ret['res'] = res.error.message;
            }
        }
        else if (inf.provider == 'aichatos') {
            const infApi = {
                'method': 'POST', 'url': `https://api.aichatos.cloud/api/generateStream`,
                'headers': {
                    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                    'accept': 'application/json, text/plain, */*', 'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua-mobile': '?0',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"', 'origin': 'https://chat9.yqcloud.top', 'sec-fetch-site': 'cross-site',
                    'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty', 'referer': 'https://chat9.yqcloud.top/',
                    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6'
                },
                'body': { "prompt": inf.input, "userId": `#/chat/${dateHour().res.timMil}`, "network": false, "system": "", "withoutContext": false, "stream": false }
            }; const retApi = await api(infApi); if (!retApi.ret || retApi.res.code !== 200) { return ret }
            if (retApi.res.code == 200) { ret['res'] = retApi.res.body; ret['ret'] = true; ret['msg'] = `CHAT GPT AI CHATOS: OK` }
            else {
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': '',
                }; await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT AI CHATOS \n \n\n`;
            }
        }
        else if (inf.provider == 'railway') {
            infConfigStorage = { 'action': 'get', 'key': 'chatGptRailway' }; retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
            const infApi = {
                'method': 'POST', 'url': retConfigStorage.url,
                'headers': {
                    'accept': 'application/json, text/plain, */*', 'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6',
                    'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                    'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"Windows"', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                },
                'body': { "prompt": inf.input, "options": {} }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }
            if (retApi.res.code == 200) {
                const res = retApi.res.body.split('\n').filter(str => str.trim() !== '').map(jsonStr => JSON.parse(jsonStr));
                ret['res'] = res[res.length - 1].text; ret['ret'] = true; ret['msg'] = `CHAT GPT RAILWAY: OK`
            }
            else {
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': '',
                }; await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT RAILWAY \n \n\n`; ret['res'] = 'res.error.message';
            }
        } else if (inf.provider == 'ec2') {
            infConfigStorage = { 'action': 'get', 'key': 'webSocket' }; retConfigStorage = await configStorage(infConfigStorage)
            if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res }
            const infApi = {
                'method': 'POST', 'url': `http://${retConfigStorage.ws1}:${retConfigStorage.portWebSocket}/chatgpt`,
                'headers': {}, 'body': { "prompt": inf.input, "network": inf.network ? true : false }
            }; const retApi = await api(infApi); if (!retApi.ret) { return ret }
            if (JSON.parse(retApi.res.body).ret) { ret['res'] = JSON.parse(retApi.res.body).res; ret['ret'] = true; ret['msg'] = `CHAT GPT EC2: OK` }
            else {
                let infNotification =
                {
                    'duration': 5, 'icon': './src/media/notification_3.png',
                    'title': `ERRO AO PESQUISAR NO CHATGPT`,
                    'text': '',
                }; await notification(infNotification); ret['msg'] = `\n #### ERRO #### CHAT GPT EC2 \n \n\n`; ret['res'] = 'res.error.message';
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

// ############### CLEAR CONSOLE ###############
console.clear(); let messageCount = 0; const clearConsole = console.log;
console.log = async function () {
    clearConsole.apply(console, arguments); messageCount++;
    if (messageCount >= 50) { console.clear(); messageCount = 0; console.log('CONSOLE LIMPO!') }
};
// ############### ###############

const infFile = { 'action': 'inf', 'functionLocal': false }; const retFile = await file(infFile);
if (typeof window !== 'undefined') { // CHROME
    window['g'] = {}; window['p'] = p; window['conf'] = retFile.res;
    window['_WebS'] = _WebS; window['ws1'] = ws1
    // ## functions
    window['api'] = api; window['file'] = file; window['configStorage'] = configStorage;
    window['dateHour'] = dateHour; window['secToHour'] = secToHour;
    window['regex'] = regex; window['random'] = random; window['regexE'] = regexE;
    window['gO'] = gO; window['gOAdd'] = gOAdd; window['gORem'] = gORem; window['orderObj'] = orderObj;
    window['jsonInterpret'] = jsonInterpret; window['log'] = log; window['hasKey'] = hasKey; window['clipboard'] = clipboard;
    window['translate'] = translate; window['webSocketRet'] = webSocketRet; window['chatGpt'] = chatGpt
} else { // NODEJS
    global['g'] = {}; global['p'] = p; global['conf'] = retFile.res
    global['_WebS'] = _WebS; global['ws1'] = ws1; global['_fs'] = _fs; global['_path'] = _path; global['_cheerio'] = _cheerio;
    global['_clipboard'] = _clipboard;
    global['_http'] = _http; const { WebSocketServer } = await import('ws'); global['_WebSServer'] = WebSocketServer;
    // ## functions
    global['api'] = api; global['file'] = file; global['configStorage'] = configStorage;
    global['dateHour'] = dateHour; global['secToHour'] = secToHour; global['regex'] = regex;
    global['random'] = random; global['regexE'] = regexE; global['gO'] = gO; global['gOAdd'] = gOAdd;
    global['gORem'] = gORem; global['orderObj'] = orderObj; global['jsonInterpret'] = jsonInterpret;
    global['log'] = log; global['hasKey'] = hasKey; global['clipboard'] = clipboard; global['translate'] = translate;
    global['webSocketRet'] = webSocketRet; global['chatGpt'] = chatGpt
}



