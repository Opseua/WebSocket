// const infSniffer = { 'newReqSend': false, 'arrUrl': ['*google*'] }
// const retSniffer = await sniffer(infSniffer);
// console.log(retSniffer)

async function sniffer(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false, 'res': { 'req': {}, 'res': {} } };
    if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
        const infDevAndFun = { 'name': 'sniffer', 'retUrl': inf.retUrl, 'par': { 'newReqSend': inf.newReqSend, 'arrUrl': inf.arrUrl } }
        const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
    }; return new Promise(resolve => {
        let lisOnBeforeRequest, lisOnBeforeSendHeaders, lisOnCompleted; function snifferOff(inf) {
            if (inf) { console.log('sniffer parou'); resolve({ 'ret': false }) } else { console.log('sniffer off'); resolve(ret) }
            chrome.webRequest.onBeforeRequest.removeListener(lisOnBeforeRequest); chrome.webRequest.onBeforeSendHeaders.removeListener(lisOnBeforeSendHeaders);
            chrome.webRequest.onCompleted.removeListener(lisOnCompleted);
        }; try {
            gO.inf = { 'sniffer': 1 }; const gOEve = async (i) => { if (i.inf.sniffer === 2) { gO.inf = { 'sniffer': 0 }; gORem(gOEve); snifferOff(true) } };
            gOAdd(gOEve); const filters = { urls: ["<all_urls>"] };
            lisOnBeforeRequest = function (infLis) { intercept(infLis, 'onBeforeRequest'); }; lisOnBeforeSendHeaders = function (infLis) { intercept(infLis, 'onBeforeSendHeaders') }
            lisOnCompleted = function (infLis) { intercept(infLis, 'onCompleted'); }; chrome.webRequest.onBeforeRequest.addListener(lisOnBeforeRequest, filters, ['requestBody'])
            chrome.webRequest.onBeforeSendHeaders.addListener(lisOnBeforeSendHeaders, filters, ['requestHeaders']);
            chrome.webRequest.onCompleted.addListener(lisOnCompleted, filters, ['responseHeaders']); let sendPri, newResBlock = false, newReqSend = inf.newReqSend ? true : false
            chrome.browserAction.setBadgeBackgroundColor({ color: [25, 255, 71, 255] }); if (newReqSend) {
                chrome.browserAction.setBadgeText({ text: 'SIM' })
            } else { chrome.browserAction.setBadgeText({ text: 'NAO' }) }
            if (inf && inf.arrUrl) { sendPri = { 'arrUrl': inf.arrUrl } } else { sendPri = { 'arrUrl': ['https://ntfy.sh/'] } }; async function intercept(infOk, eventType) {
                if (!!sendPri.arrUrl.find(infRegex => regex({ 'simple': true, 'pattern': infRegex, 'text': infOk.url }))) {
                    if (eventType == 'onBeforeRequest') {
                        if (infOk.requestBody && infOk.requestBody.raw && infOk.requestBody.raw[0].hasOwnProperty('bytes')) {
                            ret.res.req['requestBodyType'] = 'binary';
                            ret.res.req['requestBody'] = new TextDecoder("utf-8").decode(new Uint8Array(infOk.requestBody.raw[0].bytes));
                        } else if (infOk.requestBody && infOk.requestBody.formData && infOk.requestBody.hasOwnProperty('formData')) {
                            ret.res.req['requestBodyType'] = 'formData'; ret.res.req['requestBody'] = infOk.requestBody.formData;
                        }; ret.res.req['type'] = infOk.type; // 'main_frame' (requisicao inicial 'doc')
                    }; if (eventType == 'onBeforeSendHeaders') {
                        if (JSON.stringify(infOk.requestHeaders).includes('naoInterceptar')) { newResBlock = true; console.log('BLOCK') }
                        else {
                            newResBlock = false; ret.res.req['method'] = infOk.method; ret.res.req['url'] = infOk.url; ret.res.req['tabId'] = infOk.tabId;
                            ret.res.req['requestHeaders'] = infOk.requestHeaders;
                        }
                    }; if (eventType == 'onCompleted' && ret.res.req.url && !newResBlock) {
                        if ((infOk.statusCode !== 200)) { console.log('DEU ERRO', 'CODE:', infOk.statusCode, infOk.url) }; ret.res.req['code'] = infOk.statusCode;
                        ret['ret'] = true; if (newReqSend) {
                            newReqSend = false; console.log('REENVIAR REQUISICAO'); const hea = {};
                            for (let header of ret.res.req.requestHeaders) { hea[header.name] = header.value; }; hea['naoInterceptar'] = 'naoInterceptar';
                            const infApi = { 'url': ret.res.req.url, 'method': ret.res.req.method, 'headers': hea };
                            if (typeof ret.res.res.requestBody !== 'undefined') { infApi['body'] = ret.res.req.requestBody }
                            const retApi = await api(infApi); ret.res.res['method'] = ret.res.req.method; ret.res.res['code'] = retApi.res.code;
                            ret.res.res['url'] = ret.res.req.url; ret.res.res['headers'] = retApi.res.headers; ret.res.res['body'] = retApi.res.body;
                        }; snifferOff()
                    }
                }
            }
        } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
        if (!ret.ret) { console.log(ret.msg) }; return ret
    });
}

if (typeof window !== 'undefined') { // CHROME
    window['sniffer'] = sniffer;
} else { // NODEJS
    global['sniffer'] = sniffer;
}