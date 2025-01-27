// let retPerformanceDev = await performanceDev(); console.log(retPerformanceDev);

let e = import.meta.url, ee = e;
async function performanceDev(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let logFile = '!fileWindows!/PORTABLE_System_Informer/z_OUTROS/PORTABLE_HWiNFO/HWiNFO_AlertLog.txt';
        let alertDev = gW.devMaster === 'AWS' ? [70, 95,] : gW.devMaster === 'ESTRELAR' ? [70, 85,] : [999, 999,];

        let retFile = await file({ e, 'action': 'read', 'path': `${logFile}`, });
        if (!retFile.ret) { return retFile; }; retFile = retFile.res;

        retFile = retFile.split('\n').reverse().filter((l, i, a) => l && !a.slice(0, i).some(x => x.includes(l.includes('CPU') ? 'CPU' : 'RAM')));
        retFile = { 'cpu': parseInt(retFile.find(l => l.includes('CPU')).split(',')[3]), 'ram': parseInt(retFile.find(l => l.includes('RAM')).split(',')[3]), };

        let msg = `CPU: ${retFile.cpu}% | RAM: ${retFile.ram}%`;
        logConsole({ e, ee, 'write': true, 'msg': msg, });
        await file({ e, 'action': 'del', 'path': `${logFile}`, });

        if (retFile.cpu > alertDev[0] || retFile.ram > alertDev[1]) {
            await notification({ e, 'ntfy': true, 'title': `# ALERTA | (${gW.devMaster}) [NODEJS]`, 'text': msg, 'ignoreErr': true, });
        };

        ret['res'] = retFile;
        ret['msg'] = `PERFORMANCE: OK`;
        ret['ret'] = true;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['performanceDev'] = performanceDev;


