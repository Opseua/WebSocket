// *************** EXPORTAR GLOBALMENTE PRIMEIRO NO '@functions' ***************
// const infGlobal = { 'var1': 'LUA', 'var2': 'SOL' }

// window['infGlobal'] = infGlobal;
// global['infGlobal'] = infGlobal;
// *****************************************************************************

// infGlobal['var1'] = 'LUA'; infGlobal['var2'] = 'SOL';
// const json = `{ "nasa": "Tanto a $[var1] quanto o $[var2] são redondos" }`;
// const infJsonInterpret = { 'json': json, 'vars': infGlobal };
// const retJsonInterpret = await jsonInterpret(infJsonInterpret)
// console.log(retJsonInterpret)

async function jsonInterpret(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const json = JSON.stringify(inf.json); const res = json.replace(/\$\[(.*?)\]/g, (match, p1) => infGlobal[p1])
        ret['ret'] = true; ret['msg'] = `JSON INTERPRET: OK`; ret['res'] = res;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['jsonInterpret'] = jsonInterpret;
} else { // NODEJS
    global['jsonInterpret'] = jsonInterpret;
}