// let infConfigStorage, retConfigStorage;
// infConfigStorage = { 'action': 'set', 'key': 'NomeDaChave', 'value': 'Valor da chave' }
// infConfigStorage = { 'action': 'get', 'key': 'NomeDaChave' }
// infConfigStorage = { 'action': 'del', 'key': 'NomeDaChave' }
// retConfigStorage = await configStorage(infConfigStorage);
// console.log(retConfigStorage)

async function configStorage(inf) {
    await import('./@functions.js')
    let ret = { 'ret': false }; try {
        if (inf instanceof Array && inf.length == 1) { // ### CS
            inf['path'] = `${conf[1]}:/${conf[2]}/log/reg.json`; let dt, rf = {}; if (inf[0] == '' || inf[0] == '*') {
                rf = await file({ 'action': 'read', 'path': inf.path }); if (!rf.ret) { dt = {} } else { dt = JSON.parse(rf.res).dt }
            } else { dt = typeof inf[0] === 'object' ? inf[0] : { 'key': inf[0] } };
            if (!rf.ret) { rf = await file({ 'action': 'write', 'path': inf.path, 'rewrite': false, 'text': JSON.stringify({ 'dt': dt }, null, 2) }) }
            ret['res'] = dt; ret['ret'] = true; ret['msg'] = 'CS: OK'
        } else {
            let run = false; if (!inf.action || !['set', 'get', 'del'].includes(inf.action)) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'action' \n\n` } else {
                if ((!inf.key || inf.key == '')) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR A 'key' \n\n`; }
                else { if (inf.action == 'set' && !inf.value) { ret['msg'] = `\n\n #### ERRO #### CONFIG STORAGE \n INFORMAR O 'value' \n\n` } else { run = true } }
            }; if (run) {
                if (typeof window !== 'undefined') { // CHROME
                    if (inf.action == 'set') { // #### STORAGE: SET
                        await storageSet(inf); async function storageSet(inf) {
                            return new Promise((resolve) => {
                                const data = {}; data[inf.key] = inf.value; chrome.storage.local.set(data, async () => {
                                    if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE SET \n ${chrome.runtime.lastError} \n\n` }
                                    else { ret['ret'] = true; ret['msg'] = 'STORAGE SET: OK' }; resolve(ret);
                                });
                            });
                        }
                    } else if (inf.action == 'get') { // #### STORAGE: GET
                        await storageGet(inf); async function storageGet(inf) {
                            return new Promise((resolve) => {
                                chrome.storage.local.get(inf.key, async (result) => {
                                    if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE GET \n ${chrome.runtime.lastError} \n\n` }
                                    else if (Object.keys(result).length == 0) {
                                        async function checkConfig() {
                                            const infFile = { 'action': 'read', 'path': conf[0], 'functionLocal': true }
                                            const retFile = await file(infFile); const config = JSON.parse(retFile.res);
                                            if (config[inf.key]) {
                                                const data = {}; data[inf.key] = config[inf.key]; return new Promise((resolve) => {
                                                    chrome.storage.local.set(data, async () => {
                                                        if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE SET* \n ${chrome.runtime.lastError} \n\n` }
                                                        else { ret['ret'] = true; ret['msg'] = 'STORAGE GET: OK'; ret['res'] = config[inf.key] }; resolve(ret)
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
                                    if (chrome.runtime.lastError) { ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n ${chrome.runtime.lastError} \n\n` }
                                    else if (Object.keys(result).length == 0) { ret['msg'] = `\n\n #### ERRO #### STORAGE DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n` }
                                    else { chrome.storage.local.remove(inf.key, async () => { }); ret['ret'] = true; ret['msg'] = 'STORAGE DEL: OK' }; resolve(ret)
                                }); return
                            });
                        }
                    }
                } else { // ################## NODE
                    let infFile, retFile, config, path, ret_Fs = false; if (inf.path && inf.path.includes(':')) { path = inf.path } else {
                        if (inf.path && typeof inf.functionLocal == 'boolean') { infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal } }
                        else { infFile = { 'action': 'relative', 'path': conf[0], 'functionLocal': true } }; retFile = await file(infFile); path = retFile.res[0]
                    }; try { await _fs.promises.access(path); ret_Fs = true } catch (e) { }
                    if (ret_Fs) { const configFile = await _fs.promises.readFile(path, 'utf8'); config = JSON.parse(configFile) } else { config = {} }
                    if (!inf.key || inf.key == '') { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR A 'key' \n\n`; }
                    else if (inf.action == 'set') { // #### CONFIG: SET
                        if (!inf.value && !inf.value == false) { ret['msg'] = `\n\n #### ERRO #### CONFIG \n INFORMAR O 'value' \n\n` } else {
                            if (inf.key == '*' && typeof inf.value !== 'object') { ret['msg'] = `\n\n #### ERRO #### CONFIG \n VALOR NAO É OBJETO \n\n` }
                            else if (inf.key == '*') { config = inf.value } else { config[inf.key] = inf.value }; if (!ret.msg) {
                                infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                                retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG SET: OK`
                            }
                        }
                    } else if (inf.action == 'get') { // #### CONFIG NODE: GET
                        if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n ARQUIVO '${path}' NAO ENCONTRADO \n\n` }
                        else if (inf.key == '*' || (inf.key !== '*' && config[inf.key])) {
                            ret['ret'] = true; ret['msg'] = `CONFIG GET: OK`; ret['res'] = inf.key == '*' ? config : config[inf.key]
                        } else { ret['msg'] = `\n\n #### ERRO #### CONFIG GET \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n` }
                    } else if (inf.action == 'del') { // #### CONFIG NODE: DEL
                        if (!ret_Fs) { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL\n ARQUIVO '${path}' NAO ENCONTRADO \n\n` } else if (config[inf.key]) {
                            delete config[inf.key]; infFile = { 'action': 'write', 'path': path, 'rewrite': false, 'text': JSON.stringify(config, null, 2) }
                            retFile = await file(infFile); ret['ret'] = true; ret['msg'] = `CONFIG DEL: OK`
                        } else { ret['msg'] = `\n\n #### ERRO #### CONFIG DEL \n CHAVE '${inf.key}' NAO ENCONTRADA \n\n`; }
                    }
                }
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['configStorage'] = configStorage;
} else { // NODEJS
    global['configStorage'] = configStorage;
}