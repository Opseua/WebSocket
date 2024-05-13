// let infDelOldLogs, retDelOldLogs
// retDelOldLogs = await delOldLogs()
// console.log(retDelOldLogs)

let e = import.meta.url, ee = e;
async function delOldLogs(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let infFile, retFile, pathsDel = []

        async function delOrNot(inf) {
            if (!(inf.path.includes('MES_') && inf.path.includes('DIA_'))) {
                let dif = Math.round((new Date() - new Date(inf.edit)) / (1000 * 60 * 60 * 24));
                return dif > inf.dayOld
            } else {
                let regexMon = inf.path.match(/MES_(\d{2})/);
                let regexDay = inf.path.match(/DIA_(\d{2})/);
                regexMon = regexMon[1];
                regexDay = regexDay[1]
                regexMon = parseInt(regexMon) - 1;
                regexDay = parseInt(regexDay);
                let today = new Date();
                let targetDate = new Date(today.getFullYear(), regexMon, regexDay);
                let dif = Math.abs(Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));
                return dif > inf.dayOld
            }
        }

        // → '/WINDOWS/BAT/z_log/...'
        infFile = { 'e': e, 'action': 'list', 'path': `${letter}:/ARQUIVOS/WINDOWS/BAT/z_log`, 'max': 50 }
        retFile = await file(infFile); retFile = retFile.ret ? retFile.res : []
        for (let [index, value] of retFile.entries()) {
            let retDelOrNot = await delOrNot({ 'dayOld': 7, 'path': value.path, 'edit': value.edit });
            if (retDelOrNot) { pathsDel.push(value.path) }
        }

        // → '/log/Registros/...'
        infFile = { 'e': e, 'action': 'list', 'functionLocal': false, 'path': './log/Registros', 'max': 50 }
        retFile = await file(infFile); retFile = retFile.ret ? retFile.res : []
        for (let [index, value] of retFile.entries()) {
            infFile = { 'e': e, 'action': 'list', 'path': value.path, 'max': 50 }
            retFile = await file(infFile); retFile = retFile.ret ? retFile.res : [];
            if (retFile.length == 0) {
                pathsDel.push(value.path)
            } else {
                for (let [index, value] of retFile.entries()) {
                    let retDelOrNot = await delOrNot({ 'dayOld': globalWindow.devMaster == 'AWS' ? 7 : 31, 'path': value.path, 'edit': value.edit });
                    if (retDelOrNot) { pathsDel.push(value.path) }
                }
            }

        }

        if (pathsDel.length > 0) {
            // APAGAR PASTAS/ARQUIVOS ANTIGOS
            for (let [index, value] of pathsDel.entries()) {
                await file({ 'e': e, 'action': 'del', 'path': value });
            }

            logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `LOGS APAGADOS\n${JSON.stringify(pathsDel, null, 2)}` });
        }

        ret['res'] = pathsDel;
        ret['msg'] = `DEL OLD LOGS: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
};

if (eng) { // CHROME
    window['delOldLogs'] = delOldLogs;
} else { // NODEJS
    global['delOldLogs'] = delOldLogs;
}

