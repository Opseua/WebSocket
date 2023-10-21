// const infConfigStorage = { 'action': 'get', 'key': 'webSocket' };
// let retConfigStorage = await configStorage(infConfigStorage)
// if (!retConfigStorage.ret) { return ret } else { retConfigStorage = retConfigStorage.res };
// let s = retConfigStorage.server['1'], url = s.url, host = s.host, port = s.port, dev = retConfigStorage.devices;
// let dev1 = `${url}://${host}:${port}/${dev[1].name}`

// gO.inf = { 'wsArr': [dev1,] };
// await wsConnect(gO.inf.wsArr);
// wsList(gO.inf.wsArr[0], async (m) => {
//     console.log('MENSAGEM RECEBIDA:', m)
// })
// await new Promise(resolve => { setTimeout(resolve, 2000) })
// wsSend(dev1, 'Essa mensagem está sendo enviada')

async function wsConnect(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false };
    try {
        async function logWs(inf) { // NODEJS
            if (typeof window == 'undefined') {
                await log({ 'folder': 'JavaScript', 'path': `log.txt`, 'text': inf })
            }
        }
        await logWs('ONSTART NODEJS: START'); const urls = inf; const listeners = {};
        const createWebSocket = (url) => {
            const ws = new _WebS(url); ws.onerror = (e) => { };
            ws.onopen = async () => {
                let msgLog = `WS OK:\n${url}`; console.log(msgLog); await logWs(msgLog);
            }
            ws.onmessage = (event) => {
                const listener = listeners[url]; if (listener && typeof listener === 'function') { listener(event.data) }
            }
            ws.onclose = async () => {
                let msgLog = `WS RECONEXAO EM 5 SEGUNDOS:\n${url}`;
                console.log(msgLog); await logWs(msgLog);
                await new Promise(resolve => setTimeout(resolve, (5000)));
                createWebSocket(url)
            }
            return ws;
        };
        const webSockets = urls.map(createWebSocket);
        const wsSend = (url, message) => {
            message = typeof message === 'object' ? JSON.stringify(message) : message
            const ws = webSockets.find(ws => ws.url === url);
            if (ws) {
                ws.send(message)
            } else {
                const ws = new _WebS(url);
                ws.onopen = async () => { ws.send(message); ws.close() }
            }
        };
        const wsList = (url, listener) => { listeners[url] = listener };
        if (typeof window !== 'undefined') { // CHROME
            window['wsSend'] = wsSend; window['wsList'] = wsList;
        } else { // NODEJS
            global['wsSend'] = wsSend; global['wsList'] = wsList;
        }

        ret['ret'] = true;
        ret['res'] = `WSCONNECT: OK`;
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['wsConnect'] = wsConnect;
} else { // NODEJS
    global['wsConnect'] = wsConnect;
}



