// let infMessageAction, retMessageAction
// infMessageAction = { 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc }
// retMessageAction = await messageAction(infMessageAction)
// console.log(retMessageAction)

let e = import.meta.url, ee = e
async function messageAction(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
        let { host, room, action, message, resWs, wsClients, wsClientLoc, } = inf
        let body = {}, retMessageSend, destination = `${host}/${room}`, infAdd = { 'title': 'Erro', 'type': '' }

        if (action.toLowerCase() == globalWindow.par1.toLowerCase()) {
            // ### WSCLIENTS [→ EC2] (ACTION)
            let resClients = Object.keys(wsClients.rooms)
                .filter(sala => sala.includes(host)).map(sala => ({ 'sala': sala, 'qtd': wsClients.rooms[sala].size }));
            let dH = dateHour().res; resClients.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` }); infAdd.type = 'text'; infAdd.title = `Clients`
            body = { 'ret': true, 'res': { 'retWs': { 'ret': true, 'res': `OK | CLIENTS:\n\n${JSON.stringify(resClients)}` } } }
        } else if (action.toLowerCase() == globalWindow.par3.toLowerCase()) {
            // ### RESET [→ TODA A SALA] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Reset (AnyDesk e Pm2)`
            message = {
                'fun': [
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': false, 'command': `notepad`
                        }

                    },
                    // {
                    //     'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F`
                    //     }

                    // },
                    // {
                    //     'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': true, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe" --restart-service`
                    //     }
                    // },
                    // {
                    //     'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': false, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe"`
                    //     }
                    // },
                    // {
                    //     'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'log', 'par': {
                    //         'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET'
                    //     }
                    // },
                    // {
                    //     'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': false, 'command': `"!letter!:/ARQUIVOS/PROJETOS/WebSocket/src/z_OutrosWebSocket/z_RestartAll.lnk"`
                    //     }
                    // },
                ]
            }
        } else if (action.toLowerCase() == globalWindow.par4.toLowerCase()) {
            // ### CHATGPT [SOMENTE EC2] (ACTION)
        } else if (action.toLowerCase() == globalWindow.par5.toLowerCase()) {
            // ### API [SOMENTE EC2] (ACTION)
        } else if (action.toLowerCase() == globalWindow.par8.toLowerCase()) {
            // ### WEBFILE [→ TODA A SALA] (ACTION)
            let path = message.length < 3 ? `!letter!:/` : message.includes('z/w/a/b/c/d') ? `!letter!:/` : message
            infAdd.type = 'array'; infAdd.title = `WebFiles`; infAdd['path'] = path
            message = {
                'fun': [
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'file', 'par': {
                            'action': 'isFolder', 'max': 1000, 'functionLocal': false, 'path': path, 'listRead': true
                        }
                    }
                ]
            }
        } else if (action.toLowerCase() == globalWindow.par9.toLowerCase()) {
            // ### SCREENSHOT [→ TODA A SALA] path.match(/\.(jpg|jpeg|png|ico)$/) (ACTION)
            infAdd.type = 'image'; infAdd.title = `screenshot`
            let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshot.png`
            message = {
                'fun': [
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `nircmd savescreenshot "${path}"`
                        }
                    },
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'file', 'par': {
                            'action': 'read', 'functionLocal': false, 'path': `${path}`
                        }
                    },
                ]
            };
        } else if (action.toLowerCase() == globalWindow.par10.toLowerCase()) {
            // ### LOOP [→ TODA A SALA '..._NODEJS'] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Loop`
            let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/Registros/Loop/${time1}/${time.hou}.00-${time.hou}.59`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
            message = {
                'fun': [
                    { // CRIAR PADRÃO DE PASTA
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'file', 'par': {
                            'action': 'write', 'functionLocal': false, 'path': `${path}/#_Z_#.txt`, 'rewrite': true, 'text': `${time2}\n`
                        }
                    },
                    { // SCREENSHOT (MANTER awaitFinish 'true' DO CONTRÁRIO O NIRCMD ABRE O POPUP)
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `nircmd savescreenshot "${path}/${time2}_screenshot.png"`
                        }
                    },
                ]
            }
        } else {
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `OUTRO TIPO DE AÇÃO/MENSAGEM` });
            infAdd.type = 'text'; infAdd.title = `Nada`
        }

        // ENVIAR COMANDO(s)
        if (typeof message === 'object' || message !== '') {
            retMessageSend = await messageSend({ 'destination': destination, 'message': message, 'resWs': wsClientLoc, 'secondsAwait': 0, });
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(retMessageSend)}` });
            body = !retMessageSend.res ? retMessageSend : { 'ret': retMessageSend.ret, 'msg': retMessageSend.msg, 'res': JSON.parse(retMessageSend.res) }
        }

        // ENVIAR RETORNO HTTP
        infAdd.type = body?.res?.retWs?.ret ? infAdd.type : 'text'
        body = body?.res?.retWs?.ret ? body.res.retWs.res ? body.res.retWs.res : 'AÇÃO EXECUTADA COM SUCESSO' : `${JSON.stringify(message).includes('"retInf":true') ? `ERRO AO EXECUTAR AÇÃO!\n\n${JSON.stringify(body)}` : 'AÇÃO EXECUTADA COM SUCESSO'}`
        await html({ 'e': e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd })

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`

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
    window['messageAction'] = messageAction;
} else { // NODEJS
    global['messageAction'] = messageAction;
}