// let retLogsDel = await logsDel(); console.log(retLogsDel);

let e, ee; if (process?.argv?.[1]?.includes('logsDel.js')) { globalThis['firstFileCall'] = new Error(); await import('../resources/@export.js'); e = firstFileCall, ee = e; await logsDel(); }

async function logsDel(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let pathsDel = [], filesDelOrNot = [], retDelOrNot;

        async function delOrNot(inf = {}) {
            let { daysKeep, path, edit, } = inf; if (!(path.includes('MES_') && path.includes('DIA_'))) { let dif = Math.trunc((new Date() - new Date(edit)) / (1000 * 60 * 60 * 24)); return dif > daysKeep; } else {
                let today = new Date(), regexYearMatch = path.match(/ANO_(\d{4})/), year = regexYearMatch ? parseInt(regexYearMatch[1]) : 2000, regexMon = parseInt(path.match(/MES_(\d{2})/)[1]) - 1;
                let regexDay = parseInt(path.match(/DIA_(\d{2})/)[1]), targetDate = new Date(year, regexMon, regexDay), dif = Math.abs(Math.trunc((targetDate - today) / (1000 * 60 * 60 * 24))); return dif > daysKeep;
            }
        } //                                                          [JavaScript/Python | Registros]
        let logsLight = 15, logsHeavy = gW.devMaster === 'AWS' ? 3 : 7, log1 = logsLight, log2 = logsHeavy;
        let pathsToDel = [

            // [WINDOWS] BAT
            { 'daysKeep': 5, 'path': `${fileWindows}/BAT/z_logs`, }, // MÍNIMO DE 5 DIAS POR CAUSA DA RESTAURAÇÃO QUE É FEITA A CADA 3 DIAS



            // [PROJETOS] Chat
            { 'daysKeep': log1, 'path': `${fileProjetos}/Chat/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Chat/logs/Registros`, },
            { 'daysKeep': log1, 'path': `${fileProjetos}/Chat/logs/Python`, },

            // [PROJETOS] Connection
            { 'daysKeep': log1, 'path': `${fileProjetos}/Connection/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Connection/logs/Registros`, },

            // [PROJETOS] Extension
            { 'daysKeep': log1, 'path': `${fileProjetos}/Extension/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Extension/logs/Registros`, },

            // [PROJETOS] IPTV
            { 'daysKeep': log1, 'path': `${fileProjetos}/IPTV/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/IPTV/logs/Registros`, },

            // [PROJETOS] Sniffer
            { 'daysKeep': log1, 'path': `${fileProjetos}/Sniffer/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Sniffer/logs/Registros`, },
            { 'daysKeep': log1, 'path': `${fileProjetos}/Sniffer/logs/Python`, },

            // [PROJETOS] WebScraper
            { 'daysKeep': log1, 'path': `${fileProjetos}/WebScraper/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/WebScraper/logs/Registros`, },



            // [DISCO C] Program Files / Program Files (x86)
            { 'daysKeep': 2, 'path': `C:/Program Files`, 'patterns': [`*chrome_BITS_*`, `*chrome_url_fetcher_*`,], },
            { 'daysKeep': 2, 'path': `C:/Program Files (x86)`, 'patterns': [`*chrome_BITS_*`, `*chrome_url_fetcher_*`,], },

            // [PROJETOS] PORTABLE-Libre_Hardware_Monitor
            { 'daysKeep': 4, 'path': `${fileWindows}/PORTABLE-System_Informer/z_OUTROS/PORTABLE-Libre_Hardware_Monitor`, 'patterns': [`*LibreHardwareMonitorLog-*`,], },

        ];

        // LISTAR PASTAS E ARQUIVOS
        for (let [, val,] of pathsToDel.entries()) {
            let retFile = await file({ e, 'action': 'list', 'path': val.path, 'max': 500, }); retFile = retFile.ret ? retFile.res : []; for (let [, val1,] of retFile.entries()) {
                if (val.patterns) { if (val.patterns.some(v => regex({ 'simple': true, 'pattern': v, 'text': val1.path, }))) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val1.path, 'edit': val1.edit, }); } }
                else if (!val1.isFolder) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val1.path, 'edit': val1.edit, }); } else {
                    let lvl1 = await file({ e, 'action': 'list', 'path': val1.path, 'max': 500, }); lvl1 = lvl1.ret ? lvl1.res : []; if (lvl1.length === 0) { pathsDel.push({ 'path': val1.path, }); continue; }
                    for (let [, val2,] of lvl1.entries()) {
                        if (val2.isFolder) {
                            let lvl2 = await file({ e, 'action': 'list', 'path': val2.path, 'max': 500, }); lvl2 = lvl2.ret ? lvl2.res : []; if (lvl2.length === 0) { pathsDel.push({ 'path': val2.path, }); }
                            else { for (let [, val3,] of lvl2.entries()) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val3.path, 'edit': val3.edit, }); } }
                        } else { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val2.path, 'edit': val2.edit, }); }
                    }
                }
            }
        }

        // DEFINIR PASTAS/ARQUIVOS PARA SEREM EXCLUÍDOS | APAGAR PASTAS/ARQUIVOS
        for (let [idx, value,] of filesDelOrNot.entries()) { retDelOrNot = await delOrNot(value); if (retDelOrNot) { pathsDel.push({ 'path': value.path, }); } }
        if (pathsDel.length > 0) { for (let [idx, v,] of pathsDel.entries()) { await file({ e, 'action': 'del', 'path': v.path, }); } } logConsole({ e, ee, 'txt': `LOGS APAGADOS\n${JSON.stringify(pathsDel, null, 2)}`, });

        // LIMPAR PASTA 'Temp'
        await commandLine({ e, 'command': `${fileWindows}/BAT/clearTemp.bat NODE-CONNECTION-SERVER_-_LOGS_DEL_OLD`, });

        ret['res'] = pathsDel;
        ret['msg'] = `LOGS DEL OLD: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['logsDel'] = logsDel;


