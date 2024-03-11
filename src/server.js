await import('./resources/@export.js');
let e = import.meta.url, ee = e
let wsClients = { 'rooms': {} }, wsClientLoc
// SERVIDOR HTTP
let server = _http.createServer(async (req, res) => {
    if (req.url.includes('favicon.ico')) { return }
    // SALA E PARAMETROS
    let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': res, 'server': req, })
    if (!retRoomParams.ret) { return }
    let { host, room, locWeb, action, message, method, } = retRoomParams.res; res['host'] = host; res['room'] = room; res['locWeb'] = locWeb; res['method'] = method;

    // PROCESSAR AÇÃO/MENSAGEM RECEBIDA
    messageAction({ 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc })
});

let aaa



// SERVIDOR WEBSOCKET | ### ON CONNECTION
let wss = new _WebSocketServer({ server });
wss.on('connection', async (ws, res) => {
    // SALA E PARAMETROS
    let retRoomParams = await roomParams({ 'e': e, 'wsClients': wsClients, 'resWs': ws, 'server': res, })
    if (!retRoomParams.ret) { return }
    let { host, room, locWeb, method, } = retRoomParams.res; ws['host'] = host; ws['room'] = room; ws['locWeb'] = locWeb; ws['method'] = method;

    // SALA [ADICIONAR]
    if (!wsClients.rooms[`${host}/${room}`]) { wsClients.rooms[`${host}/${room}`] = new Set() }; wsClients.rooms[`${host}/${room}`].add(ws)
    logServer({ 'write': true, 'room': room, 'msg': `NOVO ${locWeb} '${room}'` });

    async function aaaa() {
        await new Promise(resolve => { setTimeout(resolve, 5000) })
        console.log('INICIO')
        let data
        _fs.readFile('D:/1_ZIP_50MB.zip', async (err, data) => {
            //data = { "fun": [{ "securityPass": "passwordAqui", "retInf": true, "name": "commandLine", "par": { "command": "notepad", "awaitFinish": true } }] }
            //data = 'AAA'
            let retMessageSend = await messageSend({ 'destination': '127.0.0.1:1234/NAME', 'message': 'data', 'resWs': ws, 'secondsAwait': 0, });
            logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(retMessageSend)}` });
        });
    }; // if (!eng && !nao) { aaaa() }

    // ### ON MESSAGE
    ws.on('message', (data) => {
        let message = data.toString('utf-8'), messageLowerCase = message.toLowerCase()
        console.log(message)
        if (message.length == 0) {
            ws.send(`ERRO | MENSAGEM VAZIA ${locWeb} '${room}'`)
        } else {
            ws['lastMessage'] = Number(dateHour().res.tim);
            console.log(`SER ← ${Date.now()}`)
            if (messageLowerCase == globalWindow.par7.toLowerCase()) {
                // RECEBIDO: 'PONG' (não fazer nada)
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PONG ${locWeb} '${room}'` });
            } else if (message.toLowerCase() == globalWindow.par6.toLowerCase()) {
                // RECEBIDO: 'PING' → ENVIAR 'PONG'
                ws.send(globalWindow.par7); logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RECEBEU PING ${locWeb} '${room}'` });
            } else {
                try { message = JSON.parse(message); } catch (e) { message = { 'message': message }; console.log('ERRO M1') };
                if (!message.message) {
                    message = { 'message': message };
                    console.log('ERRO M2')
                }
                // PROCESSAR MENSAGEM RECEBIDA
                messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, 'wsClients': wsClients, });
            }
        }
    });

    // ### ON ERROR/CLOSE
    ws.on('error', (error) => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'write': true, 'msg': `CLIENTE ERRO ${locWeb} '${room}'\n${error}`, }) });
    ws.on('close', () => { removeSerCli({ 'resWs': ws, 'host': host, 'room': room, 'write': true, 'msg': `CLIENTE DESCONECTADO ${locWeb} '${room}'`, }) });
});

// LOG DO SERVER
async function logServer(inf) {
    let { write, msg, room } = inf; // logConsole({ 'e': e, 'ee': ee, 'write': write, 'msg': msg });
    // if (globalWindow.devMaster == 'OPSEUA' && room && globalWindow.sheetServer.devs.includes(room)) { // 'OPSEUA' → 'EC2'
    //     let infGoogleSheets = { // A2  | B2 | C2 
    //         'e': e, 'action': 'send', 'id': `1BKI7XsKTq896JcA-PLnrSIbyIK1PaakiAtoseWmML-Q`, 'tab': `SERVER`,
    //         'range': `${globalWindow.sheetServer.cols[globalWindow.sheetServer.devs.indexOf(room)]}2`,
    //         'values': [[`${dateHour().res.tim} | ${inf.msg.includes('NOVO') ? 'ON' : 'OFF'}`]]
    //     }; googleSheets(infGoogleSheets)
    // }
}

// REMOVER CLIENTE
function removeSerCli(inf) {
    let { resWs, write, msg, host, room } = inf; logServer({ 'write': write, 'room': room, 'msg': msg, });
    if (wsClients.rooms[`${host}/${room}`]) { wsClients.rooms[`${host}/${room}`].delete(resWs); if (wsClients.rooms[`${host}/${room}`].size == 0) { delete wsClients.rooms[`${host}/${room}`] } }
}

// LOOP: CHECAR ÚLTIMA MENSAGEM
function lastMessageReceived(inf) {
    for (const clientSet of Object.values(wsClients.rooms)) {
        for (const value of clientSet) {
            function check(inf) { let { lastMessage, locWeb, room } = inf; return { 'dif': lastMessage ? Number(dateHour().res.tim) - lastMessage : -99, 'locWeb': locWeb, 'room': room } };
            let retCheck = check(value); if (retCheck.dif > (inf + 5)) {
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `DESCONECTAR [PING ${retCheck.dif}] ${retCheck.locWeb} '${retCheck.room}'` }); value.close()
            }
        }
    }
}; setInterval(() => { lastMessageReceived(globalWindow.secPing / 2) }, (globalWindow.secPing / 2 * 1000));

// ACTION LOOP [SOMENTE SE FOR NO EC2 (07H<>23H)
// setInterval(() => {
//     let time = dateHour().res; if (globalWindow.devMaster == 'EC2' && Number(time.hou) > 6 && Number(time.hou) < 24) {
//         let infReceivedSendAwait, retReceivedSendAwait
//         infReceivedSendAwait = { 'e': e, 'rooms': wsClients.rooms, 'room': 'all', 'message': globalWindow.par10, 'action': globalWindow.par10, 'sender': null, 'server': 'res', 'method': 'WEBSOCKET' }
//         received(infReceivedSendAwait)
//         console.log('LOOP')
//     }
// }, (globalWindow.secLoop * 1000));

// SERVIDOR: INICIAR
server.listen(globalWindow.portLocal, async () => {
    // WEBSOCKET [CLIENT LOC] ------------------------------------------------------------------------------------------
    let ws = new _WebSocket(`ws://${letter == 'D' ? '127.0.0.1' : globalWindow.serverWeb}:${globalWindow.portLocal}/?roo=${globalWindow.par2}`)
    let url = ws._url ? ws._url : ws.url; let host = url.replace('ws://', '').split('/')[0]; let room = url.split(`${host}/`)[1].replace('?roo=', '')
    let locWeb = host.includes('127.0.0') ? `[LOC]` : `[WEB]`; ws['host'] = host; ws['room'] = room; ws['locWeb'] = locWeb; ws['method'] = 'WEBSOCKET';
    wsClientLoc = ws; ws.onerror = (data) => { logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `ERRO [CLIENT LOC]:\n${data}` }) };
    ws.onmessage = async (data) => {
        let message = data.data.toString('utf-8');
        try { message = JSON.parse(message) } catch (e) { message = { 'message': message } }; if (!message.message) { message = { 'message': message } }
        // PROCESSAR MENSAGEM RECEBIDA
        messageReceived({ ...message, 'host': host, 'room': room, 'resWs': ws, });
    }
    // -------------------------------------------------------------------------------------------------------------
    logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `[WebSocket] PORTA: ${globalWindow.portLocal}` });

    // CLIENT (NÃO POR COMO 'await'!!!)
    // client2({ 'e': e })
    // client({ 'e': e })
});



