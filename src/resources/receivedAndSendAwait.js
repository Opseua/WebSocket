// await new Promise(resolve => { setTimeout(resolve, 2000) })
// let infReceivedSendAwait, retReceivedSendAwait, message = {
//     'fun': [{
//         'securityPass': securityPass, 'retInf': 'ID_AQUI', 'name': 'commandLine', 'par': {
//             'awaitFinish': true, 'command': `nircmd savescreenshot "!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshotNovo.png"`
//         }
//     }]
// };
// // awaitRet: true → ENVIA PARA TODOS DA SALA (INCLUSIVE O PRÓPRIO CLIENTE) E ESPERA A RESPOSTA
// // awaitRet: false → ENVIA PARA TODOS DA SALA (EXCETO O PRÓPRIO CLIENTE) E NÃO ESPERA A RESPOSTA
// infReceivedSendAwait = { 'e': e, 'rooms': rooms, 'room': room, 'message': message, 'sender': 'null/ws', 'server': res, 'awaitRet': false,  }
// retReceivedSendAwait = await sendAwait(infReceivedSendAwait)
// retReceivedSendAwait = await received(infReceivedSendAwait)
// console.log(retSendAwait)

// LISTENER / TIMEOUT / BODY HTML
let lisTime = { 'lists': {}, 'tims': {}, 'ids': [] }
function lisAdd(eve, cal) { if (!lisTime.lists[eve]) { lisTime.lists[eve] = []; }; lisTime.lists[eve].push(cal); }
function lisDel(eve, cal) { if (lisTime.lists[eve]) { lisTime.lists[eve] = lisTime.lists[eve].filter(cb => cb !== cal); } }
function lisRun(eve, param) { if (lisTime.lists[eve]) { lisTime.lists[eve].forEach(cal => cal(param)); } }

let e = import.meta.url, ee = e
// ##################################################################################################
async function sendAwait(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let rooms = inf.rooms
        let room = inf.room
        let message = inf.message
        let awaitRet = inf.awaitRet
        let sender = inf.sender
        let max = 20
        let idNew = `TIMEOUT_ID_${new Date().getTime()}_${Math.random().toString(36).substring(2, 5)}`;

        // ENVIAR MENSAGEM PARA A SALA
        function com1(inf) { sendRoom({ 'e': e, 'rooms': rooms, 'room': room, 'message': inf.message, 'sender': awaitRet ? null : sender, }) };
        // RET
        function com2(inf) {
            if (inf.retAwait == 'TEMPO_EXPIROU') {
                ret['msg'] = `SEND WAIT: NÃO RECEBEU A RESPOSTA A TEMPO`;
            } else {
                ret['ret'] = true;
                ret['msg'] = `SEND AND WAIT: OK`;
                if (awaitRet) { ret['res'] = JSON.parse(inf.retAwait); }
            }
        }

        // ENVIAR MENSAGEM (SEM ESPERAR RESPOSTA)
        if (!awaitRet) {
            com1({ 'message': message })
            com2({})
        } else {
            // ENVIAR MENSAGEM (AGUARDAR RESPOSTA)
            lisTime.ids.push(idNew);
            let resolvePromise;
            // RETORNO RECEBIDO A TEMPO [SIM]
            let promiseAwait = new Promise((resolve) => {
                resolvePromise = resolve;
                lisAdd(`timeClear_${idNew}`, (promiseRet) => { resolve(promiseRet); });
            });

            // RETORNO RECEBIDO A TEMPO [NÃO]
            lisTime.tims[idNew] = setTimeout(() => { resolvePromise('TEMPO_EXPIROU'); }, max * 1000);
            // ###################

            // ENVIAR MENSAGEM PARA A SALA
            com1({ 'message': JSON.stringify(message).replace('ID_AQUI', idNew) })

            // ################### LIMPAR TIMEOUT, LISTENER E RETORNAR RESPOSTA
            let retAwait = await promiseAwait; clearTimeout(lisTime.tims[idNew]); lisDel(`timeClear_${idNew}`);
            delete lisTime.tims[idNew]; delete lisTime.lists[`timeClear_${idNew}`];
            lisTime.ids = lisTime.ids.filter(item => item !== idNew);
            com2({ 'retAwait': retAwait })
        }

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
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

// ##################################################################################################
async function received(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let method = inf.method
        let rooms = inf.rooms
        let room = inf.room
        let action = inf.action
        let message = inf.message
        let sender = inf.sender
        let server = inf.server

        if (message.includes('TIMEOUT_ID_')) {
            // RESPOSTA DE MENSAGEM SENDO AGUARDADA
            for (let [index, value] of lisTime.ids.entries()) {
                if (message.includes(value)) {
                    lisRun(`timeClear_${value}`, message);
                    clearTimeout(`timeClear_${value}`);
                    break
                }
            }
        } else {
            let infSendAwait, retSendAwait, arrActions, body = `ERRO NÃO DEFINIDO`
            try {
                if (method == 'WEBSOCKET' || room !== '' && rooms[room] && (['GET', 'POST'].includes(method) && (action !== '' || message !== ''))) {
                    body = `OK: '${room}'`
                    // MENSAGEM NORMAL OU AÇÃO
                    arrActions = [
                        par1.toLowerCase(), par3.toLowerCase(), par4.toLowerCase(), par5.toLowerCase(), par8.toLowerCase(), par9.toLowerCase(),
                        par10.toLowerCase(), par11.toLowerCase(),
                    ]; arrActions = arrActions.includes(action.toLowerCase() || message.toLowerCase())
                    infSendAwait = { 'rooms': rooms, 'room': room, 'message': message, 'server': server, 'awaitRet': false, 'action': action, 'method': method, 'sender': sender, }
                    if (arrActions) {
                        // ### AÇÃO
                        // await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `received 1` });
                        await actions(infSendAwait)
                        // await log({ 'e': e, 'folder': 'JavaScriptNovo', 'path': `log.txt`, 'text': `received 2` });
                    } else {
                        // ### MENSAGEM
                        sendAwait(infSendAwait)
                        body = `OK: '${room}' MENSAGEM '${message}'`
                    }
                    // ENCAMINHAR PARA NTFY
                    if (devMaster == 'EC2' && message.includes('"title":') && message.includes('"text":')) {
                        let infRegex, retRegex, infApi, retApi
                        infRegex = { 'e': e, 'pattern': ` [(.*?)] ###`, 'text': message }
                        retRegex = regex(infRegex);
                        retRegex = retRegex?.res?.['1'] ? retRegex.res['1'] : 'OUTROS'
                        infApi = {
                            'e': e, 'method': 'POST', 'url': `https://ntfy.sh/OPSEUA_${retRegex}`,
                            'headers': { 'Content-Type': 'application/json', 'Title': JSON.parse(message).fun[0].par.title, },
                            'body': JSON.parse(message).fun[0].par.text,
                        };
                        api(infApi);
                    }
                } else {
                    // ERROS
                    if (!['GET', 'POST'].includes(method)) {
                        body = `ERRO | METODOS ACEITOS 'GET' OU 'POST'`
                    } else if (room == '') {
                        body = `ERRO | INFORMAR A SALA`
                    } else if (!rooms[room]) {
                        body = `ERRO | NÃO EXISTE '${room}'`
                    } else if ((method == 'GET' && action == '') || (method == 'POST' && message == '')) {
                        body = `ERRO | ACTION/MENSAGEM VAZIA '${room}'`
                    }
                }
            } catch (e) {
                body = `URL INVÁLIDA!\n\nEXEMPLO:\nSALA/MENSAGEM_ou_ACAO\n?act=ACAO&roo=SALA&mes=MENSAGEM\n?roo=SALA&mes=MENSAGEM`
            }

            // ENVIAR RETORNO HTTP (SE NÃO FOR AÇÃO)
            if (method !== 'WEBSOCKET' && !arrActions) { html({ 'e': e, 'server': server, 'body': body, 'room': room, 'infAdd': { 'type': 'text', 'title': 'Server' } }) }
        }

        ret['ret'] = true;
        ret['msg'] = `RECEIVEID: OK`;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
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

if (eng) { // CHROME
    window['sendAwait'] = sendAwait;
    window['received'] = received;
} else { // NODEJS
    global['sendAwait'] = sendAwait;
    global['received'] = received;
}


