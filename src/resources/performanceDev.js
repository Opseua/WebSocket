// let retPerformanceDev = await performanceDev(); console.log(retPerformanceDev);

let e = currentFile(new Error()), ee = e; let historico = [];
async function performanceDev(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { min = 3, } = inf; // 'min' → MÍNIMO DE VERIFICAÇÕES

        let devMaster = gW.devMaster;

        // EXTRAIR CONSUMO DO CSV
        async function extrair(d, g) {
            let arquivos = await _fs.promises.readdir(d), logs = arquivos.filter(f => f.startsWith('LibreHardwareMonitorLog-') && f.endsWith('.csv'));
            if (!logs.length) { return {}; }
            let logsComStats = await Promise.all(logs.map(async f => { let p = `${d}\\${f}`, stat = await _fs.promises.stat(p); return { f, p, t: stat.mtime, }; }));
            logsComStats.sort((a, b) => b.t - a.t); let arq = logsComStats[0];
            let conteudo = await _fs.promises.readFile(arq.p, 'utf-8'), lins = conteudo.trim().split('\n');
            if (lins.length < 3) { return {}; } let cab = lins[1].split(',').map(s => s.replace(/^"|"$/g, ''));
            let idx = Object.fromEntries(g.map(n => [n, cab.indexOf(n),])), res = { file: arq.f.replace('LibreHardwareMonitorLog-', '').replace('.csv', ''), };
            for (let n of g) { res[n] = idx[n] < 0 ? [] : lins.slice(2).map(l => Math.floor(parseFloat(l.split(',')[idx[n]]))); }
            for (let l of logsComStats) { await _fs.promises.unlink(l.p); } return res;
        }

        // PROCESSAR CONSUMO
        async function monitorar(inf = {}) {
            let { pLog, minCheck, alertThis, clearRam, ...nomesMaximos } = inf; let n = Object.keys(nomesMaximos), r = await extrair(pLog, n); if (r.file === undefined) { return; }
            let res = { file: r.file, ...Object.fromEntries(Object.entries(r).filter(([k,]) => k !== 'file').map(([k, v,]) => [k, v[v.length - 1],])), };
            historico.push(res); if (historico.length > minCheck) { historico.shift(); } let l = historico[historico.length - 1], cpuUsage = l.CPU_Total, ramUsage = l.RAM_Total;

            let msg = `CPU: ${String(cpuUsage).padStart(2, '0')}% | RAM: ${String(ramUsage).padStart(2, '0')}%`;

            if (historico.length === minCheck) {
                let cpuUsageHigh = historico.every(r => r.CPU_Total > nomesMaximos.CPU_Total);
                let ramUsageHigh = historico.every(r => r.RAM_Total > nomesMaximos.RAM_Total);

                if (cpuUsageHigh || ramUsageHigh) {
                    if (clearRam === 'SIM' && ramUsageHigh) {
                        // LIMPAR A RAM
                        commandLine({ e, 'command': `${fileWindows}/BAT/EmptyStandbyList.exe workingsets`, }); msg = `${msg} ✅ LIMPA`;
                    }
                    if (alertThis === 'SIM') {
                        // ALERTAR SOBRE O CONSUMO
                        notification({ e, 'title': `# ALERTA | (${devMaster}) [NODE]`, 'text': msg, 'ignoreErr': true, });
                    }
                }
            }

            logConsole({ e, ee, 'txt': msg, });
        }

        //             CPU | RAM | ALERTAR | CLEAR
        let alertDev = [999, 999, 'NAO', 'NAO',];

        if (devMaster === 'AWS') {
            alertDev = [70, 70, 'SIM', 'SIM',];
        } else if (devMaster === 'ESTRELAR') {
            alertDev = [80, 80, 'SIM', 'SIM',];
        } else if (devMaster === 'ESTRELAR_MARCOS') {
            alertDev = [80, 80, 'SIM', 'SIM',];
        } else if (devMaster === 'ESTRELAR_THAYNA') {
            alertDev = [80, 80, 'SIM', 'SIM',];
        } else if (devMaster === 'OPSEUA') {
            alertDev = [999, 80, 'NAO', 'SIM',];
        }

        await monitorar({
            'pLog': `${fileWindows}/PORTABLE_System_Informer/z_OUTROS/PORTABLE_Libre_Hardware_Monitor`,
            'minCheck': min, // MÍNIMO DE CHECAGENS
            'alertThis': alertDev[2], // ALERTAR SOBRE O CONSUMO
            'clearRam': alertDev[3], // LIMPAR A RAM
            'CPU_Total': alertDev[0], // MÁXIMO DE CONSUMO CPU
            'RAM_Total': alertDev[1], // MÁXIMO DE CONSUMO RAM
        });

        ret['msg'] = `PERFORMANCE DEV: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['performanceDev'] = performanceDev;


