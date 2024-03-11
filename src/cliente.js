import WebSocket from 'ws';
import fs from 'fs';

const ws = new WebSocket('ws://127.0.0.1:1234');
let messageGrande = false
ws.on('open', function () {
    ws.on('message', function (data) {
        let receivedData = data.toString('utf-8');
        if (receivedData.length < 50) {
            console.log(Date.now(), 'RECEBIDA MENSAGEM GRANDE [NÃO]', receivedData.length, receivedData);
        } else if (!messageGrande) {
            messageGrande = true
            console.log(Date.now(), 'RECEBIDA MENSAGEM GRANDE [SIM]', receivedData.length);
        }
    });
});


let filePath = "D:/1_ZIP_25MB.zip"; let fileContent = await fs.promises.readFile(filePath);
fileContent = Buffer.from(fileContent).toString('base64'); let partes = [], chunkSizeInBytes = 5024 * 1024;
for (let i = 0; i < fileContent.length; i += chunkSizeInBytes) { let chunk = fileContent.slice(i, i + chunkSizeInBytes); partes.push(chunk); }
// console.log('Número de partes:', partes.length);

// sendMessage({ 'value': 'PEQ 1' });
// sendMessage({ 'value': 'PEQ 2' });
// for (let [index, value] of partes.entries()) { sendMessage({ 'value': value }); }
// sendMessage({ 'value': 'PEQ 3' });
// sendMessage({ 'value': 'PEQ 4' });