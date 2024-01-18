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
        await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': 'SERVER: START [WebSocket]' })

        // PING
        setInterval(async () => {
            for (let value of clients) {
                let dif = value.pingLast ? Number(dateHour().res.tim) - value.pingLast : 0
                if (dif > (secPing + 5)) {
                    await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: CLIENTE DESCONECTADO [PING ${dif}] '${value.pingRoom}'` })
                    value.close()
                }
            }
        }, (secPing * 1000));

        // LOOP A CADA 1 MINUTO EM TODOS OS CLIENTES 'NODEJS' (SOMENTE NO EC2)
        if (devMaster == 'EC2') {
            setInterval(() => {
                loop({ 'rooms': rooms, 'sender': null })
            }, secScreenShot * 1000);
        }

        // BODY HTML
        let bodyHtml = `
        <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"><title>WebSocket</title> </head> <body> ####REPLACE####
        <script> document.addEventListener('keydown', function(event) { if (event.key === 'Escape') {history.back();}});</script> </body></html>`;
        // ARQUIVOS WEB
        let lisTime = { 'lists': {}, 'tims': {}, 'ids': [] }
        function lisAdd(eve, cal) { if (!lisTime.lists[eve]) { lisTime.lists[eve] = []; }; lisTime.lists[eve].push(cal); }
        function lisDel(eve, cal) { if (lisTime.lists[eve]) { lisTime.lists[eve] = lisTime.lists[eve].filter(cb => cb !== cal); } }
        function lisRun(eve, param) { if (lisTime.lists[eve]) { lisTime.lists[eve].forEach(cal => cal(param)); } }
        async function serverFiles(inf) {
            function setData(inf) {
                let day = inf.substring(8, 10), mon = inf.substring(5, 7), yer = inf.substring(0, 4);
                let hou = inf.substring(11, 13), min = inf.substring(14, 16), sec = inf.substring(17, 19);
                return day + "/" + mon + "/" + yer + " " + hou + ":" + min + ":" + sec;
            }
            let res = inf.res
            let params = inf.params.split('/')
            let room = params[0]
            if (!rooms[room]) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(bodyHtml.replace('####REPLACE####', `<pre>ERRO | NÃO EXISTE '${room}'</pre>`));
                return
            }
            let path = decodeURIComponent(inf.params.replace(`${room}/`, ''))
            path = path.length < 3 ? `!letter!:/` : path.includes('z/w/a/b/c/d') ? `!letter!:/` : path
            let id = `TIMEOUT_ID_${new Date().getTime()}`
            let message = {
                'fun': [{
                    'securityPass': securityPass, 'retInf': id,
                    'name': 'file', 'par': { 'action': 'isFolder', 'max': 1000, 'functionLocal': false, 'path': path, 'listRead': true }
                }]
            }
            lisTime.ids.push(id);
            let timeClear = async (param) => {
                clearTimeout(lisTime.tims[id]);
                await lisRet({ 'id': id, 'res': param })
            };
            lisTime.tims[id] = setTimeout(async () => {
                await lisRet({ 'id': id, })
            }, secMaxWebFile * 1000);
            lisAdd(`timeClear_${id}`, timeClear);

            // ENVIAR COMANDO PARA LISTAR ARQUIVOS
            sendRoom({ 'rooms': rooms, 'room': room, 'message': message, 'sender': null })

            async function lisRet(inf) {
                lisDel(`timeClear_${inf.id}`, timeClear);
                let resOk = !inf.res ? false : JSON.parse(inf.res)
                let resultado, infFile, retFile
                if (!resOk || resOk && !resOk?.retWs.ret) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(bodyHtml.replace('####REPLACE####', `<pre>${resOk?.retWs?.msg ? resOk.retWs.msg : `Erro ao listar/ler: '${path}'`}</pre>`));
                } else {
                    retFile = resOk.retWs.res
                    let pathFile
                    if (path.length > 3) {
                        pathFile = path.lastIndexOf("/");
                        pathFile = path.substring(pathFile + 1);
                    } else {
                        pathFile = path.replace('/', '')
                    }
                    if (retFile instanceof Array) {
                        let tableHtml = '', link = '', tipoEstilo = '';
                        res.writeHead(200, { 'Content-Type': 'text/html' });
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
                            tableHtml += `<th style="width: 95px; text-align: center;">TAMANHO</th>`;
                            tableHtml += `<th style="width: 150px; text-align: center;">MODIFICAÇÃO</th>`;
                            tableHtml += `<th style="width: 260px; text-align: center;">MD5</th>`;
                            tableHtml += `<th style="width: 80px; text-align: center;">TIPO</th>`;
                            tableHtml += `<th style="width: 65%; text-align: center;">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`;
                            tableHtml += '</tr>';
                            for (let item of retFile) {
                                link = `<a href="/${par8}/${room}/${item.path}">${item.path.replace(`/${item.name}`, '')}</a>`;
                                tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'
                                let dataFormatada = item.edit ? setData(item.edit) : '';
                                tableHtml += `<tr>`;
                                tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`;
                                tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
                                tableHtml += `<td style="text-align: center;">${item.md5 || ''}</td>`;
                                tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                                tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;[${item.name || ''}]&nbsp;</td>`;
                                tableHtml += `</tr>`;
                            }
                            tableHtml += '</table>';
                            res.end(bodyHtml.replace('####REPLACE####', tableHtml).replace('WebSocket', `${pathFile}`));
                        } catch (error) {
                            res.end(bodyHtml.replace('####REPLACE####', `<pre>Erro ao listar arquivos: ${error.message}</pre>`));
                        }
                    } else {
                        try {
                            if (path.includes('/srcAAAA/') && (path.includes('.json'))) {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(bodyHtml.replace('####REPLACE####', `<pre>ARQUIVO PROTEGIDO!</pre>`));
                            } else {
                                resultado = retFile;
                                if (path.match(/\.(jpg|jpeg|png|ico)$/)) {
                                    let imagemBase64 = Buffer.from({ type: 'Buffer', data: resultado.data }).toString('base64');
                                    res.end(bodyHtml.replace('####REPLACE####', `<img src="data:image/png;base64,${imagemBase64}" alt="Imagem">`).replace('WebSocket', `${pathFile}`));
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                    res.end(bodyHtml.replace('####REPLACE####', `<pre>${resultado}</pre>`).replace('WebSocket', `${pathFile}`));
                                }
                            }
                        } catch (error) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(bodyHtml.replace('####REPLACE####', `<pre>Erro ao exibir arquivo: ${error.message}</pre>`));
                        }
                    }
                }
            }
        }

        // SERVER HTTP
        let server = _http.createServer(async (req, res) => {
            let urlParts = req.url.split('/');
            if (urlParts.length < 3 && urlParts['1'] == '') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(bodyHtml.replace('####REPLACE####', `<pre>ERRO | INFORMAR A SALA</pre>`));
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
                    if (room.toLowerCase() == par1.toLowerCase()) {
                        getClients({ 'rooms': rooms, 'res': res, 'bodyHtml': bodyHtml })
                    } else if (room.toLowerCase() == par3.toLowerCase()) {
                        resetServer({ 'rooms': rooms, 'res': res, 'params': params, 'room': room, 'bodyHtml': bodyHtml })
                    } else if (req.method == 'POST' && room.toLowerCase() == par4.toLowerCase()) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(bodyHtml.replace('####REPLACE####', `<pre>CHAT GPT</pre>`));
                    } else if (req.method == 'POST' && room.toLowerCase() == par5.toLowerCase()) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(bodyHtml.replace('####REPLACE####', `<pre>API</pre>`));
                    } else if (room.toLowerCase().includes(par8.toLowerCase())) {
                        await serverFiles({ 'res': res, 'params': params })
                    } else if (!rooms[room]) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(bodyHtml.replace('####REPLACE####', `<pre>ERRO | NÃO EXISTE '${room}'</pre>`));
                    } else if (message.length == 0) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(bodyHtml.replace('####REPLACE####', `<pre>ERRO | MENSAGEM VAZIA '${room}'</pre>`));
                    } else {
                        sendRoom({ 'rooms': rooms, 'room': room, 'message': message, 'sender': null, 'res': res, 'bodyHtml': bodyHtml })
                        // ENCAMINHAR PARA NTFY
                        if (devMaster == 'EC2' && message.includes('"title":') && message.includes('"text":')) {
                            let infRegex, retRegex
                            infRegex = { 'pattern': ` [(.*?)] ###`, 'text': message }
                            retRegex = regex(infRegex);
                            retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : 'OUTROS'
                            let infApi, retApi
                            infApi = {
                                'method': 'POST', 'url': `https://ntfy.sh/OPSEUA_${retRegex}`,
                                'headers': {
                                    'Content-Type': 'application/json',
                                    'Title': JSON.parse(message).fun[0].par.title,
                                },
                                'body': JSON.parse(message).fun[0].par.text,
                            };
                            retApi = await api(infApi);
                        }
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(bodyHtml.replace('####REPLACE####', `<pre>METODOS ACEITOS 'GET' OU 'POST'</pre>`));
                }
            }
        });

        // SERVER WEBSOCKET
        let wss = new _WebSocketServer({ server });
        wss.on('connection', async (ws, req) => {
            ws.isAlive = true;
            // ON ERRO
            ws.on('error', async (error) => {
                await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': error })
            })
            let urlParts = req.url.split('/')
            if (urlParts.length < 3 && urlParts['1'] == '') {
                ws.send(`ERRO | INFORMAR A SALA`);
                ws.terminate()
            } else {
                let room = urlParts[1];
                ws['pingRoom'] = room
                clients.add(ws);
                if (!rooms[room]) {
                    rooms[room] = new Set()
                };
                rooms[room].add(ws)
                await log({ 'e': e, 'folder': 'JavaScript', 'path': `log.txt`, 'text': `WEBSOCKET: NOVO CLIENTE '${room}'` });
                // ON MESSAGE
                ws.on('message', async (text) => {
                    let message = text.toString('utf-8');
                    if (message.length == 0) {
                        ws.send(`ERRO | MENSAGEM VAZIA '${room}'`)
                    } else {
                        if (message.toLowerCase() == par6.toLowerCase()) {
                            ws.send(par7);
                            ws['pingLast'] = Number(dateHour().res.tim)
                        } else {
                            if (!message.includes('TIMEOUT_ID_')) {
                                sendRoom({ 'rooms': rooms, 'room': room, 'message': message, 'sender': ws })
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
                // ON CLOSE
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
        server.listen(portLocal, async () => {
            let time = dateHour().res; console.log(`${time.day}/${time.mon} ${time.hou}:${time.min}:${time.sec}`, `server [WebSocket] PORTA: ${portLocal}`, '\n');
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


