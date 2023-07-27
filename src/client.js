await import('./clearConsole.js');
console.log('onStart');
await import('./resources/functions.js');

async function client(inf) {
    let ret = { 'ret': false };
    try {
        let WebS;
        const retNodeOrBrowser = await nodeOrBrowser();
        if (retNodeOrBrowser.res == 'node') { // NODEJS
            const { default: WebSocket } = await import('isomorphic-ws');
            WebS = WebSocket;
        } else if (retNodeOrBrowser.res == 'chrome') { // CHROME
            WebS = window.WebSocket;
        } else {
            return ret
        }

        const infConfigStorage = { 'path': '/src/config.json', 'action': 'get', 'key': 'websocket' }
        const retConfigStorage = await configStorage(infConfigStorage)
        if (!retConfigStorage.ret) {
            return ret
        }
        const port = retConfigStorage.res.port;

        let ws1;
        async function web1() {
            ws1 = new WebS(`${retConfigStorage.res.ws1}`);
            ws1.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS1
                console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS1`);
                // setTimeout(function () {
                //   ws1.send('Chrome: mensagem de teste');
                // }, 3000);
            });
            ws1.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS1
                const background = JSON.parse(event.data)
                if (background.event == 'message') {
                    console.log(`BACKGROUND: CONEXAO NOVA MENSAGEM - WS1`)
                }
            });
            ws1.addEventListener('close', async function (event) { // CONEXAO: OFFLINE TENTAR NOVAMENTE - WS1
                console.log(`BACKGROUND: RECONEXAO EM 30 SEGUNDOS - WS1`)
                setTimeout(web1, 30000);
            });
            ws1.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS1
                console.error(`BACKGROUND: ERRO W1 | ${error.message}`);
            });
        }
        web1();

        let ws2;
        async function web2() {
            ws2 = new WebS(`${retConfigStorage.res.ws2}:${port}`);
            ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
                console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
                // setTimeout(function () {
                //   ws2.send('Chrome: mensagem de teste');
                // }, 3000);
            });
            ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
                //console.log('→ ' + event.data);
                const infNotificar =
                {
                    duration: 1,
                    type: 'basic',
                    title: 'TITULO',
                    message: event.data,
                    iconUrl: undefined,
                    buttons: [],
                };
                notification(infNotificar)
            });
            ws2.addEventListener('close', async function (event) { // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS2
                console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS2`)
                setTimeout(web2, 10000);
            });
            ws2.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS2
                console.error(`BACKGROUND: ERRO W2`);
            });
        }
        //web2();

        ret['ret'] = true;
        ret['msg'] = `CLIENT: OK`;

    } catch (e) {
        ret['msg'] = `CLIENT: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
client()
