// const infChromeActions = { 'action': 'badge', 'text': 'OLA' }
// const retChromeActions = await chromeActions(infChromeActions);
// console.log(retChromeActions)

async function chromeActions(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
            const infDevAndFun = {
                'name': 'chromeActions', 'retUrl': inf.retUrl,
                'par': { 'action': inf.action, 'color': inf.color, 'text': inf.text, 'tabSearch': inf.tabSearch, 'url': inf.url, 'code': inf.code }
            }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; if (inf.action == 'badge') {
            const action = chrome.browserAction; if (inf.color) { action.setBadgeBackgroundColor({ 'color': inf.color }) } // [25, 255, 71, 255]
            if (inf.hasOwnProperty('text')) { action.setBadgeText({ 'text': inf.text }) }; ret['msg'] = `CHROME ACTIONS BADGE: OK`
        } else if (inf.action == 'script') {
            const infTabSearch = { 'search': inf.tabSearch ? inf.tabSearch : 'ATIVA', 'openIfNotExist': true, 'active': true, 'pinned': false, 'url': inf.url }
            const retTabSearch = await tabSearch(infTabSearch); chrome.tabs.executeScript(retTabSearch.res.id, {
                // XPATH
                // code: `document.evaluate('//*[@id="app-root"]/div/div[4]/div[2]/div/p/a/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()`
                code: inf.code
            }); ret['msg'] = `CHROME ACTIONS SCRIPT: OK`
        }; ret['ret'] = true;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['chromeActions'] = chromeActions;
} else { // NODEJS
    global['chromeActions'] = chromeActions;
}