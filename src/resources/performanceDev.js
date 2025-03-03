// let retPerformanceDev = await performanceDev(); console.log(retPerformanceDev);

let e = import.meta.url, ee = e; let oldCpu = 0; let oldRam = 0;
async function performanceDev(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let logFile = '!fileWindows!/PORTABLE_System_Informer/z_OUTROS/PORTABLE_HWiNFO/HWiNFO_AlertLog.txt';

        //                                      CPU | RAM                                 CPU | RAM    CPU | RAM
        let alertDev = gW.devMaster === 'AWS' ? [70, 95,] : gW.devMaster === 'ESTRELAR' ? [70, 85,] : [999, 999,];

        let retFile = await file({ e, 'action': 'read', 'path': `${logFile}`, });
        if (!retFile.ret || (retFile.res && (!retFile.res.includes('CPU') || !retFile.res.includes('RAM')))) { return retFile; } retFile = retFile.res;

        retFile = retFile.split('\n').reverse().filter((l, i, a) => l && !a.slice(0, i).some(x => x.includes(l.includes('CPU') ? 'CPU' : 'RAM')));
        retFile = { 'cpu': parseInt(retFile.find(l => l.includes('CPU')).split(',')[3]), 'ram': parseInt(retFile.find(l => l.includes('RAM')).split(',')[3]), };

        let cpu = retFile.cpu; let ram = retFile.ram;

        let msg = `CPU: ${cpu}% | RAM: ${ram}%`;
        logConsole({ e, ee, msg, });
        await file({ e, 'action': 'del', 'path': `${logFile}`, });

        if ((cpu > alertDev[0] && oldCpu > alertDev[0]) || (ram > alertDev[1] && oldRam > alertDev[1])) {
            await notification({ e, 'title': `# ALERTA | (${gW.devMaster}) [NODEJS]`, 'text': msg, 'ignoreErr': true, });
        }

        ret['res'] = { cpu, oldCpu, ram, oldRam, };
        ret['msg'] = `PERFORMANCE: OK`;
        ret['ret'] = true;

        // MANTER NO FIM
        oldCpu = cpu; oldRam = ram;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}

// CHROME | NODEJS
globalThis['performanceDev'] = performanceDev;


