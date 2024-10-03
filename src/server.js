function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}` }; let startup = new Date();
await import('./resources/@export.js'); let e = import.meta.url, ee = e;

async function serverRun(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]` })

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _WebSocket === 'undefined') { await functionImportLibrary({ 'lib': '_WebSocket' }); }; if (typeof _WebSocketServer === 'undefined') { await functionImportLibrary({ 'lib': '_WebSocketServer' }); };
        if (typeof _http === 'undefined') { await functionImportLibrary({ 'lib': '_http' }); };

        // SERVIDOR HTTP
        let wsClients = { 'rooms': {} }, wsClientLoc; let server = _http.createServer(async (req, res) => {
            if (req.url.includes('favicon.ico')) { let ico = await _fs.promises.readFile(`${letter}:/ARQUIVOS/WINDOWS/BAT/z_ICONES/websocket.ico`); res.writeHead(200, { 'Content-Type': 'image/x-icon' }).end(ico); return; }
            // SALA E PARAMETROS | PROCESSAR AÇÃO/MENSAGEM RECEBIDA
            let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': res, 'server': req, }); if (!retRoomParams.ret) { return };
            let { host, room, hostRoom, locWeb, action, message, method, headers } = retRoomParams.res; res['host'] = host; res['room'] = room; res['hostRoom'] = hostRoom; res['locWeb'] = locWeb; res['method'] = method;
            res['headers'] = headers; messageAction({ 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc, 'headers': headers })
        });

        // SERVIDOR WEBSOCKET | ### ON CONNECTION
        let wss = new _WebSocketServer({ server }); wss.on('connection', async (ws, res) => {
            // SALA PARAMETROS E [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
            let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': ws, 'server': res, }); if (!retRoomParams.ret) { return };
            let { host, room, hostRoom, locWeb, method, } = retRoomParams.res; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = method;
            if (!wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom] = new Set(); }; wsClients.rooms[hostRoom].add(ws);

            // ### ON MESSAGE
            ws.on('message', async (data) => {
                let message = data.toString('utf-8'); if (message.length == 0) { ws.send(`ERRO | MENSAGEM VAZIA ${locWeb} '${room}'`) } else {
                    let pingPong = message == `${globalWindow.par6}` ? 1 : message == `${globalWindow.par7}` ? 2 : 0
                    ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false; // ÚLTIMA MENSAGEM RECEBIDA
                    // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `← SER | ${ws.lastMessage} | ${hostRoom}` });
                    if (pingPong > 0) { // RECEBIDO: 'PING' ENVIAR 'PONG'
                        if (pingPong == 2) { return }; ws.send('pong'); // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                    } else {
                        try { message = JSON.parse(message); } catch (catchErr) { message = { 'message': message }; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO M1` }); esLintIgnore = catchErr; };
                        if (!message.message) { message = { 'message': message }; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO M2` }) }
                        if (ws.lastMessage) { ws.send(`pong`) }; messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'wsClients': wsClients, }); // PROCESSAR MENSAGEM RECEBIDA
                    }
                }
            });

            // ### ON ERROR/CLOSE
            ws.on('error', (error) => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'hostRoom': hostRoom, 'write': true, 'msg': `CLIENTE ERRO ${locWeb} '${room}'\n${error}`, }) });
            ws.on('close', () => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'hostRoom': hostRoom, 'write': true, 'msg': `CLIENTE DESCONECTADO ${locWeb} '${room}'`, }) });
        });

        // REMOVER CLIENTE
        function removeSerCli(inf) {
            let { resWs, write, msg, host, room, hostRoom } = inf; if (wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom].delete(resWs); if (wsClients.rooms[hostRoom].size == 0) { delete wsClients.rooms[hostRoom] } }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = globalWindow.secPing; function lastMessageReceived() {
            for (let clientSet of Object.values(wsClients.rooms)) {
                for (let value of clientSet) {
                    function check(inf) { let { lastMessage, locWeb, room } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
                    let retCheck = check(value); if (retCheck.dif > ((secPing * 2) - 1)) {
                        logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close()
                    }
                }
            };
        }; setInterval(() => { lastMessageReceived() }, (secPing * 2) * 1000);

        // SERVIDOR: INICIAR
        server.listen(globalWindow.portLoc, async () => {
            // WEBSOCKET [CLIENT LOC] ------------------------------------------------------------------------------------------
            let ws = new _WebSocket(`ws://${globalWindow.devMaster == 'AWS' ? globalWindow.serverWeb : '127.0.0.1'}:${globalWindow.portLoc}/?roo=${globalWindow.devMaster}-${globalWindow.par2}`)
            let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', ''); let hostRoom = url.replace('ws://', '')
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';
            wsClientLoc = ws; ws.onerror = (data) => { logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO [CLIENT LOC]:\n${JSON.stringify(data)}` }) }; ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'); let pingPong = message == `${globalWindow.par6}` ? 1 : message == `${globalWindow.par7}` ? 2 : 0
                if (pingPong > 0) { return }; try { message = JSON.parse(message) } catch (catchErr) { message = { 'message': message }; esLintIgnore = catchErr; }; if (!message.message) { message = { 'message': message }; }
                messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, });   // PROCESSAR MENSAGEM RECEBIDA
            }
            // -------------------------------------------------------------------------------------------------------------
            // AGUARDAR INÍCIO [SERVIDOR]
            await new Promise(resolve => { setTimeout(resolve, 1000) }); logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RODANDO NA PORTA: ${globalWindow.portLoc}` });

            // CLIENT (NÃO POR COMO 'await'!!!) | MANTER NO FINAL
            client({ 'e': e });

            // ACTION LOOP [SOMENTE SE FOR NO AWS (08H<>23H)] PARA TODOS OS '*-NODEJS-*'
            setInterval(async () => {
                let time = dateHour().res; if (globalWindow.devMaster == 'AWS' && Number(time.hou) > 7 && Number(time.hou) < 24) {
                    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ACTION: LOOP` });
                    await messageAction({ 'host': host, 'room': '*-NODEJS-*', 'destination': '*-NODEJS-*', 'action': globalWindow.par10, 'message': '', 'resWs': false, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc, 'headers': {} })
                }
            }, (globalWindow.secLoop * 1000));
        });

        // APAGAR LOGS/TEMP ANTIGOS (30 SEGUNDOS APÓS INICIAR E A CADA 25 HORAS)
        await new Promise(resolve => { setTimeout(resolve, 30 * 1000) }); logsDelOld(); setInterval(() => { logsDelOld(); }, 90000 * 1000);

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


