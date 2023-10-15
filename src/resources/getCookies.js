// const infGetCookies = { 'url': 'https://www.google.com/', 'cookieSearch': '__Secure-next-auth.session-token' }
// const retGetCookies = await getCookies(infGetCookies);
// console.log(retGetCookies);

async function getCookies(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
            const infDevAndFun = { 'name': 'getCookies', 'retUrl': inf.retUrl, 'par': { 'url': inf.url, 'cookieSearch': inf.cookieSearch } }
            const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; const cookiesPromise = new Promise((resolve) => {
            chrome.cookies.getAll({ 'url': inf.url },
                cookies => { const retCookies = JSON.stringify(cookies); resolve(retCookies) })
        })
        const retCookies = await cookiesPromise; let cookie = ''; const cookieMap = JSON.parse(retCookies).reduce((accumulator, v) => {
            cookie += `${v.name}=${v.value}; `; return accumulator
        }, ''); if ((inf.cookieSearch) && !(retCookies.toString().includes(inf.cookieSearch))) {
            ret['msg'] = `\n #### ERRO #### GET COOKIES \n COOKIE '${inf.cookieSearch}' NAO CONTRADO \n\n`;
        } else { ret['res'] = { 'array': retCookies, 'concat': cookie }; ret['ret'] = true; ret['msg'] = 'GET COOKIES: OK' }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
};

if (typeof window !== 'undefined') { // CHROME
    window['getCookies'] = getCookies;
} else { // NODEJS
    global['getCookies'] = getCookies;
}