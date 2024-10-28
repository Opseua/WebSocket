// let infMessageAction, retMessageAction
// infMessageAction = { 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc }
// retMessageAction = await messageAction(infMessageAction); console.log(retMessageAction)

let e = import.meta.url, ee = e;
async function messageAction(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    try {
        let time = dateHour().res, time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`; let { host, room, action, message, resWs, wsClients, wsClientLoc, headers } = inf
        let body = {}, retMessageSend, infAdd = { 'title': 'Erro', 'type': '' }, destination = inf.destination ? inf.destination : `${host}/?roo=${room}`

        if (action.toLowerCase() == globalWindow.par1.toLowerCase()) {
            // ### WSCLIENTS [→ EC2] (ACTION)
            let resClients = Object.keys(wsClients.rooms).filter(sala => sala.includes(host)).map(sala => ({ 'sala': sala, 'qtd': wsClients.rooms[sala].size }));
            let dH = dateHour().res; resClients.unshift({ 'hour': `${dH.hou}:${dH.min}:${dH.sec}` }); infAdd.type = 'obj'; infAdd.title = `Clients`; body = { 'ret': true, 'msg': 'CLIENTS: OK', 'res': resClients }
        } else if (action.toLowerCase() == globalWindow.par3.toLowerCase()) {
            // ### RESET [→ TODA A SALA] (ACTION)
            infAdd.type = 'txt'; infAdd.title = `Reset (AnyDesk + Server's)`; message = {
                'fun': [{ 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F` } },
                { 'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': "\"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe\" --restart-service" } },
                { 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': "\"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe\"" } },
                { 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': "\"%fileChrome_Extension%\\src\\scripts\\BAT\\z_AllRestart.lnk\"" } },]
            }
        } else if (action.toLowerCase() == globalWindow.par4.toLowerCase()) {
            // ### CHAT [SOMENTE EC2] (ACTION)
            infAdd.type = 'txt'; infAdd.title = `Erro | Chat`; if (!(message !== '')) {
                let errBody = `Informar os parametros!`; body = `${errBody}\n\n→ &mes={"provider":"globalgpt","input":"Qual a idade de Marte?"}\n\n→ &mes={"provider":"openAi","input":"Qual a idade de Marte?"}`
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` });
            } else {
                try { infAdd.title = `Chat`; message = JSON.parse(message); let retChat = await chat({ 'e': e, ...message }); body = retChat }
                catch (catchErr) { let errBody = `Erro ao fazer parse dos parametros!\n\n${message}`; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); body = `${errBody}`; esLintIgnore = catchErr; }
            }; message = '';
        } else if (action.toLowerCase() == globalWindow.par5.toLowerCase()) {
            // ### API [SOMENTE EC2] (ACTION)
            infAdd.type = 'txt'; infAdd.title = `Erro | API`; if (!(message !== '')) {
                let errBody = `Informar os parametros!`; body = `${errBody}\n\n→ &mes={"method":"POST","url":"https://www.google.com","headers":{"Content-Type":"application/json"},"body":{"aaa":"bbb"},"max":10}`
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` });
            } else {
                try { infAdd.title = `API`; message = JSON.parse(message); let retApi = await api({ 'e': e, ...message }); if (retApi.res) { retApi['res'] = JSON.stringify(retApi.res, null, 2) }; body = retApi }
                catch (catchErr) { let errBody = `Erro ao fazer parse dos parametros!\n\n${message}`; logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); body = `${errBody}`; esLintIgnore = catchErr; }
            }; message = '';
        } else if (action.toLowerCase() == globalWindow.par8.toLowerCase()) {
            // ### WEBFILE [→ TODA A SALA] (ACTION)
            let path = message.length < 3 || (message.includes('!le') && message.length < 10) || message.includes('a/b/c/d') ? `!letter!:/` : message;
            infAdd.type = path.match(/\.(jpg|jpeg|png|ico)$/) ? 'img' : 'arr'; infAdd.title = `WebFiles`; infAdd['path'] = path; message = {
                'fun': [{ 'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'isFolder', 'max': 1000, 'functionLocal': false, 'path': path, 'listRead': true } }]
            }
        } else if (action.toLowerCase() == globalWindow.par9.toLowerCase()) {
            // ### SCREENSHOT [→ TODA A SALA] path.match(/\.(jpg|jpeg|png|ico)$/) (ACTION)
            infAdd.type = 'img'; infAdd.title = `screenshot`; let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/screenshot.png`; message = {
                'fun': [{ 'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}"` } },
                { 'securityPass': globalWindow.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'read', 'functionLocal': false, 'path': `${path}` } },]
            };
        } else if (action.toLowerCase() == globalWindow.par10.toLowerCase()) {
            // ### LOOP [→ TODA A SALA '...-NODEJS-...'] (ACTION)
            infAdd.type = 'txt'; infAdd.title = `Loop`; let path = `!letter!:/ARQUIVOS/PROJETOS/WebSocket/log/Registros/${time1}/${time.hou}.00-${time.hou}.59`, time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`; message = {
                'fun': [{ // CRIAR PADRÃO DE PASTA
                    'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'file', 'par': { 'action': 'write', 'functionLocal': false, 'path': `${path}/#_Z_#.txt`, 'rewrite': true, 'text': `${time2}\n` }
                }, { // SCREENSHOT (MANTER awaitFinish 'true' DO CONTRÁRIO O NIRCMD ABRE O POPUP)
                    'securityPass': globalWindow.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}/${time2}_screenshot.png"` }
                },]
            }
        } else if (action.toLowerCase() == globalWindow.par11.toLowerCase()) {
            // ### GET SECURITYPASS (SOMENTE NO 'LOC')
            infAdd.type = 'txt'; infAdd.title = `GET Security Pass`; body = { 'ret': true, 'res': resWs.locWeb == '[LOC]' ? globalWindow.securityPass : `ERRO | AÇÃO PERMITIDA APENAS NA '[LOC]'` }
        } else if (action.toLowerCase() == globalWindow.par12.toLowerCase()) {
            // ### PAGE
            infAdd.type = 'txt'; infAdd.title = `Page`; body = { 'ret': true, 'res': `page${message}.html` }; message = ''
        } else {
            // ### OUTRO TIPO DE AÇÃO/MENSAGEM 
            try { infAdd.type = 'obj'; infAdd.title = `Outro tipo de ação/mensagem`; message = JSON.parse(message); message = message.message ? message.message : message } catch (catchErr) {
                infAdd.type = 'obj'; infAdd.title = `Erro`; let errBody = `Erro ao fazer parse da mensagem!\n\n${message}`;
                logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `${errBody}` }); message = ''; esLintIgnore = catchErr; body = { 'ret': false, 'msg': errBody }
            }
        }

        // ENVIAR COMANDO(s)
        if (typeof message === 'object' || message !== '') {
            retMessageSend = await messageSend({ 'destination': destination, 'messageId': true, 'message': message, 'resWs': wsClientLoc, 'secondsAwait': 0, }); body = retMessageSend
            // logConsole({ 'e': e, 'ee': ee, 'write': true, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(body)}` });
        }

        // ENVIAR RETORNO HTTP (SE NECESSÁRIO)
        if (resWs) {
            await html({ 'e': e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd, 'method': resWs.method, 'headers': headers, })
        }

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res;
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['messageAction'] = messageAction;