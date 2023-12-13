await import('./resources/@export.js');
let e = import.meta.url;
async function server(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        const errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
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

        async function serverFiles(res, req) {
            let formatarData = (data) => {
                let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, };
                return new Intl.DateTimeFormat('pt-BR', options).format(data);
            };

            let resultado, infFile, retFile
            let script = `<script> document.addEventListener('keydown', function(event) { if (event.key === 'Escape') {history.back();}});</script>`;
            if (req.url.startsWith('/listar-arquivos')) {
                let tableHtml = '', link = '', tipoEstilo = '';
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                try {
                    let url = decodeURIComponent(req.url).replace('!letter!', letter);
                    infFile = {
                        'e': e, 'action': 'list', 'functionLocal': false,
                        'path': url == '/listar-arquivos' ? `${letter}:/ARQUIVOS/PROJETOS` : `${url.replace('/listar-arquivos/', '')}`, 'max': 500,
                    };
                    retFile = await file(infFile);
                    tableHtml += '<table border="1"><tr>';
                    tableHtml += '<th style="width: 100px; text-align: center;">TAMANHO</th>';
                    tableHtml += '<th style="width: 200px; text-align: center;">MODIFICAÇÃO</th>';
                    tableHtml += '<th style="width: 100; text-align: center;">TIPO</th>';
                    tableHtml += '<th style="width: 1500; text-align: center;">PATH</th>';
                    tableHtml += '</tr>';
                    for (let item of retFile.res) {
                        if (item.isFolder) {
                            // link = `<a href="/listar-arquivos/${encodeURIComponent(item.path)}">${item.path}</a>`;
                            link = `<a href="/listar-arquivos/${item.path}">${item.path}</a>`;
                            tipoEstilo = 'background-color: #1bcf45; color: #ffffff;'; // Azul para pastas
                        } else {
                            // link = `<a href="/exibir-arquivo/${encodeURIComponent(item.path)}">${item.path}</a>`;
                            link = `<a href="/exibir-arquivo/${item.path}">${item.path}</a>`;
                            tipoEstilo = 'background-color: #db3434; color: #ffffff;'; // Verde para arquivos
                        }
                        let dataFormatada = item.edit ? formatarData(new Date(item.edit)) : '';
                        tableHtml += `<tr>`;
                        tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`;
                        tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
                        tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                        tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;[${item.name || ''}]&nbsp;</td>`;
                        tableHtml += `</tr>`;
                    }
                    tableHtml += '</table>';
                    res.end(tableHtml + script);
                } catch (error) {
                    res.end(`Erro ao listar arquivos: ${error.message}` + script);
                }
            } else if (req.url.startsWith('/exibir-arquivo')) {
                try {
                    let filePath = decodeURIComponent(req.url.replace('/exibir-arquivo/', ''));
                    if (filePath.includes('/src/') && (filePath.includes('.json'))) {
                        resultado = 'ARQUIVO PROTEGIDO!';
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(resultado + script);
                    } else {
                        infFile = { 'e': e, 'action': 'read', 'path': filePath }
                        retFile = await file(infFile);
                        resultado = retFile.res;
                        if (filePath.match(/\.(jpg|jpeg|png|ico)$/)) {
                            res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': resultado.length });
                            res.end(resultado);
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end(`<pre>${resultado}</pre>` + script);
                        }
                    }
                } catch (error) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`Erro ao exibir arquivo: ${error.message}` + script);;
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('Rota não encontrada' + script);
            }
        }

        let server = _http.createServer(async (req, res) => {
            let urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
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
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${req.method}: OK | CLIENTS:\n\n${getClients()}`)
                    } else if (room.toLowerCase() == par3 || message.toLowerCase() == par3) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${req.method}: OK ### RESET ###`);
                        await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET' })
                        await log({ 'e': e, 'folder': 'JavaScript', 'path': `reset.js`, 'text': ' ' })
                    } else if (req.method == 'POST' && room.toLowerCase() == par4) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`CHAT GPT`)
                    } else if (req.method == 'POST' && room.toLowerCase() == par5) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`API`)
                    } else if (room.toLowerCase().includes('listar-arquivos') || room.toLowerCase().includes('exibir-arquivo')) {
                        await serverFiles(res, req)
                    } else if (!rooms[room]) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${req.method}: ERRO | NAO EXISTE '${room}'`)
                    } else if (message.length == 0) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${req.method}: ERRO | MENSAGEM VAZIA '${room}'`)
                    } else {
                        sendRoom(room, message, null);
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(`${req.method}: OK '${room}'`)
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(`METODOS ACEITOS 'GET' OU 'POST'`)
                }
            }
        });

        let wss = new _WebSocketServer({ server });
        wss.on('connection', async (ws, req) => {
            ws.isAlive = true;
            ws.on('error', async (error) => {
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
            async function runFun1() {
                await import('./client.js');
            }
            runFun1()

            // // [URA_Reversa]
            // async function runFun2() {
            //     if (letter !== 'D') {
            //         await import('../../URA_Reversa/src/server.js');
            //     }
            // }
            // runFun2()
        });

        ret['ret'] = true
    } catch (e) {
        let retRegexE = await regexE({ 'inf': inf, 'e': e, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}
await server()


