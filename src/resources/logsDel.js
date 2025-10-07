// let retLogsDel = await logsDel(); console.log(retLogsDel);

let e, ee; if (process?.argv?.[1]?.includes('logsDel.js')) { globalThis['firstFileCall'] = new Error(); await import('../resources/@export.js'); e = firstFileCall, ee = e; await logsDel(); }

async function logsDel(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let retFile, pathsDel = [], filesDelOrNot = [], retDelOrNot;

        async function delOrNot(inf = {}) {
            let { daysKeep, path, edit, } = inf; if (!(path.includes('MES_') && path.includes('DIA_'))) { let dif = Math.round((new Date() - new Date(edit)) / (1000 * 60 * 60 * 24)); return dif > daysKeep; } else {
                let regexMon = parseInt(path.match(/MES_(\d{2})/)[1]) - 1, regexDay = parseInt(path.match(/DIA_(\d{2})/)[1]), today = new Date();
                let targetDate = new Date(today.getFullYear(), regexMon, regexDay), dif = Math.abs(Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))); return dif > daysKeep;
            }
        }//                                                           [JavaScript/Python | Registros]
        let logsLight = 30, logsHeavy = gW.devMaster === 'AWS' ? 3 : 7, log1 = logsLight, log2 = logsHeavy;
        let pathsToDel = [

            // [WINDOWS] BAT
            { 'daysKeep': 3, 'path': `${fileWindows}/BAT/z_logs`, },

            // [PROJETOS] Chat_Python
            { 'daysKeep': log1, 'path': `${fileProjetos}/Chat_Python/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Chat_Python/logs/Registros`, },
            { 'daysKeep': log1, 'path': `${fileProjetos}/Chat_Python/logs/Python`, },

            // [PROJETOS] Chrome_Extension
            { 'daysKeep': log1, 'path': `${fileProjetos}/Chrome_Extension/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Chrome_Extension/logs/Registros`, },

            // [PROJETOS] IPTV
            { 'daysKeep': log1, 'path': `${fileProjetos}/IPTV/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/IPTV/logs/Registros`, },

            // [PROJETOS] Sniffer_Python
            { 'daysKeep': log1, 'path': `${fileProjetos}/Sniffer_Python/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/Sniffer_Python/logs/Registros`, },
            { 'daysKeep': log1, 'path': `${fileProjetos}/Sniffer_Python/logs/Python`, },

            // [PROJETOS] URA_Reversa
            { 'daysKeep': log1, 'path': `${fileProjetos}/URA_Reversa/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/URA_Reversa/logs/Registros`, },

            // [PROJETOS] WebScraper
            { 'daysKeep': log1, 'path': `${fileProjetos}/WebScraper/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/WebScraper/logs/Registros`, },

            // [PROJETOS] WebSocket
            { 'daysKeep': log1, 'path': `${fileProjetos}/WebSocket/logs/JavaScript`, },
            { 'daysKeep': log2, 'path': `${fileProjetos}/WebSocket/logs/Registros`, },

            // [DISCO C] Program Files / Program Files (x86)
            { 'daysKeep': 1, 'path': `C:/Program Files`, 'patterns': [`*chrome_BITS_*`, `*chrome_url_fetcher_*`,], },
            { 'daysKeep': 1, 'path': `C:/Program Files (x86)`, 'patterns': [`*chrome_BITS_*`, `*chrome_url_fetcher_*`,], },

            // [PROJETOS] PORTABLE_Libre_Hardware_Monitor
            { 'daysKeep': 3, 'path': `${fileWindows}/PORTABLE_System_Informer/z_OUTROS/PORTABLE_Libre_Hardware_Monitor`, 'patterns': [`*LibreHardwareMonitorLog-*`,], },

        ];

        // LISTAR PASTAS E ARQUIVOS
        for (let [index, val,] of pathsToDel.entries()) { // CHECAR SE DEVE SER DELETADO [ARQUIVO] | CHECAR SE DEVE SER DELETADO [PASTA] | DENTRO DA PASTA
            retFile = await file({ e, 'action': 'list', 'path': val.path, 'max': 500, }); retFile = retFile.ret ? retFile.res : []; for (let [index1, val1,] of retFile.entries()) {
                if (val.patterns) { if (val.patterns.some(v => regex({ 'simple': true, 'pattern': v, 'text': val1.path, }))) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val1.path, 'edit': val1.edit, }); } }
                else if (!val1.isFolder) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val1.path, 'edit': val1.edit, }); } else {
                    retFile = await file({ e, 'action': 'list', 'path': val1.path, 'max': 500, }); retFile = retFile.ret ? retFile.res : []; if (retFile.length === 0) { pathsDel.push({ 'path': val1.path, }); }
                    else { for (let [index2, val2,] of retFile.entries()) { filesDelOrNot.push({ 'daysKeep': val.daysKeep, 'path': val2.path, 'edit': val2.edit, }); } }
                }
            }
        }

        // DEFINIR PASTAS/ARQUIVOS PARA SEREM EXCLUÍDOS | APAGAR PASTAS/ARQUIVOS
        for (let [index, value,] of filesDelOrNot.entries()) { retDelOrNot = await delOrNot(value); if (retDelOrNot) { pathsDel.push({ 'path': value.path, }); } }
        if (pathsDel.length > 0) { for (let [index, v,] of pathsDel.entries()) { await file({ e, 'action': 'del', 'path': v.path, }); } }
        logConsole({ e, ee, 'txt': `LOGS APAGADOS\n${JSON.stringify(pathsDel, null, 2)}`, });

        // LIMPAR PASTA 'Temp'
        await commandLine({ e, 'command': `${fileWindows}/BAT/clearTemp.bat NODE-WEBSOCKET-SERVER_-_LOGS_DEL_OLD`, });

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


