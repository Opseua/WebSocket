// const infFileInf = { 'path': new URL(import.meta.url).pathname } // ## CHROME NAO!
// const retFileInf = await fileInf(infFileInf);
// console.log(retFileInf)
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// const infFile = {
//     'action':'write',
//     'file': `PASTAS 1/PASTA 2/arquivo.txt`,
//     'rewrite': true, // 'true' adiciona, 'false' limpa
//     'text': `LINHA 1\nLINHA 2\nLINHA 3\n`
//   };
//   const retFile = await file(infFile);
//   console.log(retFile);
// - # -         - # -     - # -     - # -     - # -     - # -     - # -     - # - 
// let infConfigStorage, retConfigStorage
// infConfigStorage = { 'path': '/src/config.json', 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'NomeDaChave' }
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
// for (let i = 0; i < 10; i++) {
//     console.log(`Iteração ${i + 1}`);
// }
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

async function file(inf) {
    let ret = { 'ret': false };
    try {
        if (!inf.action || !(inf.action == 'write' || inf.action == 'read')) {
            ret['msg'] = `\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
        } else {
            if (inf.action == 'write') {
                if (!inf.file || inf.file == '') {
                    ret['msg'] = `\n #### ERRO #### FILE WRITE \n INFORMAR O 'file' \n\n`;
                } else if (typeof inf.rewrite !== 'boolean') {
                    ret['msg'] = `\n #### ERRO #### FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`;
                } else if (!inf.text || inf.text == '') {
                    ret['msg'] = `\n #### ERRO #### FILE WRITE \n INFORMAR O 'text' \n\n`;
                } else {
                    if (typeof window !== 'undefined') { // CHROME
                        let textOk = inf.text;
                        if (inf.rewrite) {
                            const file = inf.file.includes(':') ? inf.file.slice(3) : inf.file;
                            const infFile = { 'action': 'read', 'file': `D:/Downloads/Google Chrome/${file}` }
                            const retFile = await file(infFile)
                            if (retFile.ret) { textOk = `${retFile.res}${textOk}` }
                        }
                        const blob = new Blob([textOk], { type: 'text/plain' });
                        const downloadOptions = {
                            url: URL.createObjectURL(blob),
                            filename: inf.file,
                            saveAs: false, // PERGUNTAR AO USUARIO ONDE SALVAR
                            conflictAction: 'overwrite' // overwrite (SUBSTITUIR) OU uniquify (REESCREVER→ ADICIONANDO (1), (2), (3)... NO FINAL)
                        };
                        chrome.downloads.download(downloadOptions);
                    } else { // NODEJS
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
                    }
                    ret['ret'] = true;
                    ret['msg'] = `FILE WRITE: OK`;
                }
            } else {
                let retFetch
                if (typeof window !== 'undefined') { // CHROME
                    retFetch = await fetch(`file:///${inf.file}`);
                    retFetch = await retFetch.text();
                } else { // NODEJS
                    const fs = await import('fs');
                    retFetch = fs.readFileSync(inf.file.replace(/\//g, '\\'), 'utf8');
                }
                ret['ret'] = true;
                ret['msg'] = `FILE READ: OK`;
                ret['res'] = retFetch;
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
        if (typeof window !== 'undefined') { // CHROME

            if (inf.action == 'set') { // STORAGE: SET
                await storageSet(inf)
                async function storageSet(inf) {
                    return new Promise((resolve) => {
                        const data = {};
                        if (!inf.key) {
                            ret['msg'] = `\n #### ERRO #### STORAGE SET \n INFORMAR A 'key' \n\n`;
                        } else if (!inf.value && !inf.value == false) {
                            ret['msg'] = `\n #### ERRO #### STORAGE SET \n INFORMAR O 'value' \n\n`;
                        } else {
                            data[inf.key] = inf.value;
                            chrome.storage.local.set(data, async () => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n`;
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
                            ret['msg'] = `\n #### ERRO #### STORAGE GET \n INFORMAR A 'key' \n\n`;
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n`;
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
                                                        ret['msg'] = `\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n`;
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
                                            ret['msg'] = `\n #### ERRO #### STORAGE GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
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
                            ret['msg'] = `\n #### ERRO #### STORAGE DEL \n INFORMAR A 'key' \n\n`;
                        } else {
                            chrome.storage.local.get(inf.key, async (result) => {
                                if (chrome.runtime.lastError) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n`;
                                } else if (Object.keys(result).length === 0) {
                                    ret['msg'] = `\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
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

        } else { // ################## NODE

            const fs = await import('fs');
            const infFileInf = { 'path': new URL(import.meta.url).pathname }
            const retFileInf = await fileInf(infFileInf);
            const configPath = `${retFileInf.res.pathProject1}${inf.path}`
            const configFile = fs.readFileSync(configPath);
            const config = JSON.parse(configFile);

            if (inf.action == 'set') { // CONFIG: SET
                try {
                    if (!inf.key) {
                        ret['msg'] = `\n #### ERRO #### CONFIG SET \n INFORMAR A 'key' \n\n`;
                    } else if (!inf.value && !inf.value == false) {
                        ret['msg'] = `\n #### ERRO #### CONFIG SET \n INFORMAR O 'value' \n\n`;
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
                        ret['msg'] = `\n #### ERRO #### CONFIG GET \n INFORMAR A 'key' \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG GET: OK`;
                            ret['res'] = config[inf.key];
                        } else {
                            ret['msg'] = `\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
                        }
                    }
                } catch (e) {
                    ret['msg'] = regexE({ 'e': e }).res;
                }
            }

            if (inf.action == 'del') { // CONFIG NODE: DEL
                try {
                    if (!inf.key) {
                        ret['msg'] = `\n #### ERRO #### CONFIG DEL \n INFORMAR A 'key' \n\n`;
                    } else {
                        if (config[inf.key]) {
                            ret['ret'] = true;
                            ret['msg'] = `CONFIG DEL: OK`;
                            delete config[inf.key];
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                        } else {
                            ret['msg'] = `\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`;
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
            let res = {}
            const patternSplit = inf.pattern.split('(.*?)');
            const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const result1 = inf.text.match(`${split1}(.*?)${split2}`);
            const result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`);
            const result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
            const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
            if (result1 && result1.length > 0) { res['1'] = result1[1] }
            else { res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` } // SEM QUEBRA DE LINHA ATE A PRIMEIRA OCORRENCIA
            if (result2 && result2.length > 0) { res['2'] = result2[1] }
            else { res['2'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` } // SEM QUEBRA DE LINHA ATE A ULTIMA OCORRENCIA
            if (result3 && result3.length > 0) { res['3'] = result3[1] }
            else { res['3'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` } // COM QUEBRA DE LINHA ATE A PRIMEIRA OCORRENCIA
            if (result4 && result4.length > 0) { res['4'] = result4[1] }
            else { res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` } // COM QUEBRA DE LINHA ATE A ULTIMA OCORRENCIA
            ret['msg'] = `REGEX: OK`;
            ret['res'] = { 'bolean': true, 'text': res }
        } else {
            const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const result = new RegExp(`^${pattern}$`).test(inf.text);
            if (inf.simple) { if (result) { return true } else { return false } } else {
                if (result) {
                    ret['msg'] = `REGEX: OK`;
                    ret['res'] = { 'bolean': true, 'text': 'TEXTO POSSUI O PADRAO' }
                } else {
                    ret['msg'] = `\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`;
                    ret['res'] = { 'bolean': false }
                }
            }
        }
        ret['ret'] = true;
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
const data = { inf: '' };
const listeners = new Set();
const gO = new Proxy(data, {
    set(target, key, value) {
        target[key] = value;
        globalChanged(value);
        listeners.forEach(listener => listener(target));
        return true
    }
});
function gOAdd(listener) { listeners.add(listener) }
function gORem(listener) { listeners.delete(listener) }
async function globalChanged(i) {
    if (i.alert !== false) {
        //console.log('globalObject ALTERADO →', i)
    }
}
// ############### ###############

function regexE(inf) {
    let ret = { 'ret': false };
    try {
        ret['ret'] = true;
        ret['msg'] = `REGEX E: OK`;
        const match = inf.e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        if (match && match.length === 3) {
            ret['res'] = `\n #### ERRO #### ${match[1]} [${match[2]}] \n ${inf.e.toString()} \n\n`
        } else {
            ret['res'] = `\n #### ERRO #### NAO IDENTIFICADO [NAO IDENTIFICADA] \n ${inf.e.toString()} \n\n`
        }
    } catch (e) {
        const match = e.stack.match(/(\w+\.\w+):(\d+):\d+/);
        ret['msg'] = `\n #### ERRO #### ${match[1]} [${match[2]}] \n ${e.toString()} \n\n`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
};

if (typeof window !== 'undefined') { // CHROME
    // ## functions
    window['api'] = api;
    window['file'] = file;
    window['fileInf'] = fileInf;
    window['configStorage'] = configStorage;
    window['dateHour'] = dateHour;
    window['regex'] = regex;
    window['random'] = random;
    window['regexE'] = regexE;
    window['gO'] = gO;
    window['gOAdd'] = gOAdd;
    window['gORem'] = gORem;
} else { // NODEJS
    // ## functions
    global['api'] = api;
    global['file'] = file;
    global['fileInf'] = fileInf;
    global['configStorage'] = configStorage;
    global['dateHour'] = dateHour;
    global['regex'] = regex;
    global['random'] = random;
    global['regexE'] = regexE;
    global['gO'] = gO;
    global['gOAdd'] = gOAdd;
    global['gORem'] = gORem;
}
