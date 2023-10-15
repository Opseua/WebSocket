// const objeto = { 'chave1': { 'chave2': { 'chave3': 'VALOR' } } };
// const infHasKey = { 'key': 'chave3', 'obj': objeto };
// const retHaskey = hasKey(infHasKey);
// console.log(retHaskey)

function hasKey(inf) { // NAO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        function hk(key, obj) {
            if (obj.hasOwnProperty(key)) { return true }; for (let prop in obj) {
                if (typeof obj[prop] === 'object' && obj[prop] !== null) { if (hk(key, obj[prop])) { return true } }
            }; return false
        }; ret['msg'] = `HAS KEY: OK`; ret['res'] = hk(inf.key, typeof inf.obj === 'object' ? inf.obj : JSON.parse(inf.obj)); ret['ret'] = true
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['hasKey'] = hasKey;
} else { // NODEJS
    global['hasKey'] = hasKey;
}
