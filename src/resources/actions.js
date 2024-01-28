let e = import.meta.url;
async function actions(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; let retRegexE = await regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`
        let method = inf.method
        let room = inf.room == `all` ? '_NODEJS' : inf.room
        let rooms = inf.rooms
        let action = inf.action
        let message = inf.message
        let server = inf.server
        let infAdd = { 'title': 'Erro', 'type': '' }
        let body, infReceivedSendAwait, retReceivedSendAwait

        if (action.toLowerCase() == par1.toLowerCase()) {
            // ### WSCLIENTS [SOMENTE EC2]
            let resClients = Object.keys(rooms).map(r => ({ 'sala': r, 'qtd': rooms[r].size }));
            let dH = dateHour().res; resClients.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` });
            infAdd.type = 'text'; infAdd.title = `Clients`
            body = { 'ret': true, 'res': { 'retWs': { 'ret': true, 'res': `OK | CLIENTS:\n\n${JSON.stringify(resClients)}` } } }
        } else if (action.toLowerCase() == par3.toLowerCase()) {
            // ### RESET [PARA O CLIENTE DO URL]
            infAdd.type = 'text'; infAdd.title = `Reset (AnyDesk e Pm2)`
            message = {
                'fun': [
                    {
                        'securityPass': securityPass, 'retInf': 'ID_AQUI', 'name': 'commandLine', 'par': {
                            // 'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F`
                            'awaitFinish': true, 'command': `notepad`
                        }

                    },
                    // {
                    //     'securityPass': securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': true, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe" --restart-service`
                    //     }
                    // },
                    // {
                    //     'securityPass': securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': false, 'command': `"C:/Program Files (x86)/AnyDesk/AnyDesk.exe"`
                    //     }
                    // },
                    // {
                    //     'securityPass': securityPass, 'retInf': false, 'name': 'log', 'par': {
                    //         'folder': 'JavaScript', 'path': `log.txt`, 'text': 'RESET'
                    //     }
                    // },
                    // {
                    //     'securityPass': securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                    //         'awaitFinish': false, 'command': `"!letter!:/ARQUIVOS/PROJETOS/WebSocket/src/z_OutrosWebSocket/z_RestartAll.lnk"`
                    //     }
                    // },
                ]
            }
        } else if (action.toLowerCase() == par4.toLowerCase()) {
            // ### CHATGPT [SOMENTE EC2]
        } else if (action.toLowerCase() == par5.toLowerCase()) {
            // ### API [SOMENTE EC2]
        } else if (action.toLowerCase() == par8.toLowerCase()) {
            // ### WEBFILE [PARA O CLIENTE DO URL]
            let path = message.length < 3 ? `!letter!:/` : message.includes('z/w/a/b/c/d') ? `!letter!:/` : message
            infAdd.type = 'array'; infAdd.title = `WebFiles`; infAdd['path'] = path
            message = {
                'fun': [
                    {
                        'securityPass': securityPass, 'retInf': 'ID_AQUI', 'name': 'file', 'par': {
                            'action': 'isFolder', 'max': 1000, 'functionLocal': false, 'path': path, 'listRead': true
                        }
                    }
                ]
            }
        } else if (action.toLowerCase() == par9.toLowerCase()) {
            // ### SCREENSHOT [PARA O CLIENTE DO URL] path.match(/\.(jpg|jpeg|png|ico)$/)
            infAdd.type = 'image'; infAdd.title = `screenshot`
            let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshot.png`
            message = {
                'fun': [
                    {
                        'securityPass': securityPass, 'retInf': 'ID_AQUI', 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `nircmd savescreenshot "${path}"`
                        }
                    },
                    {
                        'securityPass': securityPass, 'retInf': 'ID_AQUI', 'name': 'file', 'par': {
                            'action': 'read', 'functionLocal': false, 'path': `${path}`
                        }
                    },
                ]
            };
        } else if (action.toLowerCase() == par10.toLowerCase()) {
            // ### LOOP [PARA TODOS OS CLIENTE '..._NODEJS']
            let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/Registros/Loop/${time1}/${time.hou}.00-${time.hou}.59`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`
            message = {
                'fun': [
                    { // CRIAR PADRÃO DE PASTA
                        'securityPass': securityPass, 'retInf': false, 'name': 'file', 'par': {
                            'action': 'write', 'functionLocal': false, 'path': `${path}/#_Z_#.txt`, 'rewrite': true, 'text': `${time2}\n`
                        }
                    },
                    { // SCREENSHOT
                        'securityPass': securityPass, 'retInf': false, 'name': 'commandLine', 'par': {
                            'awaitFinish': true, 'command': `nircmd savescreenshot "${path}/${time2}_screenshot.png"`
                        }
                    },
                ]
            }
            // ENVIAR PARA DISPOSITIVOS NO SERVIDOR ANTIGO
            callOld({ 'body': message })
        }

        // ENVIAR COMANDO(s)
        for (let roomSend in rooms) {
            if (roomSend.includes(room) && message.fun && message.fun.length > 0) {
                for (let [index, value] of message.fun.entries()) {
                    infReceivedSendAwait = {
                        'rooms': rooms, 'room': roomSend, 'message': { 'fun': [value] }, 'sender': null,
                        'server': server, 'awaitRet': value.retInf == 'ID_AQUI' ? true : false,
                    }
                    retReceivedSendAwait = await sendAwait(infReceivedSendAwait)
                    body = index == (message.fun.length - 1) ? retReceivedSendAwait : { 'ret': false }
                };
            }
        }

        // ENVIAR RETORNO HTTP
        if (method !== 'WEBSOCKET') {
            infAdd.type = body?.res?.retWs?.ret ? infAdd.type : 'text'
            body = body?.res?.retWs?.ret ? body.res.retWs.res ? body.res.retWs.res : 'Ação executada com sucesso!' : 'Erro ao executar ação!'
            html({ 'server': server, 'body': body, 'room': room, 'infAdd': infAdd })
        }

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }, retFile
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; retFile = await file(infFile);
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
    window['actions'] = actions;
} else { // NODEJS
    global['actions'] = actions;
}