await import('./clearConsole.js');
const { default: express } = await import('express');
const { default: bodyParser } = await import('body-parser');
const { default: WebSocket } = await import('isomorphic-ws');

async function server(inf) {
    let ret = { 'ret': false };
    try {

        const port = 8888;
        const app = express();
        const server = app.listen(port, async () => {
            console.log(`RODANDO NA PORTA: ${port}`);
        });
        app.use(bodyParser.text());
        async function sendMessage(message, sender) {
            for (const client of wss.clients) {
                if (client !== sender) {
                    client.send(message);
                }
            }
        }
        app.get('/get/*', async (req, res) => {
            const message = req.params[0];
            sendMessage(message, null);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send('Requisição GET bem sucedida');
        });
        app.post('/post', async (req, res) => {
            const message = req.body;
            console.log(req.headers);
            sendMessage(message, null);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send('Requisição POST bem sucedida');
        });

        const wss = new WebSocket.Server({ server });
        wss.on('connection', async ws => {
            console.log('NOVO CLIENTE CONECTADO');
            ws.on('message', async data => {
                const message = data.toString();
                ws.send('Requisição WEBSOCKET bem sucedida');
                wss.clients.forEach(async client => {
                    if (client !== ws) {
                        client.send(message);
                    }
                });
            });
            ws.on('close', async () => {
                console.log('CLIENTE DESCONECTADO');
            });
            ws.onerror = async function () {
                console.log('ERRO');
            };
        });

    } catch (e) {
        ret['msg'] = `SERVER: ERRO | ${e}`
    }

    if (!ret.ret) { console.log(ret.msg) }
    return ret
}
server()





