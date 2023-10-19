// const infGetPage = { 'id': 182593371 };
// const retGetPage = await getPage(infGetPage);
// console.log(retGetPage)

async function getPage(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
            const infDevAndFun = { 'name': 'getPage', 'retUrl': inf.retUrl, 'par': { 'id': inf.id } }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; function getContent(inf) {
            return new Promise((resolve) => {
                chrome.pageCapture.saveAsMHTML({ 'tabId': inf.id }, function (data) {
                    if (data) {
                        const blob = new Blob([data], { type: 'application/x-mimearchive' }); const reader = new FileReader();
                        reader.onloadend = async function () { ret['res'] = reader.result; ret['ret'] = true; ret['msg'] = `GET PAGE: OK`; resolve(true) }; reader.readAsText(blob)
                    } else { ret['msg'] = `GET PAGE: 'data' é 'false'`; resolve(false) }
                });
            });
        }; await getContent(inf)
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['getPage'] = getPage;
} else { // NODEJS
    global['getPage'] = getPage;
}