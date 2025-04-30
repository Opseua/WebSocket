let startup = new Date(); globalThis['sP'] = import.meta.url; await import('./resources/@export.js'); let e = sP, ee = e; let libs = { 'ws': {}, 'http': {}, };
let rateHttp = rateLimiter({ 'max': 20, 'sec': 10, }); let rateWs = rateLimiter({ 'max': 20, 'sec': 10, }); let ico = `${fileWindows}/BAT/z_ICONES/websocket.ico`, h = 'Access-Control-Allow-';

async function serverRun(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        /* IMPORTAR BIBLIOTECA [NODEJS] */ libs['ws'] = { 'WebSocket': 1, 'WebSocketServer': 1, 'pro': true, }; libs['http']['http'] = 1; libs = await importLibs(libs, 'serverRun [WebSocket]');

        await logConsole({ e, ee, 'txt': `**************** SERVER **************** [${startupTime(startup, new Date())}]`, });

        // ############# SERVIDOR HTTP
        let wsClients = { 'rooms': {}, }, wsClientLoc; let serverHttp = _http.createServer(async (req, res) => { // EVITAR LOOP INFINITO | PRÉ-CONFIGURAÇÕES HTTP
            function resEnd(d) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', }).end(JSON.stringify({ ret: !!d.ret, msg: `SERVER [WS]: ERRO | ${d.msg || '*'}`, })); }
            if (req.url === '/favicon.ico') { let c = await _fs.promises.readFile(ico); res.writeHead(200, { 'Content-Type': 'image/x-icon', }).end(c); return; } if (!['GET', 'POST',].includes(req.method)) {
                res.setHeader(`${h}Origin`, '*').setHeader(`${h}Methods`, '*').setHeader(`${h}Headers`, '*').setHeader(`${h}Credentials`, 'true'); resEnd({ 'msg': `APENAS 'GET' ou 'POST'`, }); return;
            } if (!rateHttp.check()) { resEnd({ 'msg': `MUITAS REQUISICOES`, }); return; } /* SALA E PARAMETROS | PROCESSAR AÇÃO/MENSAGEM RECEBIDA */  let r = await roomParams({ e, 'server': req, });
            if (!r.ret || r.stop) { resEnd({ 'ret': r.ret, 'msg': r.msg, }); return; } let { host, room, hostRoom, locWeb, action, message, method, headers, } = r.res; res['host'] = host; res['room'] = room;
            res['hostRoom'] = hostRoom; res['locWeb'] = locWeb; res['method'] = method; res['headers'] = headers; messageAction({ host, room, action, message, 'resWs': res, wsClients, wsClientLoc, });
        });

        // REMOVER CLIENTE
        function remSerCli(i) { let { resWs, hostRoom, } = i; if (wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom].delete(resWs); if (wsClients.rooms[hostRoom].size === 0) { delete wsClients.rooms[hostRoom]; } } }

        // LOOP: CHECAR ÚLTIMA MENSAGEM
        let secPing = gW.secPing; function lastMessageReceived() {
            for (let clientSet of Object.values(wsClients.rooms)) {
                for (let value of clientSet) {
                    function check(inf = {}) { let { lastMessage, locWeb, room, } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, locWeb, room, }; } let retCheck = check(value);
                    if (retCheck.dif > ((secPing * 2) - 1)) { logConsole({ e, ee, 'txt': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'`, }); value.close(); }
                }
            }
        } setInterval(() => { lastMessageReceived(); }, (secPing * 2) * 1000);

        // ############# SERVIDOR HTTP | SERVIDOR: INICIAR | ERROS SERVIDOR (ERROS QUE NÃO SEJAM DO DESLIGAMENTO DO SNIFFER)
        async function serverErr(err) { let errString = err.toString(); if (errString.includes('EADDRINUSE') || !errString.includes('ECONNRESET')) { await regexE({ inf, 'e': err, }); process.exit(1); } }
        serverHttp.listen((gW.portLoc), async () => {
            // SERVIDOR WEBSOCKET | ### ON CONNECTION
            let wss = new _WebSocketServer({ 'server': serverHttp, }); wss.on('connection', async (ws, res) => {
                // SALA PARAMETROS E [ADICIONAR] | ENVIAR PING DE INÍCIO DE CONEXÃO | EVITAR LOOP INFINITO
                if (!rateWs.check()) { return; } let rRP = await roomParams({ e, 'server': res, }); if (!rRP.ret) { ws.send(JSON.stringify({ 'ret': rRP.ret, 'msg': rRP.msg || 'ERRO', })); ws.terminate(); return; }
                let { host, room, hostRoom, locWeb, method, } = rRP.res; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = method; let t = dateHour().res;
                t = `${t.day}/${t.mon}/${t.yea} ${t.hou}:${t.min}:${t.sec}.${t.mil}`; ws['dateHour'] = t; if (!wsClients.rooms[hostRoom]) { wsClients.rooms[hostRoom] = new Set(); } wsClients.rooms[hostRoom].add(ws);

                // ### ON MESSAGE
                ws.on('message', async (data) => {
                    let message = data.toString('utf-8'); if (message.length === 0) { ws.send(`WEBSCOKET: ERRO | MENSAGEM VAZIA ${locWeb} '${room}'`); } else {
                        let pingPong = message === `ping` ? 1 : message === `pong` ? 2 : 0; ws['lastMessage'] = ws.lastMessage || pingPong > 0 ? Number(dateHour().res.tim) : false; // ÚLTIMA MENSAGEM RECEBIDA
                        if (pingPong > 0) { if (pingPong === 2) { return; } ws.send('pong'); /* RECEBIDO: 'PING' ENVIAR 'PONG' */ } else {
                            try { message = JSON.parse(message); } catch (catchErr) { message = { message, }; regexE({ 'inf': message, 'e': catchErr, }); }
                            if (!message.message) { message = { message, }; logConsole({ e, ee, 'txt': `ERRO M2`, }); } if (ws.lastMessage) { ws.send(`pong`); }
                            function processMes() { messageReceived({ ...message, host, room, 'resWs': ws, wsClients, }); } if (!(typeof message.message === 'object' && !message.buffer)) { processMes(); } else {
                                let text = false; if (!(message.message.fun && Array.isArray(message.message.fun))) { text = `SERVER WS: ERRO | CHAVE 'fun' NÃO ENCONTRADA/NÃO É ARRAY\n\n→ ${ws.hostRoom}`; }
                                else if (!message.message.fun.every(item => item.securityPass === gW.securityPass)) { text = `SERVER WS: ERRO | SECURITY PASS INVÁLIDO\n\n→ ${ws.hostRoom}`; }
                                if (!text) { processMes(); /* PROCESSAR MENSAGEM RECEBIDA */ } else {
                                    ws.send(JSON.stringify({ 'ret': false, 'msg': text, })); logConsole({ e, ee, 'txt': `${text}\n\n${data.toString('utf-8')}`, });
                                    notification({ 'keepOld': true, 'title': `# WS (${gW.devMaster}) [NODEJS]`, text, 'ignoreErr': true, }); // ALERTAR SOBRE O ERRO
                                }
                            }
                        }
                    }
                });

                // ### ON ERROR/CLOSE
                ws.on('error', () => { runRemSerCli(); }); ws.on('close', () => { runRemSerCli(); }); function runRemSerCli() { remSerCli({ 'resWs': ws, host, room, hostRoom, }); }
            });

            // WEBSOCKET [CLIENT LOC] (NAO USAR!!! ------------------------------------------------------------------------------------------
            let ws = new _WebSocket(`ws://${gW.devMaster === 'AWS' ? gW.serverWeb : '127.0.0.1'}:${gW.portLoc}/?roo=${gW.devMaster}-${gW.par2}`);
            let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', ''); let hostRoom = url.replace('ws://', '');
            let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['hostRoom'] = hostRoom; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET'; wsClientLoc = ws;
            ws.on('error', (data) => { logConsole({ e, ee, 'txt': `CLIENT LOC | ERRO\n${JSON.stringify(data.toString('utf-8'))}`, }); }); ws.on('message', async (data) => {
                let message = data.toString('utf-8'); let pingPong = message === `ping` ? 1 : message === `pong` ? 2 : 0;
                if (pingPong > 0) { return; } try { message = JSON.parse(message); } catch (catchErr) { message = { message, }; }
                if (!message.message) { message = { message, }; } messageReceived({ ...message, host, room, 'resWs': ws, }); // PROCESSAR MENSAGEM RECEBIDA
            }); // -------------------------------------------------------------------------------------------------------------

            // CLIENT (NÃO POR COMO 'await'!!!) [MANTER NO FINAL]
            await new Promise(r => { setTimeout(r, 50); }); client({ e, }); await new Promise(r => { setTimeout(r, 500); });

            // ACTION LOOP [SOMENTE SE FOR NO AWS (08H<>23H)] PARA TODOS OS '*-NODEJS-*'
            setInterval(async () => {
                let time = dateHour().res; if (gW.devMaster === 'AWS' && Number(time.hou) > 7 && Number(time.hou) < 24) {
                    logConsole({ e, ee, 'txt': `ACTION: LOOP`, }); await messageAction({ host, room: '*-NODEJS-*', destination: '*-NODEJS-*', action: gW.par10, message: '', resWs: false, wsClients, wsClientLoc, });
                }
            }, (gW.secLoop * 1000));
        }).on('error', (err) => { serverErr(err); });

        // 60 SEGUNDOS APÓS INICIAR → APAGAR LOGS/TEMP ANTIGOS (A CADA x HORAS) | CONSUMO DE CPU e MÉMORIA RAM (A CADA x MINUTOS)
        await new Promise(r => { setTimeout(r, 60 * 1000); }); logsDel(); setInterval(() => { logsDel(); }, 25 * 3600000); setInterval(() => { performanceDev(); }, 15 * 60000);

        ret['ret'] = true;
        ret['msg'] = `SERVER: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
}
// TODAS AS FUNÇÕES PRIMÁRIAS DO 'server.js' / 'serverC6.js' / 'serverJsf.js' DEVEM SE CHAMAR 'serverRun'!!!
serverRun();


