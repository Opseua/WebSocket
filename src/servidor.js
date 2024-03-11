await import('./resources/@export.js');

// FILA DE MENSAGENS
let arrValues = []; function arrAddOrRemove(inf) {
    let { big, value } = inf; if (!value) { if (arrValues.length > 0) { arrValues.shift(); } } else if (big) { arrValues.push({ 'big': true, 'value': value }); } else {
        let idxFirstBig = arrValues.findIndex(data => data.big);
        if (idxFirstBig !== -1) { arrValues.splice(idxFirstBig, 0, { 'big': false, 'value': value }); } else { arrValues.push({ 'big': false, 'value': value }); }
    }
}

// SERVIDOR
let wss = new _WebSocketServer({ port: 8889 }), sendingMessages = true;
wss.on('connection', async (ws) => {
    // MENSAGENS RECEBIDAS NO SERVIDOR
    ws.on('message', (data) => {
        let message = JSON.parse(data.toString('utf-8'))
        listenerAcionar(message.id, message.message)
    });

    // ENVIAR MENSAGENS DO SERVIDOR
    listenerMonitorar('ENVIAR_MENSAGEM', async (nomeList, inf) => {
        if (sendingMessages) {
            sendingMessages = false
            while (arrValues.length > 0) {
                await new Promise(resolve => { setTimeout(resolve, 1000) })
                ws.send(arrValues[0].value);
                arrAddOrRemove({ 'value': false });
                if (arrValues.length == 0) { sendingMessages = true; }
            }
        }
    });
});

async function sendNew(inf) { // "D:/1_ZIP_25MB.zip"
    let { message } = inf; let id = `ID_${new Date().getTime()}_${Math.random().toString(36).substring(2, 5)}_messageId`
    let retAwaitTimeout = awaitTimeout({ 'secondsAwait': 5, 'listenerName': id });
    if (message.includes('.zip')) {
        let fileContent = await _fs.promises.readFile(message); fileContent = Buffer.from(fileContent).toString('base64'); let chunkSize = 1024 * 1024;
        for (let i = 0; i < fileContent.length; i += chunkSize) {
            let chunk = fileContent.slice(i, i + chunkSize); arrAddOrRemove({ 'big': true, 'value': `{"id":"${id}","message":"${chunk}"}`, });
        }
    } else { arrAddOrRemove({ 'big': false, 'value': `{"id":"${id}","message":"${message}"}`, }); }
    listenerAcionar('ENVIAR_MENSAGEM', { 'value': 'value' }); retAwaitTimeout = await retAwaitTimeout; return retAwaitTimeout
}

// ENVIAR MENSAGEM
setTimeout(async () => {
    let retSendNew
    retSendNew = await sendNew({ 'message': 'OLA 1' })
    console.log(Date.now(), 'SER: RECEBIDA MENSAGEM', retSendNew.res ? retSendNew.res : 'TEMPO EXPIROU', '\n')

    setTimeout(async () => {
        retSendNew = await sendNew({ 'message': 'OLA 2' })
        console.log(Date.now(), 'SER: RECEBIDA MENSAGEM', retSendNew.res ? retSendNew.res : 'TEMPO EXPIROU', '\n')
    }, 1200);

    retSendNew = await sendNew({ 'message': 'D:/1_ZIP_25MB.zip' })
    console.log(Date.now(), 'SER: RECEBIDA MENSAGEM', retSendNew.res ? retSendNew.res : 'TEMPO EXPIROU', '\n')
}, 2000);


// CLIENTE
const ws = new _WebSocket('ws://127.0.0.1:1234'); let messageGrande = false;
ws.on('open', function () {
    // MENSAGENS RECEBIDAS NO CLIENTE
    ws.on('message', function (data) {
        let message = JSON.parse(data.toString('utf-8'));
        if (message.message.length < 10) {
            // ### É UMA MENSAGEM PEQUENA
            console.log(Date.now(), 'CLI: RECEBIDA MENSAGEM [NÃO]', message.message.length, message.message);
            let response = { 'id': message.id, 'message': 'RETORNO' };
            ws.send(JSON.stringify(response));
        } else if (!messageGrande) {
            // ### É UMA MENSAGEM GRANDE
            messageGrande = true;
            console.log(Date.now(), 'CLI: RECEBIDA MENSAGEM [SIM]', message.message.length);
        }
    });
});
