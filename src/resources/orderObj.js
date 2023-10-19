// const infOrderObj = { 'd': 'VALOR 4', 'c': 'VALOR 3', 'b': 'VALOR 2', 'a': 'VALOR 1' }
// const retOrderObj = orderObj(infOrderObj)
// console.log(retOrderObj)

function orderObj(inf) {
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        ret['res'] = Object.fromEntries(Object.entries(inf).sort((a, b) => a[0].localeCompare(b[0])))
        ret['ret'] = true;
        ret['msg'] = `ORDEROBJ: OK`;
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['orderObj'] = orderObj;
} else { // NODEJS
    global['orderObj'] = orderObj;
}