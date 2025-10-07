// let infPerformanceDev, retPerformanceDev;
// infPerformanceDev = { 'minCheck': 3, 'cpuMax': 70, 'ramMax': 80, 'ramClear': false, 'logsClear': false, };
// retPerformanceDev = await performanceDev(infPerformanceDev); console.log(retPerformanceDev?.res || retPerformanceDev);

let e = currentFile(new Error()), ee = e;
async function performanceDev(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { minCheck = 3, cpuMax = null, ramMax = null, ramClear = null, logsClear = true, } = inf;

        let devMaster = gW.devMaster; let metrics = ['CPU_Total', 'RAM_Total',]; let filePattern = 'LibreHardwareMonitorLog-';

        async function performancesLogs() {
            let logDir = `${fileWindows}/PORTABLE_System_Informer/z_OUTROS/PORTABLE_Libre_Hardware_Monitor`; let files = await _fs.promises.readdir(logDir);
            let csvLogs = files.filter(f => f.startsWith(filePattern) && f.endsWith('.csv')); let logPaths = []; let logPerformances = []; function formatDate(ts) {
                let d = new Date(ts); let dd = String(d.getDate()).padStart(2, '0'); let mm = String(d.getMonth() + 1).padStart(2, '0'); let hh = String(d.getHours()).padStart(2, '0');
                let mi = String(d.getMinutes()).padStart(2, '0'); let ss = String(d.getSeconds()).padStart(2, '0'); return `${dd}/${mm} ${hh}:${mi}:${ss}`;
            }
            if (csvLogs.length) {
                // ARQUIVOS DE LOGS: CAPTURAR | ORDENAR DE MAIS RECENTE PARA MAIS ANTIGO E CONVERTER PARA 'DD/MM HH:MM:SS'
                let logsWithStats = await Promise.all(csvLogs.map(async file => {
                    let fullPath = `${logDir}/${file}`; let stat = await _fs.promises.stat(fullPath); return { 'fileName': file.replace(filePattern, ''), fullPath, 'fileEdit': Math.floor(stat.mtimeMs), };
                })); logsWithStats.sort((a, b) => b.fileEdit - a.fileEdit); logPaths = logsWithStats.map(l => ({ 'fileEdit': l.fileEdit, 'fileName': l.fileName, }));

                // LOGS: CAPTURAR | ORDENAR DE MAIS RECENTE PARA MAIS ANTIGO E CONVERTER PARA 'DD/MM HH:MM:SS'
                for (let log of logsWithStats) {
                    let content = await _fs.promises.readFile(log.fullPath, 'utf-8'); let lines = content.trim().split('\n'); if (lines.length < 2) { continue; }
                    let fileTag = log.fileName.replace(filePattern, ''); let header = lines[1].split(',').map(s => s.replace(/^"|"$/g, ''));
                    let indexes = Object.fromEntries(metrics.map(name => [name, header.indexOf(name),]));
                    for (let i = 2; i < lines.length; i++) {
                        let row = lines[i].split(','); let ts = new Date(row[0]).getTime(); let record = { 'data': ts, 'file': fileTag, };
                        for (let metric of metrics) { record[metric] = indexes[metric] < 0 ? null : Math.floor(parseFloat(row[indexes[metric]])); } logPerformances.push(record);
                    }
                } logPerformances.sort((a, b) => b.data - a.data); logPaths = logPaths.map(lp => ({ ...lp, 'fileEdit': formatDate(lp.fileEdit), }));
                logPerformances = logPerformances.map(lp => ({ ...lp, 'data': formatDate(lp.data), }));
            }
            return { 'logPaths': logPaths.slice(0, 3), 'logPerformances': logPerformances.slice(0, minCheck), };
        }

        async function performancesProcess() {
            let { logPaths, logPerformances, } = await performancesLogs(); let hasLogs = logPerformances.length > 0; let recentLogs = hasLogs ? logPerformances.slice(0, minCheck) : [];
            let cpuHigh = recentLogs.length > 0 && recentLogs.every(r => r.CPU_Total > cpuMax); let ramHigh = recentLogs.length > 0 && recentLogs.every(r => r.RAM_Total > ramMax); let hasBeenOptimized = false;
            // APAGAR LOGS
            if (logsClear && logPerformances.length >= minCheck) {
                for (let log of logPaths) {
                    let fullPath = `${fileWindows}/PORTABLE_System_Informer/z_OUTROS/PORTABLE_Libre_Hardware_Monitor/${filePattern}${log.fileName}`;
                    try { await _fs.promises.unlink(fullPath); } catch { }
                }
            }
            // PROCESSAR DESEMPENHO
            if (hasLogs && (cpuHigh || ramHigh)) {
                let msg = `CPU: ${String(recentLogs[0].CPU_Total).padStart(2, '0')}% | RAM: ${String(recentLogs[0].RAM_Total).padStart(2, '0')}%`;
                if (ramClear && ramHigh) {
                    commandLine({ e, 'command': `${fileWindows}/BAT/EmptyStandbyList.exe workingsets`, }); msg += ' ✅ LIMPA'; hasBeenOptimized = true;
                }
                logConsole({ e, ee, 'txt': msg, });
            }
            return { hasBeenOptimized, logPaths, logPerformances, };
        }

        if (!(cpuMax !== null && ramMax !== null && ramClear !== null)) {
            if (devMaster === 'AWS') {
                cpuMax = 70; ramMax = 70; ramClear = true;
            } else if (devMaster === 'ESTRELAR') {
                cpuMax = 80; ramMax = 80; ramClear = true;
            } else if (devMaster === 'OPSEUA') {
                cpuMax = 999; ramMax = 80; ramClear = true;
            } else if (devMaster === 'ESTRELAR_MARCOS') {
                cpuMax = 80; ramMax = 80; ramClear = true;
            } else if (devMaster === 'ESTRELAR_THAYNA') {
                cpuMax = 80; ramMax = 80; ramClear = true;
            }
        }

        let retPerformancesProcess = await performancesProcess();

        ret['msg'] = `PERFORMANCE DEV: OK`;
        ret['ret'] = true;
        ret['res'] = retPerformancesProcess;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['performanceDev'] = performanceDev;


