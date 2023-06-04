const clearConsole = await import('./clearConsole.js');

let WebSocket;
if (typeof window === 'undefined') { // NODEJS
    const imp = () => import('isomorphic-ws').then(module => module.default);
    WebSocket = await imp();
    client()
} else { // CHROME
    WebSocket = window.WebSocket;
}
// ############################################################################

async function client(inf) {

    const port = 8888;
    let ws1;
    async function web1() {
        ws1 = new WebSocket(`wss://ntfy.sh/OPSEUA/ws`);
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
        ws2 = new WebSocket(`ws://18.119.140.20:${port}`);
        ws2.addEventListener('open', async function (event) { // CONEXAO: ONLINE - WS2
            console.log(`BACKGROUND: CONEXAO ESTABELECIDA - WS2`)
            // setTimeout(function () {
            //   ws2.send('Chrome: mensagem de teste');
            // }, 3000);
        });
        ws2.addEventListener('message', async function (event) { // CONEXAO: NOVA MENSAGEM - WS2
            console.log('→ ' + event.data);
        });
        ws2.addEventListener('close', async function (event) { // CONEXAO: OFFLINE, TENTAR NOVAMENTE - WS2
            console.log(`BACKGROUND: RECONEXAO EM 10 SEGUNDOS - WS2`)
            setTimeout(web2, 10000);
        });
        ws2.addEventListener('error', async function (error) { // CONEXAO: ERRO - WS2
            console.error(`BACKGROUND: ERRO W2 | ${error.message}`);
        });
    }
    web2();

}

