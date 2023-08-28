// await import('./@functions.js');

// let infApi, retApi
// infApi = {                                    // ########## TYPE → text
//     url: `https://ntfy.sh/`,
//     method: 'PUT',
//     headers: { 'content-type': 'text/plain;charset=UTF-8' },
//     body: '{"topic":"OPSEUA","message":"a"}'
// };
// infApi = {                                    // ########## TYPE → json
//     headers: { 'accept-language': 'application/json' },
//     body: { 'Chave': 'aaaaaaaaaaa', 'Valor': 'bbbbbbbbb' }
// };
// const formData = new URLSearchParams();       // ########## TYPE → x-www-form-urlencoded
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com');
// infApi = {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: formData.toString()
// };
// retApi = await api(infApi);
// console.log(retApi)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// let infFile, retFile
// infFile = { 'p': new Error(), 'action': 'inf' }
// infFile = { 'p': new Error(), 'action': 'relative', 'relative': './1_PASTA/aaa.txt' }
// infFile = { 'p': new Error(), 'action': 'write', 'path': './1_PASTA/aaa.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'p': new Error(), 'action': 'read', 'path': './1_PASTA/aaa.txt' }
// infFile = { 'p': new Error(), 'action': 'del', 'path': './1_PASTA/aaa.txt' }
// infFile = { 'p': new Error(), 'action': 'list', 'path': '../', 'max': 10 }
// retFile = await file(infFile);
// console.log(retFile)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// let infConfigStorage, retConfigStorage
// infConfigStorage = { 'p': new Error(), 'path': '/src/config.json', 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'p': new Error(), 'path': '/src/config.json', 'action': 'get', 'key': 'NomeDaChave' }
// infConfigStorage = { 'p': new Error(), 'path': '/src/config.json', 'action': 'del', 'key': 'NomeDaChave' }
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

async function api(inf) {
    let ret = { 'ret': false };
    try {
        if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
            if (inf.headers) { reqOpt['headers'] = inf.headers }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            const req = UrlFetchApp.fetch(inf.url, reqOpt); const resHeaders = req.getAllHeaders();
            const resBody = req.getContentText(); ret['ret'] = true; ret['msg'] = 'API: OK';
            ret['res'] = { 'code': req.getResponseCode(), 'headers': resHeaders, 'body': resBody }
        } else { // ######################################### NODEJS ou CHROME
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
            if (inf.headers) { reqOpt['headers'] = inf.headers }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            const req = await fetch(inf.url, reqOpt); const resHeaders = {};
            req.headers.forEach((value, name) => { resHeaders[name] = value })
            const resBody = await req.text(); ret['ret'] = true; ret['msg'] = 'API: OK';
            ret['res'] = { 'code': req.status, 'headers': resHeaders, 'body': resBody }
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
//######################################## ############# #########
async function file(inf) {
    // const url = chrome.runtime.getURL('src/config.json'); console.log(url)
    let ret = { 'ret': false };
    let _fs, _path, _appRoot
    try {
        if (!inf.p || inf.p == '') { ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'p' \n\n`; }
        else {
            if (!inf.action || !['write', 'read', 'del', 'inf', 'pathChromeNode', 'relative', 'list'].includes(inf.action)) {
                ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
            } else {
                if ((!inf.path || inf.path == '') && ['write', 'read', 'del', 'list'].includes(inf.action)) {
                    ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n`;
                }
                else {
                    if (typeof window == 'undefined') { // FS , PATH, APP-ROOT-PATH
                        _fs = await import('fs'); _path = await import('path');
                        const { default: appRoot } = await import('app-root-path'); _appRoot = appRoot.path.replace(/\\/g, '/')
                        _appRoot = _appRoot.charAt(0).toUpperCase() + _appRoot.slice(1)
                    }
                    if (inf.action == 'write') { // #### WRITE
                        if (typeof inf.rewrite !== 'boolean') {
                            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`;
                        } else if (!inf.text || inf.text == '') {
                            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'text' \n\n`;
                        } else {
                            let infFile, retFile, path, retFetch = ''; let text = inf.text
                            if (inf.path.includes(':')) { path = [inf.path]; if (typeof window !== 'undefined') { path = path.split(':/')[1] } }
                            else {
                                infFile = { 'p': inf.p, 'action': 'relative', 'relative': inf.path };
                                retFile = await file(infFile); path = retFile.res
                            }
                            if (typeof window !== 'undefined') { // CHROME
                                if (path[1].includes('%/')) { path = path[1].split('%/')[1] } else if (path[1].includes(':')) {
                                    path = path[1].split(':/')[1];
                                } else { path = path[1] }
                                if (inf.rewrite) {
                                    try {
                                        infFile = { 'p': inf.p, 'action': 'read', 'path': path }; retFile = await file(infFile);
                                        if (retFile.ret) { retFetch = retFile.res }; text = `${retFetch}${text}`
                                    } catch (e) { }
                                }; const blob = new Blob([text], { type: 'text/plain' });
                                const downloadOptions = {
                                    url: URL.createObjectURL(blob), filename: path,
                                    saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                                    conflictAction: 'overwrite' // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                                }; chrome.downloads.download(downloadOptions);
                            } else { // NODEJS
                                path = path[0]
                                async function createFolder(f) {
                                    const p = _path.normalize(f); const d = p.split(_path.sep); let cF = '';
                                    for (let directory of d) {
                                        cF += directory + _path.sep; if (!_fs.existsSync(cF)) { await _fs.promises.mkdir(cF); }
                                    }; return true;
                                }; const folderPath = _path.dirname(path); await createFolder(folderPath);
                                await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' }); // 'w' limpa | 'a' adiciona
                            }; ret['ret'] = true; ret['msg'] = `FILE WRITE: OK`;
                        }
                    } else if (inf.action == 'read') { // #### READ
                        let infFile, retFile, path; if (inf.path.includes(':')) { path = [inf.path] }
                        else {
                            infFile = { 'p': inf.p, 'action': 'relative', 'relative': inf.path };
                            retFile = await file(infFile); path = retFile.res
                        }; let retFetch
                        if (typeof window !== 'undefined') { // CHROME
                            try { retFetch = await fetch(`file:///${path[1].replace('%', '')}`) }
                            catch (e) { retFetch = await fetch(`${path[0]}`) }
                            retFetch = await retFetch.text()
                        } else { retFetch = _fs.readFileSync(path[0], 'utf8'); }; // NODEJS
                        ret['ret'] = true; ret['msg'] = `FILE READ: OK`; ret['res'] = retFetch;
                    } else if (inf.action == 'del' && typeof window == 'undefined') { // #### DEL
                        let infFile, retFile, path; if (inf.path.includes(':')) { path = [inf.path] }
                        else {
                            infFile = { 'p': inf.p, 'action': 'relative', 'relative': inf.path };
                            retFile = await file(infFile); path = retFile.res
                        }; _fs.unlinkSync(path[0]); ret['ret'] = true; ret['msg'] = `FILE DEL: OK`;
                    } else if (inf.action == 'inf') { // #### INF (get current path full)
                        let pathProject, pathCurrent
                        pathProject = typeof window === 'undefined' ? _appRoot : chrome.runtime.getURL('').slice(0, -1);
                        pathCurrent = JSON.stringify(inf.p.stack).replace(/\/\//, '').match(/\/(.*?).js/)[1] + '.js';
                        pathCurrent = pathCurrent.replace(new RegExp(`${pathProject}/`, 'gi'), "");
                        if (typeof window == 'undefined') { ret['res'] = [pathCurrent, pathProject] } else { // NODEJS
                            ret['res'] = [pathCurrent, pathProject, 'D:/Downloads/Google Chrome%'] // CHROME
                        }; ret['ret'] = true; ret['msg'] = `FILE INF: OK`
                    } else if (inf.action == 'relative') { // #### RELATIVE
                        const infFile = { 'p': inf.p, 'action': 'inf' }; const retFile = await file(infFile);
                        if (!inf.relative || inf.relative == '') {
                            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'relative' \n\n`;
                        } else {
                            let relative, pathFull, relativeParts, retRelative; relative = inf.relative
                            function runPath(p, par) {
                                if (p.startsWith('./')) { p = p.slice(2) } else if (relative.startsWith('/')) { p = p.slice(1) }
                                pathFull = retFile.res[par].split('/'); relativeParts = p.split('/');
                                while (pathFull.length > 0 && relativeParts[0] === '..') { pathFull.pop(); relativeParts.shift(); }
                                retRelative = pathFull.concat(relativeParts).join('/')
                                if (retRelative.endsWith('/.')) { retRelative = retRelative.slice(0, -2); }
                                else if (retRelative.endsWith('.') || retRelative.endsWith('/')) { retRelative = retRelative.slice(0, -1); }
                                return retRelative
                            }; ret['ret'] = true; ret['msg'] = `FILE RELATIVE: OK`
                            if (typeof window == 'undefined') { ret['res'] = [runPath(inf.relative, 1)] } else // NODEJS
                            { ret['res'] = [runPath(inf.relative, 1), runPath(inf.relative, 2)] } // CHROME
                        }
                    } else if (inf.action == 'list' && typeof window == 'undefined') { // #### LIST
                        if (!inf.max || inf.max == '') {
                            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`;
                        } else {
                            let infFile, retFile, path
                            if (inf.path.includes(':')) { path = [inf.path] }
                            else {
                                infFile = { 'p': inf.p, 'action': 'relative', 'relative': inf.path };
                                retFile = await file(infFile); path = retFile.res
                            }; let retFilesList = { 'path': path[0], 'max': inf.max }
                            function formatBytes(b, d = 2) {
                                if (b === 0) return '0 Bytes'; const i = Math.floor(Math.log(b) / Math.log(1024));
                                return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
                            }; let iFilesList = 0
                            async function filesList(inf, files = []) {
                                try {
                                    for (const file of _fs.readdirSync(inf.path)) {
                                        if (iFilesList >= inf.max) { break }; const name = `${inf.path}/${file}`;
                                        try {
                                            if (_fs.statSync(name).isDirectory()) { filesList({ 'max': inf.max, 'path': name }, files) }
                                            else {
                                                iFilesList++; const stats = _fs.statSync(name)
                                                files.push({
                                                    'ret': true, 'file': file, 'path': name,
                                                    'size': formatBytes(stats.size), 'edit': stats.mtime
                                                });
                                            }
                                        } catch (e) { iFilesList++; files.push({ 'ret': false, 'file': file, 'path': name, 'e': JSON.stringify(e) }) }
                                    }; return files;
                                } catch (e) { iFilesList++; files.push({ 'ret': false, 'e': JSON.stringify(e) }) }
                            }; retFilesList = await filesList(retFilesList)
                            ret['ret'] = true; ret['msg'] = `FILE LIST: OK`; ret['res'] = retFilesList;
                        }
                    }
                }
            }
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function configStorage(inf) {
    let ret = { 'ret': false };
    try {
        let run = false
        if (!inf.p || inf.p == '') {
            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'p' \n\n`;
        } else {
            if (!inf.path || inf.path == '') {
                ret['msg'] = `\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'path' do 'config.json' \n\n`;
            } else {
                if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) {
                    ret['msg'] = `\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'action' \n\n`;
                } else {
                    if ((!inf.key || inf.key == '')) {
                        ret['msg'] = `\n #### ERRO #### CONFIG STORAGE \n INFORMAR A 'key' \n\n`;
                    } else {
                        if (inf.action == 'set' && !inf.value) {
                            ret['msg'] = `\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'value' \n\n`;
                        } else {
                            run = true
                        }
                    }
                }
            }
        }
        if (run) {
            if (typeof window !== 'undefined') { // CHROME
                if (inf.action == 'set') { // #### STORAGE: SET
                    await storageSet(inf)
                    async function storageSet(inf) {
                        return new Promise((resolve) => {
                            const data = {}; data[inf.key] = inf.value;
                            chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n`;
                                } else { ret['ret'] = true; ret['msg'] = 'STORAGE SET: OK' }; resolve(ret);
                            });
                        });
                    }
                } else if (inf.action == 'get') { // #### STORAGE: GET
                    await storageGet(inf)
                    async function storageGet(inf) {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    async function checkConfig() {
                                        const infFile = { 'p': inf.p, 'action': 'read', 'path': inf.path }
                                        const retFile = await file(infFile); const config = JSON.parse(retFile.res);
                                        if (config[inf.key]) {
                                            const data = {}; data[inf.key] = config[inf.key];
                                            return new Promise((resolve) => {
                                                chrome.storage.local.set(data, async () => {
                                                    if (chrome.runtime.lastError) {
                                                        ret['msg'] = `\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n`;
                                                    } else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = config[inf.key] }
                                                    resolve(ret);
                                                });
                                            })
                                        } else { ret['msg'] = `\n #### ERRO #### STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                                    }; await checkConfig()
                                } else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = result[inf.key] }; resolve(ret);
                            });
                        });
                    }
                } else if (inf.action == 'del') { // #### STORAGE: DEL
                    await storageDel(inf)
                    async function storageDel(inf) {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                } else {
                                    chrome.storage.local.remove(inf.key, async () => { });
                                    ret['ret'] = true; ret['msg'] = 'STORAGE DEL: OK';
                                }; resolve(ret);
                            }); return
                        });
                    }
                }
            } else { // ################## NODE
                const infFile = { 'p': inf.p, 'action': 'relative', 'relative': './src/config.json' }
                const retFile = await file(infFile); if (!retFile.ret) { return }; const path = retFile.res
                const _fs = await import('fs'); const configFile = _fs.readFileSync(path[0]);
                const config = JSON.parse(configFile);
                if (inf.action == 'set') { // CONFIG: SET
                    try {
                        if (!inf.key || inf.key == '') { ret['msg'] = `\n #### ERRO #### CONFIG SET \n INFORMAR A 'key' \n\n`; }
                        else if (!inf.value && !inf.value == false) {
                            ret['msg'] = `\n #### ERRO #### CONFIG SET \n INFORMAR O 'value' \n\n`;
                        } else {
                            ret['ret'] = true; ret['msg'] = `CONFIG SET: OK`; config[inf.key] = inf.value;
                            _fs.writeFileSync(path[0], JSON.stringify(config, null, 2));
                        }
                    } catch (e) { ret['msg'] = regexE({ 'e': e }).res; }
                } else if (inf.action == 'get') { // #### CONFIG NODE: GET
                    try {
                        if (!inf.key || inf.key == '') { ret['msg'] = `\n #### ERRO #### CONFIG GET \n INFORMAR A 'key' \n\n`; }
                        else {
                            if (config[inf.key]) {
                                ret['ret'] = true; ret['msg'] = `CONFIG GET: OK`; ret['res'] = config[inf.key];
                            } else { ret['msg'] = `\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                        }
                    } catch (e) { ret['msg'] = regexE({ 'e': e }).res; }
                } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
                    try {
                        if (!inf.key || inf.key == '') { ret['msg'] = `\n #### ERRO #### CONFIG DEL \n INFORMAR A 'key' \n\n`; }
                        else {
                            if (config[inf.key]) {
                                ret['ret'] = true; ret['msg'] = `CONFIG DEL: OK`; delete config[inf.key];
                                _fs.writeFileSync(path[0], JSON.stringify(config, null, 2));
                            } else { ret['msg'] = `\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                        }
                    } catch (e) { ret['msg'] = regexE({ 'e': e }).res; }
                }
            }
        }
    }
    catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

function dateHour() { // NAO POR COMO 'async'!!!
    let ret = { 'ret': false };
    try {
        const date1 = new Date(); const date2 = Date.now(); ret['ret'] = true; ret['msg'] = `DATE HOUR: OK`;
        ret['res'] = {
            'day': String(date1.getDate()).padStart(2, '0'), 'mon': String(date1.getMonth() + 1).padStart(2, '0'),
            'yea': String(date1.getFullYear()), 'hou': String(date1.getHours()).padStart(2, '0'),
            'min': String(date1.getMinutes()).padStart(2, '0'), 'sec': String(date1.getSeconds()).padStart(2, '0'),
            'mil': String(date2.toString().slice(-3)), 'tim': String(date2.toString().slice(0, -3))
        }; // manter o 'String' para forcar o '0' (zero) na frente → '001' 
    }
    catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

function regex(inf) {
    let ret = { 'ret': false };
    try {
        if (inf.pattern.includes('(.*?)')) {
            let res = {}; let ok = false; const patternSplit = inf.pattern.split('(.*?)');
            const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const result1 = inf.text.match(`${split1}(.*?)${split2}`);
            const result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`);
            const result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
            const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
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
                else { ret['msg'] = `\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`; }
            }
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
        console.log(ret.msg)
    }
    return ret
}

async function random(inf) {
    let ret = { 'ret': false };
    try {
        const min = inf.min; const max = inf.max; const message = inf.await ? true : false
        const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) { console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`); await new Promise(resolve => setTimeout(resolve, number)); }
        ret['ret'] = true; ret['msg'] = `RANDON: OK`; ret['res'] = number / 1000;
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
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

function regexE(inf) {
    let ret = { 'ret': false };
    try {
        ret['ret'] = true; ret['msg'] = `REGEX E: OK`; const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        if (match && match.length === 3) { ret['res'] = `\n #### ERRO #### ${match[1]} [${match[2]}] \n ${inf.e.toString()} \n\n` }
        else { ret['res'] = `\n #### ERRO #### NAO IDENTIFICADO [NAO IDENTIFICADA] \n ${inf.e.toString()} \n\n` }
    } catch (e) {
        const match = e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        ret['msg'] = `\n #### ERRO #### ${match[1]} [${match[2]}] \n ${e.toString()} \n\n`
    }
    if (!ret.ret) { console.log(ret.msg) }
    return ret
};

function orderObj(o) {
    return Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));
}

// ############### CLEAR CONSOLE ###############
console.clear(); let messageCount = 0; const clearConsole = console.log;
console.log = async function () {
    clearConsole.apply(console, arguments); messageCount++;
    if (messageCount >= 100) { console.clear(); messageCount = 0; console.log('CONSOLE LIMPO!') }
};
// ############### ###############

if (typeof window !== 'undefined') { // CHROME
    // ## functions
    window['api'] = api; window['file'] = file; window['configStorage'] = configStorage;
    window['dateHour'] = dateHour; window['regex'] = regex; window['random'] = random;
    window['regexE'] = regexE; window['gO'] = gO; window['gOAdd'] = gOAdd;
    window['gORem'] = gORem; window['orderObj'] = orderObj;
} else { // NODEJS
    // ## functions
    global['api'] = api; global['file'] = file; global['configStorage'] = configStorage; global['dateHour'] = dateHour;
    global['regex'] = regex; global['random'] = random; global['regexE'] = regexE; global['gO'] = gO;
    global['gOAdd'] = gOAdd; global['gORem'] = gORem; global['orderObj'] = orderObj;
}

