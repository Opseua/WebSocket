let arrValues = [], sendingMessages = true
function arrAddOrRemove(inf) {
    let { value } = inf; if (!value) { if (arrValues.length > 0) { arrValues.shift(); } }  // ← REMOVER O PRIMEIRO INDICE DA ARRAY
    else if (value.length > 5) { arrValues.push(value); } // ← PRIORIDADE [NÃO] | ↓ PRIORIDADE [SIM]
    else { let last = arrValues.findIndex(data => data.length > 5); if (last === -1) { arrValues.unshift(value); } else { arrValues.splice(last, 0, value); } }
}

function sendMessage(inf) { let { value } = inf; arrAddOrRemove({ 'value': value }); }

async function send(inf) {

    sendMessage({ 'value': inf.value });

    // ENVIAR MENSAGENS NA FILA E REMOVER O PRIMEIRO INDICE
    if (sendingMessages) {
        sendingMessages = false
        while (arrValues.length > 0) {
            await new Promise(resolve => { setTimeout(resolve, 1000) })
            inf.ws.send(JSON.stringify(arrValues[0]));
            // console.log(arrValues.length)
            arrAddOrRemove({ 'value': false });
            if (arrValues.length == 0) { sendingMessages = true; }
        }
    }
}

global['send'] = send;
