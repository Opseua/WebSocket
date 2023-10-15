// let infFile, retFile
// infFile = { 'action': 'inf' }
// infFile = { 'action': 'write', 'functionLocal': true, 'path': './PASTA/ola.txt', 'rewrite': true, 'text': '1234\n' }
// infFile = { 'action': 'read', 'functionLocal': true, 'path': './PASTA/ola.txt' }
// infFile = { 'action': 'list', 'functionLocal': true, 'path': './PASTA/', 'max': 10 }
// infFile = { 'action': 'change', 'functionLocal': true, 'path': './PASTA/', 'pathNew': './PASTA2/' }
// infFile = { 'action': 'del', 'functionLocal': true, 'path': './PASTA2/' }
// retFile = await file(infFile); console.log(retFile)

async function file(inf) {
    if (typeof window !== 'undefined') { // CHROME
        if (!window.all) { await import('./@functions.js') }
    } else { if (!global.all) { await import('./@functions.js') } }
    let ret = { 'ret': false }; try { // PASSAR NO jsonInterpret
        if (/\$\[[^\]]+\]/.test(JSON.stringify(inf))) { let rji = await jsonInterpret({ 'json': inf }); if (rji.ret) { rji = JSON.parse(rji.res); inf = rji } }
        if (!inf.action || !['write', 'read', 'del', 'inf', 'relative', 'list', 'change'].includes(inf.action)) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'action' \n\n`;
        } else if (typeof inf.functionLocal !== 'boolean' && inf.action !== 'inf' && !inf.path.includes(':')) {
            ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'functionLocal' \n\n`
        } else if (inf.action !== 'inf' && (!inf.path || inf.path == '')) { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'path' \n\n` } else {
            let infFile, retFile, path, retFetch = '', text, jsonFile, functionLocal, fileOk, e, relative, pathFull, relativeParts, retRelative, pathOld, pathNew
            if (inf.action == 'write') { // ########################## WRITE
                if (typeof inf.rewrite !== 'boolean') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'rewrite' TRUE ou FALSE \n\n`; }
                else if (!inf.text || inf.text == '') { ret['msg'] = `\n\n #### ERRO #### FILE WRITE \n INFORMAR O 'text' \n\n`; } else {
                    text = typeof inf.text === 'object' ? JSON.stringify(inf.text) : inf.text
                    if (inf.path.includes(':')) { path = inf.path; if (typeof window !== 'undefined') { path = path.split(':/')[1] } } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
                        retFile = await file(infFile); path = retFile.res[0]
                    }; if (typeof window !== 'undefined') { // CHROME
                        if (path.includes('%/')) { path = path.split('%/')[1] } else if (path.includes(':')) { path = path.split(':/')[1] } else { path = path };
                        if (inf.rewrite) {
                            try {
                                infFile = { 'action': 'read', 'path': path, 'functionLocal': inf.functionLocal && typeof window == 'undefined' ? true : false };
                                retFile = await file(infFile); if (retFile.ret) { retFetch = retFile.res }; text = `${retFetch}${text}`
                            } catch (e) { }
                        }; const blob = new Blob([text], { type: 'text/plain' }); const downloadOptions = { // 'overwrite' LIMPA | 'uniquify' (ADICIONA (1), (2), (3)... NO FINAL)
                            url: URL.createObjectURL(blob), filename: path, saveAs: false, conflictAction: 'overwrite'
                        }; chrome.downloads.download(downloadOptions)
                    } else { // NODEJS
                        await _fs.promises.mkdir(_path.dirname(path), { recursive: true }); await _fs.promises.writeFile(path, text, { flag: !inf.rewrite ? 'w' : 'a' })
                    }; ret['ret'] = true; ret['msg'] = `FILE WRITE: OK`
                }
            } else if (inf.action == 'read') { // ########################## READ
                if (inf.path.includes(':')) { path = inf.path } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
                }; if (typeof window !== 'undefined') { // CHROME
                    if (!inf.functionLocal) { path = `file:///${path}` }; retFetch = await fetch(path.replace('%', '')); retFetch = await retFetch.text()
                } else { retFetch = await _fs.promises.readFile(path, 'utf8') }; ret['ret'] = true; ret['msg'] = `FILE READ: OK`; ret['res'] = retFetch; // NODEJS
            } else if (inf.action == 'del' && typeof window == 'undefined') { // ########################## DEL
                if (inf.path.includes(':')) { path = inf.path } else {
                    infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
                }; async function delP(inf) {
                    try {
                        const s = await _fs.promises.stat(inf); if (s.isDirectory()) {
                            const as = await _fs.promises.readdir(inf); for (const a of as) { const c = _path.join(inf, a); await delP(c) }; await _fs.promises.rmdir(inf)
                        } else { await _fs.promises.unlink(inf) }; ret['ret'] = true; ret['msg'] = `FILE DEL: OK`;
                    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = `\n\n #### ERRO #### FILE DEL \n ${m.res} \n\n` }
                }; await delP(path)
            } else if (inf.action == 'inf') { // INF [0] config.json | [1] letra | [2] caminho do projeto atual | [3] path download/terminal | [4] arquivo atual
                e = JSON.stringify(new Error().stack).replace('at ', '').replace('run (', ''); if (conf.length == 1) { // NOME DO PROJETO E TERMINAL
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
                        fileOk = fileOk.replace(`${functionLocal}/`, ''); jsonFile = await _fs.promises.readFile(`${functionLocal}/${conf}`, 'utf8');
                        jsonFile = JSON.parse(jsonFile).conf
                        conf = [conf[0], jsonFile[0], functionLocal.split(':/')[1], process.cwd().replace(/\\/g, '/').split(':/')[1], `${fileOk}.js`]
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
                if (!inf.max || inf.max == '') { ret['msg'] = `\n\n #### ERRO #### FILE \n INFORMAR O 'max' \n\n`; } else {
                    if (inf.path.includes(':')) { path = inf.path } else {
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); path = retFile.res[0]
                    }; let retFilesList = { 'path': path, 'max': inf.max }; function formatBytes(b, d = 2) {
                        if (b == 0) return '0 Bytes'; const i = Math.floor(Math.log(b) / Math.log(1024));
                        return parseFloat((b / Math.pow(1024, i)).toFixed(d < 0 ? 0 : d)) + ' ' + ['bytes', 'KB', 'MB', 'GB'][i];
                    }; let iFilesList = 0; async function filesList(inf, files = []) {
                        try {
                            for (const fileOk of _fs.readdirSync(inf.path)) {
                                if (iFilesList >= inf.max) { break }; const name = `${inf.path}/${fileOk}`; try {
                                    if (_fs.statSync(name).isDirectory()) { filesList({ 'max': inf.max, 'path': name }, files) } else {
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
                        infFile = { 'action': 'relative', 'path': inf.path, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); pathOld = retFile.res[0]
                    }; if (inf.pathNew.includes(':')) { pathNew = inf.pathNew } else {
                        infFile = { 'action': 'relative', 'path': inf.pathNew, 'functionLocal': inf.functionLocal }; retFile = await file(infFile); pathNew = retFile.res[0]
                    }; await _fs.promises.mkdir(_path.dirname(pathNew), { recursive: true }); await _fs.promises.rename(pathOld, pathNew);
                    ret['ret'] = true; ret['msg'] = `FILE CHANGE: OK`
                }
            }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res }; if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['file'] = file;
} else { // NODEJS
    global['file'] = file;
}

