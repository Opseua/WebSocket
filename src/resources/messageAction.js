// let infMessageAction, retMessageAction;
// infMessageAction = { 'host': host, 'room': room, 'action': action, 'message': message, 'resWs': res, 'wsClients': wsClients, 'wsClientLoc': wsClientLoc, };
// retMessageAction = await messageAction(infMessageAction); console.log(retMessageAction);

let e = currentFile(new Error()), ee = e;
async function messageAction(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { host, room, action, message, resWs, wsClients, wsClientLoc, destination, } = inf;

        let { yea, mon, day, hou, min, sec, mil, monNam, } = dateHour().res, time1 = `ANO_${yea}/MES_${mon}_${monNam}/DIA_${day}`, time2 = `${hou}.${min}.${sec}.${mil}`;
        let body = { 'ret': false, }, infAdd = { 'title': 'Erro', 'type': '', }; destination = destination || `${host}/?roo=${room}`;

        if (action.toLowerCase() === gW.par1.toLowerCase()) {
            // ### (ACTION) WSCLIENTS
            infAdd.type = 'obj'; infAdd.title = `Clients`; try {
                let dH = dateHour().res, resClients = [{ 'hour': `${dH.hou}:${dH.min}:${dH.sec}`, },]; resClients = [...resClients, ...Object.keys(wsClients.rooms).filter(sala => sala.includes(host))
                    .map(sala => ({ sala, ...Array.from(wsClients.rooms[sala]).reduce((acc, ws, index) => { acc[`_${index + 1}`] = `${ws.dateHour}`; return acc; }, {}), })),];
                body['ret'] = true; body['msg'] = `CLIENTS: OK`; body['res'] = resClients;
            } catch { body['msg'] = `CLIENTS: ERRO | AO PEGAR CLIENTES`; }
        } else if (action.toLowerCase() === gW.par2.toLowerCase()) {
            // ### (ACTION) RESTART (+AnyDesk) [→ TODA A SALA]
            infAdd.type = 'obj'; infAdd.title = `Restart (Server's + AnyDesk)`; let securityPass = gW.securityPass; message = {
                'fun': [{ securityPass, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `taskkill /IM AnyDesk.exe /F`, }, }, // ← NÃO POR ENTRE ASPAS!!!
                { securityPass, 'retInf': true, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe" --restart-service`, }, },
                { securityPass, 'name': 'commandLine', 'par': { 'command': `"C:\\Program Files (x86)\\AnyDesk\\AnyDesk.exe"`, }, },
                { securityPass, 'name': 'commandLine', 'par': { 'command': `%fileWindows%\\BAT\\RECORRENTES\\zz_RUN_ADM.vbs %fileExtension%\\src\\scripts\\BAT\\z_COMMANDS.bat ATALHO_RESTART_`, }, },],
            };
        } else if (action.toLowerCase() === gW.par4.toLowerCase()) {
            // ### (ACTION) API
            infAdd.type = 'obj'; infAdd.title = `API`; try {
                if (message !== '') { let retApi = await api({ e, 'object': true, ...JSON.parse(message), }); body = retApi; }
                else { body['msg'] = `API: ERRO | INFORMAR OS PARAMETROS\n\n→ &mes={"method":"POST","url":"https://www.google.com","headers":{"Content-Type":"application/json"},"body":{"aaa":"bbb"},"maxConnect":10}`; }
            } catch { body['msg'] = `API: ERRO | AO FAZER PARSE`; }
        } else if (action.toLowerCase() === gW.par5.toLowerCase()) {
            // ### (ACTION) WEBFILE [→ TODA A SALA]
            let path = message.length < 3 || (message.includes('!le') && message.length < 10) || message.includes('a/b/c/d') ? `!letter!:/` : message; infAdd.type = 'arr'; infAdd.title = `WebFiles`; infAdd['path'] = path;
            message = { 'fun': [{ 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'isFolder', 'max': 1000, path, 'listRead': true, }, },], };
        } else if (action.toLowerCase() === gW.par6.toLowerCase()) {
            // ### (ACTION) SCREENSHOT [→ TODA A SALA]
            infAdd.type = 'arr'; infAdd.title = `screenshot`; let path = `!fileProjetos!/${gW.project}/logs/screenshot.png`; infAdd['path'] = path; message = {
                'fun': [{ 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}"`, }, },
                { 'securityPass': gW.securityPass, 'retInf': true, 'name': 'file', 'par': { 'action': 'read', path, }, },],
            };
        } else if (action.toLowerCase() === gW.par7.toLowerCase()) {
            // ### (ACTION) LOOP [→ TODA A SALA '...-NODE-...'] | CRIAR PADRÃO DE PASTA | SCREENSHOT (MANTER awaitFinish 'true' DO CONTRÁRIO O NIRCMD ABRE O POPUP)
            infAdd.type = 'obj'; infAdd.title = `Loop`; let path = `!fileProjetos!/${gW.project}/logs/Registros/${time1}/${hou}.00-${hou}.59`; message = {
                'fun': [{ 'securityPass': gW.securityPass, 'retInf': false, 'name': 'file', 'par': { 'action': 'write', 'path': `${path}/#_Z_#.txt`, 'content': `${path}\n`, 'add': true, }, },
                { 'securityPass': gW.securityPass, 'retInf': false, 'name': 'commandLine', 'par': { 'awaitFinish': true, 'command': `%nircmd% savescreenshot "${path}/${time2}-screenshot.png"`, }, },],
            };
        } else if (action.toLowerCase() === gW.par8.toLowerCase()) {
            // ### (ACTION) GET SECURITYPASS (SOMENTE NO 'LOC')
            infAdd.type = 'obj'; infAdd.title = `GET Security Pass`; if (resWs.locWeb === '[LOC]') { body['ret'] = true; body['msg'] = `GET SECURITYPASS: OK`; body['res'] = gW.securityPass; }
            else { body['msg'] = `GET SECURITYPASS: ERRO | AÇÃO PERMITIDA APENAS NA '[LOC]'`; }
        } else {
            // ### (MENSAGEM) OUTRO TIPO DE AÇÃO/MENSAGEM 
            infAdd.type = 'obj'; infAdd.title = `Outro tipo de ação/mensagem`; try {
                message = JSON.parse(message); message = message.message || message;
                if (!(message.fun && Array.isArray(message.fun))) { body['msg'] = `OUTRO TIPO DE AÇÃO: ERRO | CHAVE 'fun' NÃO ENCONTRADA OU NÃO É ARRAY`; message = ''; }
            } catch { body['msg'] = `OUTRO TIPO DE AÇÃO: ERRO | AO FAZER PARSE/MENSAGEM VAZIA`; message = ''; }
        }

        if (typeof message === 'object') { // ENVIAR COMANDO(s)
            body = await messageSend({ destination, message, 'resWs': wsClientLoc, });
        }

        if (!body.ret && !(resWs?.urlParams?.bypass === 'all')) { // ERRO AO EXECUTAR AÇÃO
            logConsole({ e, ee, 'txt': `${JSON.stringify(body, null, 2)}`, });  // (NO URL)    &bypass=all → SEM ERRO NO LOG E NA NOTIFICAÇÃO | &bypass=not → SEM ERRO NA NOTIFICAÇÃO
            if (!(resWs?.urlParams?.bypass === 'not')) { notification({ e, 'title': `# FALSE (${gW.devMaster}) [NODE]`, 'text': `→ messageAction {${gW.project}}\n${body.msg.substring(0, 300)}`, 'ignoreErr': true, }); }
        }

        if (resWs) { await html({ e, 'server': resWs, body, room, infAdd, }); } // ENVIAR RETORNO HTTP (SE NECESSÁRIO)

        ret['ret'] = true;
        ret['msg'] = `ACTIONS: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['messageAction'] = messageAction;


