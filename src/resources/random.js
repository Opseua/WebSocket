// const infRandom = { 'min': 3, 'max': 10, 'await': true };
// const retRandom = await random(infRandom);
// console.log(retRandom)

async function random(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const min = inf.min; const max = inf.max; const message = inf.await ? true : false
        const number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
        if (message) { console.log(`AGUARDANDO: ${number / 1000} SEGUNDOS`); await new Promise(resolve => setTimeout(resolve, number)); }
        ret['ret'] = true; ret['msg'] = `RANDON: OK`; ret['res'] = number / 1000;
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['random'] = random;
} else { // NODEJS
    global['random'] = random;
}