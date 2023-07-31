// await import('./functions.js');

// const retNodeOrBrowser = await nodeOrBrowser();
// console.log(retNodeOrBrowser);
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -  
// const infFileInf = { 'path': new URL(import.meta.url).pathname } // ## CHROME NAO!
// const retFileInf = await fileInf(infFileInf);
// console.log(retFileInf)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const infFileWrite = {
//     'file': `PASTAS 1/PASTA 2/arquivo.txt`,
//     'rewrite': true, // 'true' adiciona no MESMO arquivo, 'false' cria outro em branco
//     'text': `LINHA 1\nLINHA 2\nLINHA 3\n`
//   };
//   const retFileWrite = await fileWrite(infFileWrite);
//   console.log(retFileWrite);
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const infFileRead = { 'file': `D:/Downloads/Google Chrome/PASTAS 1/PASTA 2/arquivo.txt` }
// const retFileRead = await fileRead(infFileRead)
// console.log(retFileRead)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # -  
// let infConfigStorage, retConfigStorage
// infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)

// infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage)
// console.log(retConfigStorage)

// infConfigStorage = { 'path': '/src/config.json', 'action': 'del', 'key': 'NomeDaChave' }
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
// const loop = ['A', 'B', 'C', 'D', 'E'];
// let i = 0;
// async function runLoop() {
//   while (i < loop.length) {
//     i++;
//     console.log(loop[i - 1]);
//     if (loop[i - 1] == 'C') {
//       break
//     }
//     const infRandom = { 'min': 1, 'max': 5, 'await': true }
//     const retRandom = await random(infRandom)
//   }
//   console.log('Loop concluído!');
// }
// runLoop();
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
            if (inf.headers) {
                reqOpt['headers'] = inf.headers
            }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            const req = UrlFetchApp.fetch(inf.url, reqOpt);
            const resHeaders = req.getAllHeaders();
            const resBody = req.getContentText();
            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': req.getResponseCode(),
                'headers': resHeaders,
                'body': resBody
            }
        } else { // ######################################### NODEJS ou CHROME
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
            if (inf.headers) {
                reqOpt['headers'] = inf.headers
            }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }
            const req = await fetch(inf.url, reqOpt)
            const resHeaders = {};
            req.headers.forEach((value, name) => {
                resHeaders[name] = value
            })
            const resBody = await req.text();

            ret['ret'] = true;
            ret['msg'] = 'API: OK';
            ret['res'] = {
                'code': req.status,
                'headers': resHeaders,
                'body': resBody
            }
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

async function nodeOrBrowser() {
    let ret = { 'ret': false }
    try {
        if (typeof process !== 'undefined') { // NODE
            ret['res'] = 'node'
        } else if (typeof window !== 'undefined') { // CHROME
            ret['res'] = 'chrome'
        } else if (typeof UrlFetchApp !== 'undefined') { // GOOGLE APP SCRIPT
            ret['res'] = 'googleAppScript'
        } else { // NAO IDENTIFICADO
            ret['res'] = 'NAO IDENTIFICADO'
        }
        ret['ret'] = true;
        ret['msg'] = 'NODE OR BROWSER: OK';
    } catch (e) {
        //ret['msg'] = `NODE OR BROWSER: ERRO | ${e.message}`;
        ret['msg'] = regexE({ 'e': e.message }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

async function fileInf(inf) { // ## CHROME NAO!
    let ret = { 'ret': false };
    try {
        const path = await import('path');
        const fs = await import('fs');

        const parsedPath = path.parse(inf.path);
        const fileWithExtension = parsedPath.base;
        const fileWithoutExtension = parsedPath.name;
        let filesToSearch = ['package.json', 'package-lock.json', '.gitignore'];
        let currentDir = parsedPath.dir.replace(/\//g, '\\').slice(1); let iterations = 0;

        while (!filesToSearch.find(file => fs.existsSync(path.join(currentDir, file)))) {
            iterations++; const parentDir = path.dirname(currentDir);
            if (iterations >= 15 || parentDir === currentDir) {
                currentDir = 'NAO ENCONTRADO | MAX DE 15 BUSCAS'; break;
            } currentDir = parentDir;
        }
        const retFileInf = {
            'pathProject1': currentDir,
            'pathProject2': currentDir.replace(/\\/g, '\/'),
            'pathCurrent1': parsedPath.dir.replace(/\//g, '\\').slice(1).charAt(0).toUpperCase() + parsedPath.dir.replace(/\//g, '\\').slice(1).slice(1),
            'pathCurrent2': parsedPath.dir.slice(1).charAt(0).toUpperCase() + parsedPath.dir.slice(1).slice(1),
            'fileFull': fileWithExtension,
            'fileName': fileWithoutExtension,
            'fileExtension': parsedPath.ext,
            'parameterReceived': inf
        };
        ret['ret'] = true;
        ret['msg'] = 'FILE INF: OK';
        ret['res'] = retFileInf
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function fileWrite(inf) {
    let ret = { 'ret': false };
    try {
        if (inf.file == undefined || inf.file == '') {
            //ret['msg'] = `INFORMAR O 'file'`;
            ret['msg'] = `\n #### ERRO ####  FILE WRITE \n INFORMAR O 'file' \n\n`;
        } else if (typeof inf.rewrite !== 'boolean') {
            //ret['msg'] = `INFORMAR O 'rewrite' TRUE ou FALSE`;
            ret['msg'] = `\n #### ERRO ####  FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`;
        } else if (inf.text == undefined || inf.text == '') {
            //ret['msg'] = `INFORMAR O 'text'`;
            ret['msg'] = `\n #### ERRO ####  FILE WRITE \n INFORMAR O 'text' \n\n`;
        } else {

            const resNodeOrBrowser = await nodeOrBrowser()
            if (resNodeOrBrowser.res == 'node') {
                // NODEJS
                const fs = await import('fs');
                const path = await import('path');
                async function createDirectoriesRecursive(directoryPath) {
                    const normalizedPath = path.normalize(directoryPath);
                    const directories = normalizedPath.split(path.sep);
                    let currentDirectory = '';
                    for (let directory of directories) {
                        currentDirectory += directory + path.sep;
                        if (!fs.existsSync(currentDirectory)) { await fs.promises.mkdir(currentDirectory); }
                    }; return true;
                }
                const folderPath = path.dirname(inf.file);
                await createDirectoriesRecursive(folderPath);
                await fs.promises.writeFile(inf.file, inf.text, { flag: inf.rewrite ? 'a' : 'w' });
            } else {
                // CHROME
                let textOk = inf.text;
                if (inf.rewrite) {
                    const infFileRead = { 'file': `D:/Downloads/Google Chrome/${inf.file}` }
                    const retFileRead = await fileRead(infFileRead)
                    if (retFileRead.ret) { textOk = `${retFileRead.res}${textOk}` }
                }
                const blob = new Blob([textOk], { type: 'text/plain' });
                const downloadOptions = {
                    url: URL.createObjectURL(blob),
                    filename: inf.file,
                    saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                    conflictAction: 'overwrite' // overwrite (SUBSTITUIR) OU uniquify (REESCREVER→ ADICIONANDO (1), (2), (3)... NO FINAL)
                };
                chrome.downloads.download(downloadOptions);
            }
            ret['ret'] = true;
            ret['msg'] = `FILE WRITE: OK`;
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function fileRead(inf) {
    let ret = { 'ret': false };
    try {
        let retFetch
        const retNodeOrBrowser = await nodeOrBrowser();

        if (retNodeOrBrowser.res == 'node') { // ################## NODE
            const fs = await import('fs');
            retFetch = fs.readFileSync(inf.file.replace(/\//g, '\\'), 'utf8');
        }

        if (retNodeOrBrowser.res == 'chrome') { // ################## CHROME
            retFetch = await fetch(`file:///${inf.file}`);
            retFetch = await retFetch.text();
        }
        ret['ret'] = true;
        ret['msg'] = `FILE READ: OK`;
        ret['res'] = retFetch;
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res;
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret;
}

async function configStorage(inf) {
    let ret = { 'ret': false };
    try {
        const retNodeOrBrowser = await nodeOrBrowser();

        if (retNodeOrBrowser.res == 'chrome') { // ################## CHROME

            if (inf.action == 'set') { // STORAGE: SET
                await storageSet(inf)
                async function storageSet(inf) {
                    return new Promise((resolve) => {
                        const data = {};
                        if (!inf.key) {
                            //ret['msg'] = 'STORAGE SET: ERRO | INFORMAR A "key"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE SET \n INFORMAR A 'key' \n\n`;
                        } else if (!inf.value) {
                            //ret['msg'] = 'STORAGE SET: ERRO | INFORMAR O "value"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE SET \n INFORMAR O 'value' \n\n`;
                        } else {
                            data[inf.key] = inf.value;
                            chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE SET: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE SET \n ${chrome.runtime.lastError} \n\n`;
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE SET: OK';
                                }
                                resolve(ret);
                            });
                            return;
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'get') { // STORAGE: GET
                await storageGet(inf)
                async function storageGet(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            //ret['msg'] = 'STORAGE GET: ERRO | INFORMAR A "key"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE GET \n INFORMAR A 'key' \n\n`;
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE GET: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE GET \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    async function checkConfig() {
                                        const retConfigJson = await fetch(`${inf.path}`);
                                        const config = await retConfigJson.json();
                                        if (config[inf.key]) {
                                            const data = {};
                                            data[inf.key] = config[inf.key];
                                            return new Promise((resolve) => {
                                                chrome.storage.local.set(data, async () => {
                                                    if (chrome.runtime.lastError) {
                                                        //ret['msg'] = `STORAGE SET*: ERRO | ${chrome.runtime.lastError}`;
                                                        ret['msg'] = `\n #### ERRO ####  STORAGE SET* \n ${chrome.runtime.lastError} \n\n`;
                                                    } else {
                                                        ret['ret'] = true;
                                                        ret['msg'] = 'STORAGE GET: OK';
                                                        ret['res'] = config[inf.key]
                                                    }
                                                    resolve(ret);
                                                });
                                                return;
                                            })
                                        }
                                        else {
                                            //ret['msg'] = `STORAGE GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                            ret['msg'] = `\n #### ERRO ####  STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                        }
                                        return ret;
                                    }
                                    await checkConfig()
                                } else {
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE GET: OK';
                                    ret['res'] = result[inf.key]
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

            if (inf.action == 'del') { // STORAGE: DEL
                await storageDel(inf)
                async function storageDel(inf) {
                    return new Promise((resolve) => {
                        if (!inf.key) {
                            //ret['msg'] = 'STORAGE DEL: ERRO | INFORMAR A "key"';
                            ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n INFORMAR A 'key' \n\n`;
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    //ret['msg'] = `STORAGE DEL: ERRO | ${chrome.runtime.lastError}`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    //ret['msg'] = `STORAGE DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                                    ret['msg'] = `\n #### ERRO ####  STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                                } else {
                                    chrome.storage.local.remove(inf.key, async () => { });
                                    ret['ret'] = true;
                                    ret['msg'] = 'STORAGE DEL: OK';
                                }
                                resolve(ret);
                            });
                            return
                        }
                        resolve(ret);
                    });
                }
            }

        }

        if (retNodeOrBrowser.res == 'node') { // ################## NODE

            const fs = await import('fs');
            const infFileInf = { 'path': new URL(import.meta.url).pathname }
            const retFileInf = await fileInf(infFileInf);
            const configPath = `${retFileInf.res.pathProject1}${inf.path}`
            const configFile = fs.readFileSync(configPath);
            const config = JSON.parse(configFile);

            if (inf.action == 'set') { // CONFIG: SET
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG SET: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR A 'key' \n\n`;
                    } else if (!inf.value) {
                        //ret['msg'] = 'CONFIG SET: ERRO | INFORMAR O "value"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG SET \n INFORMAR O 'value' \n\n`;
                    } else {
                        ret['ret'] = true;
                        ret['msg'] = `CONFIG SET: OK`;
                        config[inf.key] = inf.value;
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

            if (inf.action == 'get') { // CONFIG NODE: GET
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG GET: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG GET \n INFORMAR A 'key' \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['res'] = config[inf.key];
                        } else {
                            //ret['msg'] = `CONFIG GET: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                            ret['msg'] = `\n #### ERRO ####  CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

            if (inf.action == 'del') { // CONFIG NODE: DEL
                try {
                    if (!inf.key) {
                        //ret['msg'] = 'CONFIG DEL: ERRO | INFORMAR A "key"';
                        ret['msg'] = `\n #### ERRO ####  CONFIG DEL \n INFORMAR A 'key' \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG DEL: OK`;
                            delete config[inf.key];
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                        } else {
                            //ret['msg'] = `CONFIG DEL: ERRO | CHAVE '${inf.key}' NAO ENCONTRADA`;
                            ret['msg'] = `\n #### ERRO ####  CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
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
        const date = new Date();
        const retDate = {
            'day': String(date.getDate()).padStart(2, '0'),
            'mon': String(date.getMonth() + 1).padStart(2, '0'),
            'yea': String(date.getFullYear()),
            'hou': String(date.getHours()).padStart(2, '0'),
            'min': String(date.getMinutes()).padStart(2, '0'),
            'sec': String(date.getSeconds()).padStart(2, '0'),
            'mil': String(date.getMilliseconds()).padStart(3, '0'),
            'tim': Date.now()
        }
        ret['ret'] = true;
        ret['msg'] = `DATE HOUR: OK`;
        ret['res'] = retDate;
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
            const result = inf.text.match(inf.pattern);
            if (result && result[1].length > 0) {
                ret['ret'] = true;
                ret['msg'] = `REGEX: OK`;
                ret['res'] = {
                    'bolean': true,
                    'text': result[1]
                }
            } else {
                ret['ret'] = true;
                //ret['msg'] = `REGEX: ERRO | PADRAO '${inf.pattern}' NAO ENCONTRADO`;
                ret['msg'] = `\n #### ERRO ####  REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`;
                ret['res'] = { 'bolean': false }
            }
        } else {
            const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const result = new RegExp(`^${pattern}$`).test(inf.text);
            if (inf.simple) {
                if (result) {
                    return true
                } else {
                    return false
                }
            } else {
                if (result) {
                    ret['ret'] = true;
                    ret['msg'] = `REGEX: OK`;
                    ret['res'] = {
                        'bolean': true,
                        'text': 'TEXTO POSSUI O PADRAO'
                    }
                } else {
                    ret['ret'] = true;
                    //ret['msg'] = `REGEX: ERRO | PADRAO '${inf.pattern}' NAO ENCONTRADO`;
                    ret['msg'] = `\n #### ERRO ####  REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`;
                    ret['res'] = { 'bolean': false }
                }
            }
        }
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

async function random(inf) {
    let ret = { 'ret': false };
    try {
        const min = inf.min;
        const max = inf.max;
        const message = inf.await ? true : false
        const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) {
            console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`);
            await new Promise(resolve => setTimeout(resolve, number));
        }
        ret['ret'] = true;
        ret['msg'] = `RANDON: OK`;
        ret['res'] = number / 1000;
    } catch (e) {
        ret['msg'] = regexE({ 'e': e }).res
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// ############### GLOBAL OBJECT ###############
const data = { inf: false };
const listeners = new Set();
const globalObject = new Proxy(data, {
    set(target, key, value) {
        target[key] = value; globalChanged(value);
        listeners.forEach(listener => listener(target)); return true
    }
});
function addListener(listener) { listeners.add(listener) }
function removeListener(listener) { listeners.delete(listener) }
async function globalChanged(i) { if (i.alert !== false) { console.log('globalObject ALTERADO →', i) } }
// ############### ###############

function regexE(inf) {
    let ret = { 'ret': false };
    try {
        ret['ret'] = true;
        ret['msg'] = `REGEX E: OK`;
        const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        if (match && match.length === 3) {
            ret['res'] = `\n #### ERRO ####  ${match[1]} [${match[2]}] \n ${inf.e.toString()} \n\n`
        } else {
            ret['res'] = `\n #### ERRO ####  NAO IDENTIFICADO [NAO IDENTIFICADA] \n ${inf.e.toString()} \n\n`
        }
    } catch (e) {
        const match = e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        ret['msg'] = `\n #### ERRO ####  ${match[1]} [${match[2]}] \n ${e.toString()} \n\n`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}

// export { api, nodeOrBrowser, fileInf, fileWrite, fileRead, configStorage, dateHour, regex, random, globalObject, addListener, regexE };

if (typeof window !== 'undefined') { // CHROME
    window['api'] = api;
    window['nodeOrBrowser'] = nodeOrBrowser;
    window['fileWrite'] = fileWrite;
    window['fileRead'] = fileRead;
    window['configStorage'] = configStorage;
    window['dateHour'] = dateHour;
    window['regex'] = regex;
    window['random'] = random;
    window['globalObject'] = globalObject;
    window['addListener'] = addListener;
    window['regexE'] = regexE;
} else if (typeof global !== 'undefined') { // NODE
    global['fileInf'] = fileInf;
    global['api'] = api;
    global['nodeOrBrowser'] = nodeOrBrowser;
    global['fileWrite'] = fileWrite;
    global['fileRead'] = fileRead;
    global['configStorage'] = configStorage;
    global['dateHour'] = dateHour;
    global['regex'] = regex;
    global['random'] = random;
    global['globalObject'] = globalObject;
    global['addListener'] = addListener;
    global['regexE'] = regexE;
}




// const { google } = await import('googleapis');
// const sheets = google.sheets('v4');
// const spreadsheetId = '1lSl6VUYmp0c32Gu8qwlbtJ-BGdl1gKXB9YC4thffSOk'
// const sheetTab = 'DADOS'
// let sheetLin = 0
// const authClient = new google.auth.GoogleAuth({
//     keyFile: './src/resources/api.json',
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// async function lastLin(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         const range = `${sheetTab}!A2`;
//         const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range, });
//         ret['ret'] = true;
//         ret['msg'] = `LAST LIN: OK`;
//         ret['res'] = Number(response.data.values[0][0]);

//     } catch (e) {
//         ret['msg'] = regexE({ 'e': e }).res
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function dataGet(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         const range = `${sheetTab}!B${inf.lin}`;
//         const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range, });
//         ret['ret'] = true;
//         ret['msg'] = `DATA GET: OK`;
//         ret['res'] = response.data.values;

//     } catch (e) {
//         ret['msg'] = regexE({ 'e': e }).res
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function dataSend(inf) {
//     let ret = { 'ret': false };
//     try {

//         const auth = await authClient.getClient();
//         console.log(auth)
//         await sheets.spreadsheets.values.update({
//             auth,
//             spreadsheetId,
//             range: `${sheetTab}!B${inf.lin}`,
//             valueInputOption: 'USER_ENTERED',
//             resource: { values: [[inf.values]] },
//         });
//         ret['ret'] = true;
//         ret['msg'] = `DATA SEND: OK`;

//     } catch (e) {
//         ret['msg'] = regexE({ 'e': e }).res
//     }

//     if (!ret.ret) { console.log(ret.msg) }
//     return ret
// }

// async function fun() {

//     const retLastlin = await lastLin()
//     console.log(retLastlin);

//     const infDataSend = { 'lin': retLastlin.res, 'values': 'Ola' }
//     const retDataSend = await dataSend(infDataSend)
//     console.log(retDataSend);

// }
// //fun()








// const { api } = await import('./api.js');
// const { fileWrite } = await import('./fileWrite.js');

// async function teste() {
//     let ret = { 'ret': false };

//     try {
//         perfils = [perfils[0]]
//         for (let i = 0; i < perfils.length; i++) {
//             const perfilId = perfils[i];

//             const infApi = {
//                 url: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${perfilId}`,
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-ig-app-id': '936619743392459',
//                     'sec-fetch-site': 'same-origin'
//                 }
//             };

//             const retApi = await api(infApi);
//             console.log(retApi)
//             if (!retApi.ret) { ret['ret'] = false; }
//             const res = JSON.parse(retApi.res.body);

//             const infFileWrite = {
//                 'file': `PERFILS/${res.data.user.id}=${perfilId}.txt`,
//                 'rewrite': false,
//                 'text': JSON.stringify(res)
//             };
//             await fileWrite(infFileWrite);

//             ret['ret'] = true;
//             ret['msg'] = 'FUNCTIONS: OK';
//             console.log(`${perfils.length} - ${i + 1} | ${res.data.user.id} = ${perfilId}`);

//         }
//     } catch (e) {
//         ret['msg'] = regexE({ 'e': e }).res
//     }

//     if (!ret.ret) { console.log(ret.msg) }
// }

// teste()
