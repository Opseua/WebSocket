await import('./resources/@export.js');
let e = import.meta.url;
async function server(inf) {
    let ret = { 'ret': false };
    e = inf && inf.e ? inf.e : e;
    try {
        let infConfigStorage = { 'e': e, 'action': 'get', 'key': 'webSocket' };
        let retConfigStorage = await configStorage(infConfigStorage); if (!retConfigStorage.ret) { return retConfigStorage } else { retConfigStorage = retConfigStorage.res }
        let chatGptAiChatos = retConfigStorage.chatGptAiChatos
        let clients = new Set();
        let rooms = {};

        setInterval(async () => {
            for (let value of clients) {
                let dif = value.pingLast ? Number(dateHour().res.tim) - value.pingLast : 0
                if (dif > (secPing + 5)) {
                    await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO [PING ${dif}] '${value.pingRoom}'` })
                    value.close()
                    // console.log('DIF', dif, 'ENCERRANDO', value.pingRoom);
                } else {
                    // console.log('DIF', dif, 'MANTENDO', value.pingRoom);
                }
            }
        }, (secPing * 1000));

        function getClients() {
            let res = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
            let dH = dateHour().res;
            res.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` });
            return JSON.stringify(res)
        };
        await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'SERVER: START [WebSocket]' })

        function sendRoom(room, message, sender) {
            let clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((client) => {
                    if (client !== sender) {
                        client.send(message)
                    } else {
                        if (message.includes(par2)) {
                            client.send(`WEBSOCKET: OK '${room}'`);
                        }
                    }
                })
            }
        }

        let server = _http.createServer(async (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') {
                res.end(`${req.method}: ERRO | INFORMAR A SALA`)
            } else {
                let room = urlParts[1];
                if (req.method == 'GET' || req.method == 'POST') {
                    let message = '';
                    if (req.method == 'GET') {
                        message = decodeURIComponent(urlParts.slice(2).join('/'))
                    } else {
                        await new Promise((resolve) => {
                            req.on('data', (chunk) => {
                                message += chunk.toString()
                            });
                            req.on('end', () => { resolve(message) })
                        })
                    }
                    if (room.toLowerCase() == par1 || message.toLowerCase() == par1) {
                        res.end(`${req.method}: OK | CLIENTS:\n\n${getClients()}`)
                    } else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                        res.end(`${req.method}: OK ### RESET ###`);
                        await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                        await log({ 'e': e, 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                    } else if (req.method == 'POST' && room.toLowerCase() == par4) {
                        try {
                            if (!message.length > 0) {
                                throw new Error()
                            } else {
                                message = JSON.parse(message);
                                if (!message.prompt) {
                                    res.end(`INFORMAR O 'prompt'`)
                                } else {
                                    let network = message.network ? true : false; let infApi = {
                                        'method': 'POST', 'url': chatGptAiChatos,
                                        'headers': {
                                            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 'accept': 'application/json, text/plain, */*',
                                            'content-type': 'application/json', 'dnt': '1', 'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"Windows"',
                                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                                            'origin': 'https://chat9.yqcloud.top', 'sec-fetch-site': 'cross-site', 'sec-fetch-mode': 'cors',
                                            'sec-fetch-dest': 'empty', 'referer': 'https://chat9.yqcloud.top/', 'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,it;q=0.6'
                                        }, 'body': { "prompt": message.prompt, "userId": "#/chat/1695782874949", "network": network, "system": "", "withoutContext": false, "stream": false }
                                    };
                                    let r = await api(infApi);
                                    res.end(JSON.stringify({ 'ret': r.res.code == 200 ? true : false, 'res': r.res.body }))
                                }
                            }
                        } catch (e) {
                            res.end(`BODY INVALIDO`)
                        }
                    } else if (req.method == 'POST' && room.toLowerCase() == par5) {
                        let infApi, retApi
                        infApi = { // ########## TYPE → json
                            'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'accept-language': 'application/json' },
                            'body': { 'Chave': 'aaa', 'Valor': 'bbb' }
                        };
                        infApi = { // ########## TYPE → text
                            'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'content-type': 'text/plain;charset=UTF-8' },
                            'body': '{"topic":"OPSEUA","message":"a"}'
                        };
                        let formData = new URLSearchParams(); // ########## TYPE → x-www-form-urlencoded
                        formData.append('grant_type', 'client_credentials');
                        formData.append('resource', 'https://graph.microsoft.com');
                        infApi = {
                            'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
                            'body': formData.toString()
                        };
                        retApi = await api(infApi);
                        res.end(`${req.method}: ERRO | NAO EXISTE '${room}'`)
                    } else if (!rooms[room]) {
                        res.end(`${req.method}: ERRO | NAO EXISTE '${room}'`)
                    } else if (message.length == 0) {
                        res.end(`${req.method}: ERRO | MENSAGEM VAZIA '${room}'`)
                    } else {
                        sendRoom(room, message, null);
                        res.end(`${req.method}: OK '${room}'`)
                    }
                } else {
                    res.end(`METODOS ACEITOS 'GET' OU 'POST'`)
                }
            }
        });

        let wss = new _WebSocketServer({ server });
        wss.on('connection', async (ws, req) => {
            ws.isAlive = true;
            ws.on('error', async (text) => {
                (console.error);
                await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': error })
            })
            let urlParts = req.url.split('/')
            if (urlParts.length < 3 && urlParts['1'] == '') {
                ws.send(`WEBSOCKET: ERRO | INFORMAR A SALA`);
                ws.terminate()
            } else {
                let room = urlParts[1];
                if (room.toLowerCase() == par1) {
                    ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`);
                    ws.terminate()
                } else if (room.toLowerCase() == par3) {
                    ws.send(`WEBSOCKET: OK ### RESET ###`);
                    await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                    await log({ 'e': e, 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                } else {
                    ws['pingRoom'] = room
                    clients.add(ws);
                    if (!rooms[room]) {
                        rooms[room] = new Set()
                    };
                    rooms[room].add(ws)
                };
                await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: NOVO CLIENTE '${room}'` });
                ws.on('message', async (text) => {
                    let message = text.toString('utf-8');
                    if (message.length == 0) {
                        ws.send(`WEBSOCKET:  ERRO | MENSAGEM VAZIA '${room}'`)
                    } else {
                        if (message.toLowerCase() == par1) {
                            ws.send(`WEBSOCKET: OK | CLIENTS:\n\n${getClients()}`)
                        } else if (message.toLowerCase() == par3) {
                            ws.send(`WEBSOCKET: OK ### RESET ###`);
                            await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                            await log({ 'e': e, 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                        } else if (message.toLowerCase() == par6) {
                            ws.send(par7);
                            ws['pingLast'] = Number(dateHour().res.tim)
                            // console.log('RECEBIDO ping:', ws.pingLast, ws.pingRoom)
                        } else {
                            sendRoom(room, message, ws)
                        }
                    }
                });
                ws.on('close', async () => {
                    await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO '${room}'` })
                    clients.delete(ws);
                    if (rooms[room]) {
                        rooms[room].delete(ws);
                        if (rooms[room].size == 0) {
                            delete rooms[room]
                        }
                    }
                });
            }
        });
        server.listen(port, async () => {
            let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [WebSocket] PORTA: ${port}`, '\n');
            await new Promise(resolve => { setTimeout(resolve, 2000) })

            // client
            await client({ 'e': e })

            // [URA_Reversa]
            if (letter == 'D') {
                // await import('../../URA_Reversa/src/server.js');
            }

            // [WebScraper]
            if (letter == 'D') {
                // await import('../../WebScraper/src/server.js');
            }

        });

        ret['ret'] = true
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}
await server()
