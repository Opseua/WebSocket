// const infTranslate = { 'source': 'auto', 'target': 'pt', 'text': `Hi, what your name?` };
// const retTranslate = await translate(infTranslate);
// console.log(retTranslate)

async function translate(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        const infApi = { method: 'GET', url: `https://translate.google.com/m?sl=${inf.source}&tl=${inf.target}&q=${encodeURIComponent(inf.text)}&hl=pt-BR`, headers: {} };
        const retApi = await api(infApi); if (!retApi.ret) { return ret }; const res = retApi.res.body;
        const retRegex = regex({ 'pattern': 'class="result-container">(.*?)</div>', 'text': res }); if (!retRegex.ret) { return ret }; let d, $
        if (typeof window !== 'undefined') { d = new DOMParser().parseFromString(retRegex.res['3'], "text/html").documentElement.textContent } // CHROME
        else { $ = _cheerio.load(retRegex.res['3']); d = _cheerio.load($('body').html())('body').text() } ret['res'] = d; ret['ret'] = true; ret['msg'] = `TRANSLATE: OK` // NODEJS
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['translate'] = translate;
} else { // NODEJS
    global['translate'] = translate;
}