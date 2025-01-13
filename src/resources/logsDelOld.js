// let retLogsDelOld = await logsDelOld(); console.log(retLogsDelOld);

let e = import.meta.url, ee = e;
async function logsDelOld(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let retFile, pathsDel = [], filesDelOrNot = [], retDelOrNot;

        async function delOrNot(inf = {}) {
            let { daysKeep, path, edit, } = inf; if (!(path.includes('MES_') && path.includes('DIA_'))) { let dif = Math.round((new Date() - new Date(edit)) / (1000 * 60 * 60 * 24)); return dif > daysKeep; } else {
                let regexMon = path.match(/MES_(\d{2})/); let regexDay = path.match(/DIA_(\d{2})/); regexMon = regexMon[1]; regexDay = regexDay[1]; regexMon = parseInt(regexMon) - 1; regexDay = parseInt(regexDay);
                let today = new Date(); let targetDate = new Date(today.getFullYear(), regexMon, regexDay); let dif = Math.abs(Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))); return dif > daysKeep;
            }
        }

        let daysKeep = gW.devMaster === 'AWS' ? [60, 3,] : [60, 7,];

        let pathsToDel = [

            // [WINDOWS] BAT
            { 'daysKeep': 7, 'path': `${fileWindows}/BAT/z_log`, },

            // [PROJETOS] Chat_Python
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/Chat_Python/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/Chat_Python/log/Registros`, },
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/Chat_Python/log/Python`, },

            // [PROJETOS] Chrome_Extension
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/Chrome_Extension/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/Chrome_Extension/log/Registros`, },

            // [PROJETOS] Sniffer_Python
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/Sniffer_Python/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/Sniffer_Python/log/Registros`, },
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/Sniffer_Python/log/Python`, },

            // [PROJETOS] URA_Reversa
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/URA_Reversa/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/URA_Reversa/log/Registros`, },

            // [PROJETOS] WebScraper
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/WebScraper/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/WebScraper/log/Registros`, },

            // [PROJETOS] WebSocket
            { 'daysKeep': daysKeep[0], 'path': `${fileProjetos}/WebSocket/log/JavaScript`, },
            { 'daysKeep': daysKeep[1], 'path': `${fileProjetos}/WebSocket/log/Registros`, },

        ];

        // LISTAR PASTAS E ARQUIVOS
        for (let [index, value,] of pathsToDel.entries()) {
            retFile = await file({ e, 'action': 'list', 'path': value.path, 'max': 50, }); retFile = retFile.ret ? retFile.res : []; for (let [index1, value1,] of retFile.entries()) {
                if (!value1.isFolder) {
                    // CHECAR SE DEVE SER DELETADO [ARQUIVO]
                    filesDelOrNot.push({ 'daysKeep': value.daysKeep, 'path': value1.path, 'edit': value1.edit, });
                } else {
                    // CHECAR SE DEVE SER DELETADO [PASTA]
                    retFile = await file({ e, 'action': 'list', 'path': value1.path, 'max': 50, }); retFile = retFile.ret ? retFile.res : []; if (retFile.length === 0) { pathsDel.push({ 'path': value1.path, }); } else {
                        for (let [index2, value2,] of retFile.entries()) {
                            // DENTRO DA PASTA
                            filesDelOrNot.push({ 'daysKeep': value.daysKeep, 'path': value2.path, 'edit': value2.edit, });
                        }
                    }
                }
            }
        };

        // DEFINIR PASTAS/ARQUIVOS PARA SEREM EXCLUÍDOS
        for (let [index, value,] of filesDelOrNot.entries()) { retDelOrNot = await delOrNot(value); if (retDelOrNot) { pathsDel.push({ 'path': value.path, }); } };

        if (pathsDel.length > 0) {
            // APAGAR PASTAS/ARQUIVOS
            for (let [index, value,] of pathsDel.entries()) { await file({ e, 'action': 'del', 'path': value.path, }); };
            logConsole({ e, ee, 'write': true, 'msg': `LOGS APAGADOS\n${JSON.stringify(pathsDel, null, 2)}`, });
        }

        // LIMPAR PASTA 'Temp'
        await commandLine({ e, 'command': `${fileWindows}/BAT/clearTemp.bat LOGS_DEL_OLD`, });

        ret['res'] = pathsDel;
        ret['msg'] = `LOGS DEL OLD: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['logsDelOld'] = logsDelOld;