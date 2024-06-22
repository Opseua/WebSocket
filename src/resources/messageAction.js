// let infMessageAction, retMessageAction
// infMessageAction = { 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc }
// retMessageAction = await messageAction(infMessageAction); console.log(retMessageAction)

let e = import.meta.url, ee = e;
async function messageAction(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`; let { host, room, action, message, resWs, wsClients, wsClientLoc, } = inf
        let body = {}, retMessageSend, infAdd = { 'title': 'Erro', 'type': '' }, destination = inf.destination ? inf.destination : `${host}/?roo=${room}`

        if (action.toLowerCase() == globalWindow.par1.toLowerCase()) {
            // ### WSCLIENTS [→ EC2] (ACTION)
            let resClients = Object.keys(wsClients.rooms).filter(sala => sala.includes(host)).map(sala => ({ 'sala': sala, 'qtd': wsClients.rooms[sala].size }));
            let dH = dateHour().res; resClients.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` }); infAdd.type = 'text'; infAdd.title = `Clients`
            body = { 'ret': true, 'res': `${resWs.method} - OK | CLIENTS:\n\n${JSON.stringify(resClients, null, 2)}` }
        } else if (action.toLowerCase() == globalWindow.par3.toLowerCase()) {
            // ### RESET [→ TODA A SALA] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Reset (AnyDesk e Pm2)`
            message = {
                'fun': [
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F`
                        }

                    },
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe" --restart-service`
                        }
                    },
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': false, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe"`
                        }
                    },
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': false, 'command': `"%fileChrome_Extension%\\src\\scripts\\BAT\\z_AllRestart.lnk"`
                        }
                    },
                ]
            }
        } else if (action.toLowerCase() == globalWindow.par4.toLowerCase()) {
            // ### CHAT [SOMENTE EC2] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Erro | Chat`;
            if (!(message !== '')) {
                let errBody = `Informar os parametros!`
                body = `${errBody}\n\n→ &mes={"provider":"globalgpt","input":"Qual a idade de Marte?"}\n\n→ &mes={"provider":"open.ai","input":"Qual a idade de Marte?"}`
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` });
            } else {
                try {
                    infAdd.title = `Chat`; message = JSON.parse(message); let retChat = await chat({ 'e': e, ...message }); body = retChat
                } catch (catchErr) {
                    let errBody = `Erro ao fazer parse dos parametros!\n\n${message}`; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); body = `${errBody}`
                }
            }; message = '';
        } else if (action.toLowerCase() == globalWindow.par5.toLowerCase()) {
            // ### API [SOMENTE EC2] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Erro | API`;
            if (!(message !== '')) {
                let errBody = `Informar os parametros!`
                body = `${errBody}\n\n→ &mes={"method":"POST","url":"https://ntfy.sh/AAAAAAAAAAA","headers":{"Content-Type":"application/json"},"body":{"aaa":"bbb"},"max":10}`
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` });
            } else {
                try {
                    infAdd.title = `API`; message = JSON.parse(message); let retApi = await api({ 'e': e, ...message });
                    if (retApi.res) { retApi['res'] = JSON.stringify(retApi.res, null, 2) }; body = retApi
                } catch (catchErr) {
                    let errBody = `Erro ao fazer parse dos parametros!\n\n${message}`; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); body = `${errBody}`
                }
            }; message = '';
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
            infAdd.type = 'image'; infAdd.title = `screenshot`; let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshot.png`
            message = {
                'fun': [
                    {
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}"`
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
            // ### LOOP [→ TODA A SALA '...-NODEJS-...'] (ACTION)
            infAdd.type = 'text'; infAdd.title = `Loop`
            let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/Registros/${time1}/${time.hou}.00-${time.hou}.59`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
            message = {
                'fun': [
                    { // CRIAR PADRÃO DE PASTA
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'file', 'par': {
                            'action': 'write', 'functionLocal': false, 'path': `${path}/#_Z_#.txt`, 'rewrite': true, 'text': `${time2}\n`
                        }
                    },
                    { // SCREENSHOT (MANTER awaitFinish 'true' DO CONTRÁRIO O NIRCMD ABRE O POPUP)
                        'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}/${time2}_screenshot.png"`
                        }
                    },
                ]
            }
        } else {
            try {
                infAdd.type = 'text'; infAdd.title = `Outro tipo de ação/mensagem`; message = JSON.parse(message); message = message.message ? message.message : message
            } catch (catchErr) {
                infAdd.type = 'text'; infAdd.title = `Erro`; let errBody = `Erro ao fazer parse da mensagem!\n\n${message}`
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); message = ''
            }
        }

        // ENVIAR COMANDO(s)
        if (typeof message === 'object' || message !== '') {
            retMessageSend = await messageSend({ 'destination': destination, 'messageId': true, 'message': message, 'resWs': wsClientLoc, 'secondsAwait': 0, });
            // logConsole({ 'e': e, 'ee': ee, 'write': false, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(retMessageSend)}` });
            let bodyRes = infAdd.title.includes(`Outro tipo de ação/mensagem`) ? JSON.stringify(retMessageSend.res, null, 2) : retMessageSend.res
            body = !retMessageSend.res ? retMessageSend : { 'ret': retMessageSend.ret, 'msg': retMessageSend.msg, 'res': bodyRes }
        }

        // ENVIAR RETORNO HTTP (SE NECESSÁRIO)
        if (resWs) {
            infAdd.type = body?.res ? infAdd.type : 'text'; let bodyBrowser = typeof body === 'object' ? JSON.stringify(body, null, 2) : body
            body = body.ret && body.res ? body.res : body.ret ? `AÇÃO EXECUTADA COM SUCESSO\n\n${bodyBrowser}` : `ERRO AO EXECUTAR AÇÃO!\n\n${bodyBrowser}`
            await html({ 'e': e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd })
        }

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res
    }; return { ...({ ret: ret.ret }), ...(ret.msg && { msg: ret.msg }), ...(ret.res && { res: ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['messageAction'] = messageAction;