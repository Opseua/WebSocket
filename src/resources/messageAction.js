// let infMessageAction, retMessageAction
// infMessageAction = { 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc }
// retMessageAction = await messageAction(infMessageAction); console.log(retMessageAction)

let e = import.meta.url, ee = e;
async function messageAction(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { host, room, action, message, resWs, wsClients, wsClientLoc, headers, destination, } = inf;

        let time = dateHour().res; let time1 = `MES_${time.mon}_${time.monNam}/DIA_${time.day}`; let time2 = `${time.hou}.${time.min}.${time.sec}.${time.mil}`;
        let body = { 'ret': false, }; let retMessageSend; let infAdd = { 'title': 'Erro', 'type': '', }; destination = destination || `${host}/?roo=${room}`;

        if (action.toLowerCase() === gW.par1.toLowerCase()) {
            // ### (ACTION) WSCLIENTS
            infAdd.type = 'obj'; infAdd.title = `Clients`; try {
                // let resClients = Object.keys(wsClients.rooms).filter(sala => sala.includes(host)).map(sala => ({ sala, 'qtd': wsClients.rooms[sala].size, })); resClients.unshift({ 'hour': `DATA_HORA` });
                let dH = dateHour().res; let resClients = [{ 'hour': `${dH.hou}:${dH.min}:${dH.sec}`, },]; resClients = [...resClients, ...Object.keys(wsClients.rooms).filter(sala => sala.includes(host))
                    .map(sala => ({ sala, ...Array.from(wsClients.rooms[sala]).reduce((acc, ws, index) => { acc[`_${index + 1}`] = `${ws.dateHour}`; return acc; }, {}), })),];
                body['ret'] = true; body['msg'] = `CLIENTS: OK`; body['res'] = resClients;
            } catch (catchErr) { esLintIgnore = catchErr; body['msg'] = `CLIENTS: ERRO | AO PEGAR CLIENTES`; };
        } else if (action.toLowerCase() === gW.par3.toLowerCase()) {
            // ### (ACTION) RESET [→ TODA A SALA]
            infAdd.type = 'obj'; infAdd.title = `Reset (AnyDesk + Server's)`; message = {
                'fun': [{ 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F`, }, }, // NÃO POR ENTRE ASPAS!!!
                { 'securityPass': gW.securityPass, 'retInf': true, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe" --restart-service`, }, },
                { 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': `"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe"`, }, },
                { 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': false, 'command': `"%fileChrome_Extension%\\src\\scripts\\BAT\\z_AllRestart.lnk"`, }, },],
            };
        } else if (action.toLowerCase() === gW.par4.toLowerCase()) {
            // ### (ACTION) CHAT
            infAdd.type = 'obj'; infAdd.title = `Chat`; try {
                if (message !== '') { let retChat = await chat({ e, ...JSON.parse(message), }); body = retChat; } else {
                    body['msg'] = `CHAT: ERRO | INFORMAR OS PARAMETROS
                    provider → *JS       [nextWay]: gpt-3.5-turbo / gpt-4o-free / gemini-pro   ###   [openAi]: gpt-4o-mini
                    provider → *PYTHON   [telegram]: gpt-4o   ###   [g4f]: gpt-4o   ###   [zukiJourney]: gpt-4   ###   [naga]: gpt-4
                    &mes={"provider":"nextWay","model":"gpt-3.5-turbo","input":"Qual a idade de Saturno"} `;
                }
            } catch (catchErr) { esLintIgnore = catchErr; body['msg'] = `CHAT: ERRO | AO FAZER PARSE`; };
        } else if (action.toLowerCase() === gW.par5.toLowerCase()) {
            // ### (ACTION) API
            infAdd.type = 'obj'; infAdd.title = `API`; try {
                if (message !== '') { let retApi = await api({ e, 'bodyObject': true, ...JSON.parse(message), }); body = retApi; }
                else { body['msg'] = `API: ERRO | INFORMAR OS PARAMETROS\n\n→ &mes={"method":"POST","url":"https://www.google.com","headers":{"Content-Type":"application/json"},"body":{"aaa":"bbb"},"max":10}`; }
            } catch (catchErr) { esLintIgnore = catchErr; body['msg'] = `API: ERRO | AO FAZER PARSE`; };
        } else if (action.toLowerCase() === gW.par8.toLowerCase()) {
            // ### (ACTION) WEBFILE [→ TODA A SALA]
            let path = message.length < 3 || (message.includes('!le') && message.length < 10) || message.includes('a/b/c/d') ? `!letter!:/` : message;
            infAdd.type = path.match(/\.(jpg|jpeg|png|ico)$/) ? 'img' : 'arr'; infAdd.title = `WebFiles`; infAdd['path'] = path;
            message = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'isFolder', 'max': 1000, 'functionLocal': false, path, 'listRead': true, }, },], };
        } else if (action.toLowerCase() === gW.par9.toLowerCase()) {
            // ### (ACTION) SCREENSHOT [→ TODA A SALA] path.match(/\.(jpg|jpeg|png|ico)$/)
            infAdd.type = 'img'; infAdd.title = `screenshot`; let path = `${fileProjetos}/WebSocket/log/screenshot.png`.replace(new RegExp(`${letter}:`, 'g'), `!letter!:`); message = {
                'fun': [{ 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}"`, }, },
                { 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'read', 'functionLocal': false, path, }, },],
            };
        } else if (action.toLowerCase() === gW.par10.toLowerCase()) {
            // ### (ACTION) LOOP [→ TODA A SALA '...-NODEJS-...']
            infAdd.type = 'obj'; infAdd.title = `Loop`; let path = `${fileProjetos}/WebSocket/log/Registros/${time1}/${time.hou}.00-${time.hou}.59`.replace(new RegExp(`${letter}:`, 'g'), `!letter!:`); message = {
                'fun': [{ // CRIAR PADRÃO DE PASTA
                    'securityPass': gW.securityPass, 'retInf': false, 'name': 'file', 'par': { 'action': 'write', 'functionLocal': false, 'path': `${path}/#_Z_#.txt`, 'rewrite': true, 'text': `${time2}\n`, },
                }, {  // SCREENSHOT (MANTER awaitFinish 'true' DO CONTRÁRIO O NIRCMD ABRE O POPUP)
                    'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}/${time2}_screenshot.png"`, },
                },],
            };
        } else if (action.toLowerCase() === gW.par11.toLowerCase()) {
            // ### (ACTION) GET SECURITYPASS (SOMENTE NO 'LOC')
            infAdd.type = 'obj'; infAdd.title = `GET Security Pass`; if (resWs.locWeb === '[LOC]') { body['ret'] = true; body['msg'] = `GET SECURITYPASS: OK`; body['res'] = gW.securityPass; }
            else { body['msg'] = `GET SECURITYPASS: ERRO | AÇÃO PERMITIDA APENAS NA '[LOC]'`; };
        } else if (action.toLowerCase() === gW.par12.toLowerCase()) {
            // ### (ACTION) PAGE
            infAdd.type = 'txt'; infAdd.title = `Page`; if (resWs.locWeb === '[LOC]') { body['ret'] = true; body['msg'] = `PAGE: OK`; body['res'] = `page${message}.html`; }
            else { body['msg'] = `PAGE: ERRO | AÇÃO PERMITIDA APENAS NA '[LOC]'`; };
        } else if (action.toLowerCase() === gW.par13.toLowerCase()) {
            // ### (ACTION) GET FILE PAC (DOWNLOAD)
            infAdd.type = 'download'; infAdd.title = `proxy.pac`; let retFile = await file({ e, 'action': 'read', 'path': `!letter!:/${gW.root}/Sniffer_Python/src/scripts/BAT/proxy.pac`, });
            if (!retFile.ret) { body['msg'] = `GET FILE [PAC]: ERRO | AO LER O ARQUIVO`; } else { body['ret'] = true; body['msg'] = `GET FILE [PAC]: OK`; body['res'] = retFile.res; };
        } else {
            // ### (MENSAGEM) OUTRO TIPO DE AÇÃO/MENSAGEM 
            infAdd.type = 'obj'; infAdd.title = `Outro tipo de ação/mensagem`; try {
                message = JSON.parse(message); message = message.message || message;
                if (!(message.fun && Array.isArray(message.fun))) { body['msg'] = `OUTRO TIPO DE AÇÃO: ERRO | CHAVE 'fun' NÃO ENCONTRADA OU NÃO É ARRAY`; message = ''; }
            } catch (catchErr) { esLintIgnore = catchErr; body['msg'] = `OUTRO TIPO DE AÇÃO: ERRO | AO FAZER PARSE`; message = ''; };
        }

        // ENVIAR COMANDO(s)
        if (typeof message === 'object') {
            retMessageSend = await messageSend({ destination, 'messageId': true, message, 'resWs': wsClientLoc, 'secondsAwaitA': 0, }); body = retMessageSend;
            // logConsole({ e, ee, 'write': true, 'msg': `RESPOSTA SENDO ESPERADA:\n${JSON.stringify(body)}` });
        } else if (!body.ret) {
            // ERRO AO EXECUTAR AÇÃO
            logConsole({ e, ee, 'write': true, 'msg': `${JSON.stringify(body, null, 2)}`, }); let { devMaster, project, } = gW;
            notification({ e, 'legacy': true, 'ntfy': true, 'title': `*** FALSE (${devMaster}) [${engName}]`, 'text': `→ messageAction {${project}}\n\n${JSON.stringify(body).substring(0, 300)}`, });
        }

        // ENVIAR RETORNO HTTP (SE NECESSÁRIO)
        if (resWs) {
            await html({ e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd, 'method': resWs.method, 'headers': headers, });
        }

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['messageAction'] = messageAction;