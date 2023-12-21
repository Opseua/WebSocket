await import('./resources/@export.js');
let e = import.meta.url;
async function server(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } }
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let clients = new Set();
        let rooms = {};

        // PING
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

        // LISTAR CLIENTES CONECTADOS
        function getClients() {
            let res = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
            let dH = dateHour().res;
            res.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` });
            return JSON.stringify(res)
        };
        await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'SERVER: START [WebSocket]' })

        // ENVIAR MENSAGEM PARA SALA
        function sendRoom(room, message, sender) {
            let clientsInRoom = rooms[room];
            if (clientsInRoom) {
                clientsInRoom.forEach((client) => {
                    if (client !== sender) {
                        client.send(typeof message === 'object' ? JSON.stringify(message) : message)
                    } else {
                        if (message.includes(par2)) {
                            client.send(`WEBSOCKET: OK '${room}'`);
                        }
                    }
                })
            }
        }

        // ARQUIVOS WEB
        let lisTime = { 'lists': {}, 'tims': {}, 'ids': [] }
        function lisAdd(eve, cal) { if (!lisTime.lists[eve]) { lisTime.lists[eve] = []; }; lisTime.lists[eve].push(cal); }
        function lisDel(eve, cal) { if (lisTime.lists[eve]) { lisTime.lists[eve] = lisTime.lists[eve].filter(cb => cb !== cal); } }
        function lisRun(eve, param) { if (lisTime.lists[eve]) { lisTime.lists[eve].forEach(cal => cal(param)); } }
        async function serverFiles(inf) {
            let formatarData = (data) => {
                let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, };
                return new Intl.DateTimeFormat('pt-BR', options).format(data);
            };

            let res = inf.res
            let params = inf.params.split('/')
            let room = params[0]
            let path = decodeURIComponent(inf.params.replace(`${room}/`, '')).replace('!letter!', letter);
            let id = `TIMEOUT_ID_${new Date().getTime()}`
            let message = {
                'fun': [{
                    'securityPass': securityPass, 'retInf': id,
                    'name': 'file', 'par': { 'action': 'isFolder', 'max': 10, 'functionLocal': false, 'path': path, 'listRead': true }
                }]
            }
            lisTime.ids.push(id);

            let timeClear = async (param) => {
                clearTimeout(lisTime.tims[id]);
                await lisRet({ 'id': id, 'res': param })
            };
            lisTime.tims[id] = setTimeout(async () => {
                await lisRet({ 'id': id, })
            }, 10000);
            lisAdd(`timeClear_${id}`, timeClear);

            // ENVIAR COMANDO PARA LISTAR ARQUIVOS
            sendRoom(room, message, null);

            async function lisRet(inf) {
                lisDel(`timeClear_${inf.id}`, timeClear);
                let resOk = !inf.res ? false : JSON.parse(inf.res)

                let resultado, infFile, retFile
                let script = `<script> document.addEventListener('keydown', function(event) { if (event.key === 'Escape') {history.back();}});</script>`;
                if (!resOk || resOk && !resOk?.retWs.ret) {
                    console.log('EXPIROU')
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`${resOk?.retWs.msg ? resOk.retWs.msg : `Erro ao listar/ler: '${path}'`}` + script);;
                } else {
                    retFile = resOk.retWs.res
                    if (retFile instanceof Array) {
                        let tableHtml = '', link = '', tipoEstilo = '';
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        try {
                            let qtdFolder = 0, qtdFile = 0
                            for (let item of retFile) {
                                if (item.isFolder) {
                                    qtdFolder++
                                } else {
                                    qtdFile++
                                }
                            }
                            tableHtml += '<table border="1"><tr>';
                            tableHtml += `<th style="width: 100px; text-align: center;">TAMANHO</th>`;
                            tableHtml += `<th style="width: 200px; text-align: center;">MODIFICAÇÃO</th>`;
                            tableHtml += `<th style="width: 100; text-align: center;">TIPO</th>`;
                            tableHtml += `<th style="width: 1500; text-align: center;">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`;
                            tableHtml += '</tr>';
                            for (let item of retFile) {
                                link = `<a href="/${par8}/${room}/${item.path}">${item.path.replace(`/${item.name}`, '')}</a>`;
                                tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'
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
                    } else {
                        try {
                            if (path.includes('/src/') && (path.includes('.json'))) {
                                resultado = 'ARQUIVO PROTEGIDO!';
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(resultado + script);
                            } else {
                                resultado = retFile;
                                if (path.match(/\.(jpg|jpeg|png|ico)$/)) {
                                    let imagemBase64 = Buffer.from({ type: 'Buffer', data: resultado.data }).toString('base64');
                                    let paginaHTML = `
                                        <!DOCTYPE html>
                                        <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>Exibir Imagem</title>
                                        </head>
                                        <body>
                                            <img src="data:image/png;base64,${imagemBase64}" alt="Imagem">
                                        </body>
                                        ${script}
                                        </html>
                                    `;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(paginaHTML);
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.end(`<pre>${resultado}</pre>` + script);
                                }
                            }
                        } catch (error) {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end(`Erro ao exibir arquivo: ${error.message}` + script);;
                        }
                    }
                }
            }

            return








            // if (req.url.startsWith(`/${par8}`)) {
            //     let tableHtml = '', link = '', tipoEstilo = '';
            //     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //     try {
            //         let url = decodeURIComponent(req.url).replace('!letter!', letter);
            //         infFile = {
            //             'e': e, 'action': 'list', 'functionLocal': false,
            //             'path': url == `/${par8}` ? `${letter}:/ARQUIVOS/PROJETOS` : `${url.replace(`/${par8}/`, '')}`, 'max': 500,
            //         };
            //         retFile = await file(infFile);
            //         retFile = retFile.res
            //         let qtdFolder = 0, qtdFile = 0
            //         for (let item of retFile) {
            //             if (item.isFolder) {
            //                 qtdFolder++
            //             } else {
            //                 qtdFile++
            //             }
            //         }
            //         tableHtml += '<table border="1"><tr>';
            //         tableHtml += `<th style="width: 100px; text-align: center;">TAMANHO</th>`;
            //         tableHtml += `<th style="width: 200px; text-align: center;">MODIFICAÇÃO</th>`;
            //         tableHtml += `<th style="width: 100; text-align: center;">TIPO</th>`;
            //         tableHtml += `<th style="width: 1500; text-align: center;">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`;
            //         tableHtml += '</tr>';
            //         for (let item of retFile) {
            //             if (item.isFolder) {
            //                 // link = `<a href="/${par8}/${encodeURIComponent(item.path)}">${item.path}</a>`;
            //                 link = `<a href="/${par8}/${item.path}">${item.path.replace(`/${item.name}`, '')}</a>`;
            //                 tipoEstilo = 'background-color: #1bcf45; color: #ffffff;'; // Azul para pastas
            //             } else {
            //                 // link = `<a href="/${par9}/${encodeURIComponent(item.path)}">${item.path}</a>`;
            //                 link = `<a href="/${par9}/${item.path}">${item.path.replace(`/${item.name}`, '')}</a>`;
            //                 tipoEstilo = 'background-color: #db3434; color: #ffffff;'; // Verde para arquivos
            //             }
            //             let dataFormatada = item.edit ? formatarData(new Date(item.edit)) : '';
            //             tableHtml += `<tr>`;
            //             tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`;
            //             tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
            //             tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
            //             tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;[${item.name || ''}]&nbsp;</td>`;
            //             tableHtml += `</tr>`;
            //         }
            //         tableHtml += '</table>';
            //         res.end(tableHtml + script);
            //     } catch (error) {
            //         res.end(`Erro ao listar arquivos: ${error.message}` + script);
            //     }
            // } else if (req.url.startsWith(`/${par9}`)) {
            //     try {
            //         let filePath = decodeURIComponent(req.url.replace(`/${par9}/`, ''));
            //         if (filePath.includes('/src/') && (filePath.includes('.json'))) {
            //             resultado = 'ARQUIVO PROTEGIDO!';
            //             res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //             res.end(resultado + script);
            //         } else {
            //             infFile = { 'e': e, 'action': 'read', 'path': filePath }
            //             retFile = await file(infFile);
            //             resultado = retFile.res;
            //             if (filePath.match(/\.(jpg|jpeg|png|ico)$/)) {
            //                 res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': resultado.length });
            //                 res.end(resultado);
            //             } else {
            //                 res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //                 res.end(`<pre>${resultado}</pre>` + script);
            //             }
            //         }
            //     } catch (error) {
            //         res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //         res.end(`Erro ao exibir arquivo: ${error.message}` + script);;
            //     }
            // } else {
            //     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //     res.end('Rota não encontrada' + script);
            // }
        }

        let server = _http.createServer(async (req, res) => {
            let urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`${req.method}: ERRO | INFORMAR A SALA`)
            } else {
                let room = urlParts[1];
                let params = req.url.replace(`/${room}/`, '')
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
                    } else if (room.toLowerCase().includes(`${par8}`) || room.toLowerCase().includes(`${par9}`)) {
                        let infServerFiles = { 'res': res, 'req': req, 'params': params }
                        await serverFiles(infServerFiles)
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
                            if (!message.includes('TIMEOUT_ID_')) {
                                sendRoom(room, message, ws)
                            } else {
                                // ARQUIVOS WEB
                                for (let [index, value] of lisTime.ids.entries()) {
                                    if (message.includes(value)) {
                                        lisRun(`timeClear_${value}`, message);
                                    }
                                }
                            }
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

            // CLIENT
            async function runFun1() {
                await import('./client.js');
            }
            runFun1()
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


