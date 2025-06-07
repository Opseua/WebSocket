// let retPerformanceDev = await performanceDev(); console.log(retPerformanceDev);

let e = currentFile(), ee = e; let historico = [];
async function performanceDev(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { min = 3, } = inf; // 'min' → MÍNIMO DE VERIFICAÇÕES

        // EXTRAIR CONSUMO DO CSV
        async function extrair(d, g) {
            let arquivos = await _fs.promises.readdir(d); let logs = arquivos.filter(f => f.startsWith('LibreHardwareMonitorLog-') && f.endsWith('.csv'));
            if (!logs.length) { return {}; }
            let logsComStats = await Promise.all(logs.map(async f => { let p = `${d}\\${f}`; let stat = await _fs.promises.stat(p); return { f, p, t: stat.mtime, }; }));
            logsComStats.sort((a, b) => b.t - a.t); let arq = logsComStats[0];
            let conteudo = await _fs.promises.readFile(arq.p, 'utf-8'); let lins = conteudo.trim().split('\n');
            if (lins.length < 3) { return {}; } let cab = lins[1].split(',').map(s => s.replace(/^"|"$/g, ''));
            let idx = Object.fromEntries(g.map(n => [n, cab.indexOf(n),])); let res = { file: arq.f.replace('LibreHardwareMonitorLog-', '').replace('.csv', ''), };
            for (let n of g) { res[n] = idx[n] < 0 ? [] : lins.slice(2).map(l => Math.floor(parseFloat(l.split(',')[idx[n]]))); }
            for (let l of logsComStats) { await _fs.promises.unlink(l.p); } return res;
        }

        // PROCESSAR CONSUMO
        async function monitorar(inf = {}) {
            let { pLog, minCheck, alertThis, clearRam, ...nomesMaximos } = inf; let n = Object.keys(nomesMaximos); let r = await extrair(pLog, n); if (r.file === undefined) { return; }
            let res = { file: r.file, ...Object.fromEntries(Object.entries(r).filter(([k,]) => k !== 'file').map(([k, v,]) => [k, v[v.length - 1],])), };
            historico.push(res); if (historico.length > minCheck) { historico.shift(); } let l = historico[historico.length - 1];

            let msg = `CPU: ${String(l.CPU_Total).padStart(2, '0')}% | RAM: ${String(l.RAM_Total).padStart(2, '0')}%`;

            if (historico.length === minCheck) {
                let acima = historico.every(r => n.some(n => r[n] > nomesMaximos[n]));
                if (acima) {
                    if (clearRam === 'SIM') {
                        // LIMPAR A RAM
                        commandLine({ e, 'command': `${fileWindows}/BAT/EmptyStandbyList.exe workingsets`, }); msg = `${msg} ✅ LIMPA`;
                    }
                    if (alertThis === 'SIM') {
                        // ALERTAR SOBRE O CONSUMO
                        notification({ e, 'title': `# ALERTA | (${gW.devMaster}) [NODE]`, 'text': msg, 'ignoreErr': true, });
                    }
                }
            }

            logConsole({ e, ee, 'txt': msg, });
        }

        //             CPU | RAM | ALERTAR | CLEAR
        let alertDev = [999, 999, 'NAO', 'NAO',];

        if (gW.devMaster === 'AWS') {
            alertDev = [70, 70, 'SIM', 'SIM',];
        } else if (gW.devMaster === 'ESTRELAR') {
            alertDev = [80, 80, 'SIM', 'SIM',];
        } else if (gW.devMaster === 'OPSEUA') {
            alertDev = [999, 85, 'NAO', 'SIM',];
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

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['performanceDev'] = performanceDev;


