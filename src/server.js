function startupFun(b, c) { let a = c - b; let s = Math.floor(a / 1000); let m = a % 1000; let f = m.toString().padStart(3, '0'); return `${s}.${f}` }; let startup = new Date();
await import('./resources/@export.js'); let e = import.meta.url, ee = e;

let rate = rateLimiter({ 'max': 30, 'sec': 60 });
async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        logConsole({ e, ee, 'write': true, 'msg': `**************** SERVER **************** [${startupFun(startup, new Date())}]`, });

        // IMPORTAR BIBLIOTECA [NODEJS]
        if (typeof _WebSocket === 'undefined') { await funLibrary({ 'lib': '_WebSocket' }); }; if (typeof _WebSocketServer === 'undefined') { await funLibrary({ 'lib': '_WebSocketServer' }); };
        if (typeof _http === 'undefined') { await funLibrary({ 'lib': '_http' }); };

        // SERVIDOR HTTP
        let wsClients = { 'rooms': {} }, wsClientLoc; let server = _http.createServer(async (req, res) => {
            if (!rate.check()) { return } // EVITAR LOOP INFINITO
            if (req.url.includes('favicon.ico')) { let ico = await _fs.promises.readFile(`${fileWindows}/BAT/z_ICONES/websocket.ico`); res.writeHead(200, { 'Content-Type': 'image/x-icon' }).end(ico); return }
            // SALA E PARAMETROS | PROCESSAR AÇÃO/MENSAGEM RECEBIDA
            let retRoomParams = await roomParams({ e, wsClients, 'resWs': res, 'server': req, }); if (!retRoomParams.ret) { return };
            let { host, room, hostRoom, locWeb, action, message, method, headers } = retRoomParams.res; res['host'] = host; res['room'] = room; res['hostRoom'] = hostRoom; res['locWeb'] = locWeb;
            res['method'] = method; res['headers'] = headers; messageAction({ host, room, action, message, 'resWs': res, wsClients, wsClientLoc, headers })
        });

        // SERVIDOR WEBSOCKET | ### ON CONNECTION
        let wss = new _WebSocketServer({ server }); wss.on('connection', async (ws, res) => {
            // SALA PARAMETROS E [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO
            if (!rate.check()) { return } // EVITAR LOOP INFINITO
            let retRoomParams = await roomParams({ e, wsClients, 'resWs': ws, 'server': res, }); if (!retRoomParams.ret) { return };
            let { host, room, hostRoom, locWeb, method, } = retRoomParams.res; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = method;
            if (!wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom] = new Set(); }; wsClients.rooms[hostRoom].add(ws);

            // ### ON MESSAGE
            ws.on('message', async (data) => {
                let message = data.toString('utf-8'); if (message.length == 0) { ws.send(`WEBSCOKET: ERRO | MENSAGEM VAZIA ${locWeb} '${room}'`) } else {
                    let pingPong = message == `${gW.par6}` ? 1 : message == `${gW.par7}` ? 2 : 0; ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false; // ÚLTIMA MENSAGEM RECEBIDA
                    // logConsole({ e, ee, 'write': true, 'msg': `← SER | ${ws.lastMessage} | ${hostRoom}` });
                    if (pingPong > 0) { // RECEBIDO: 'PING' ENVIAR 'PONG'
                        if (pingPong == 2) { return }; ws.send('pong'); // logConsole({ e, ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
                    } else {
                        try { message = JSON.parse(message); } catch (catchErr) { message = { 'message': message }; regexE({ 'inf': message, 'e': catchErr, }); };
                        if (!message.message) { message = { 'message': message }; logConsole({ e, ee, 'write': true, 'msg': `ERRO M2` }); };
                        if (ws.lastMessage) { ws.send(`pong`) }; messageReceived({ ...message, host, room, 'resWs': ws, wsClients, }); // PROCESSAR MENSAGEM RECEBIDA
                    }
                }
            });

            // ### ON ERROR/CLOSE
            ws.on('error', (error) => { removeSerCli({ 'resWs': ws, host, room, hostRoom, 'write': true, 'msg': `CLIENTE ERRO ${locWeb} '${room}'\n${error}`, }) });
            ws.on('close', () => { removeSerCli({ 'resWs': ws, host, room, hostRoom, 'write': true, 'msg': `CLIENTE DESCONECTADO ${locWeb} '${room}'`, }) });
        });

        // REMOVER CLIENTE
        function removeSerCli(inf = {}) {
            let { resWs, hostRoom, } = inf; if (wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom].delete(resWs); if (wsClients.rooms[hostRoom].size == 0) { delete wsClients.rooms[hostRoom] } }
        }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = gW.secPing; function lastMessageReceived() {
            for (let clientSet of Object.values(wsClients.rooms)) {
                for (let value of clientSet) {
                    function check(inf = {}) { let { lastMessage, locWeb, room, } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, locWeb, room } }; let retCheck = check(value);
                    if (retCheck.dif > ((secPing * 2) - 1)) { logConsole({ e, ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close(); };
                }
            };
        }; setInterval(() => { lastMessageReceived() }, (secPing * 2) * 1000);

        // SERVIDOR: INICIAR
        server.listen(gW.portLoc, async () => {
            // WEBSOCKET [CLIENT LOC] ------------------------------------------------------------------------------------------
            let ws = new _WebSocket(`ws://${gW.devMaster == 'AWS' ? gW.serverWeb : '127.0.0.1'}:${gW.portLoc}/?roo=${gW.devMaster}-${gW.par2}`);
            let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', ''); let hostRoom = url.replace('ws://', '');
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';
            wsClientLoc = ws; ws.onerror = (data) => { logConsole({ e, ee, 'write': true, 'msg': `ERRO [CLIENT LOC]:\n${JSON.stringify(data)}` }) }; ws.onmessage = async (data) => {
                let message = data.data.toString('utf-8'); let pingPong = message == `${gW.par6}` ? 1 : message == `${gW.par7}` ? 2 : 0;
                if (pingPong > 0) { return }; try { message = JSON.parse(message) } catch (catchErr) { message = { 'message': message }; esLintIgnore = catchErr; };
                if (!message.message) { message = { 'message': message }; }; messageReceived({ ...message, host, room, 'resWs': ws, }); // PROCESSAR MENSAGEM RECEBIDA
            }
            // -------------------------------------------------------------------------------------------------------------
            // AGUARDAR INÍCIO [SERVIDOR]
            logConsole({ e, ee, 'write': true, 'msg': `RODANDO NA PORTA: ${gW.portLoc}` }); // await new Promise(resolve => { setTimeout(resolve, 1000) });

            // CLIENT (NÃO POR COMO 'await'!!!) | MANTER NO FINAL
            client({ 'e': e });

            // ACTION LOOP [SOMENTE SE FOR NO AWS (08H<>23H)] PARA TODOS OS '*-NODEJS-*'
            setInterval(async () => {
                let time = dateHour().res; if (gW.devMaster == 'AWS' && Number(time.hou) > 7 && Number(time.hou) < 24) {
                    logConsole({ e, ee, 'write': true, 'msg': `ACTION: LOOP` });
                    await messageAction({ 'host': host, 'room': '*-NODEJS-*', 'destination': '*-NODEJS-*', 'action': gW.par10, 'message': '', 'resWs': false, wsClients, wsClientLoc, 'headers': {}, });
                }
            }, (gW.secLoop * 1000));
        });

        // APAGAR LOGS/TEMP ANTIGOS (30 SEGUNDOS APÓS INICIAR E A CADA 25 HORAS)
        await new Promise(resolve => { setTimeout(resolve, 30 * 1000) }); logsDelOld(); setInterval(() => { logsDelOld(); }, 90000 * 1000);

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun()


