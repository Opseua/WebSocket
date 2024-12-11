// let infHtml, retHtml, infAdd = { 'title': 'Erro', 'type': '' }
// retHtml = await html({ e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd }); console.log(retHtml)

let e = import.meta.url, ee = e;
async function html(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { room, infAdd = {}, body, headers = {}, server: res, } = inf;

        function setData(txt) { return txt.substring(8, 10) + "/" + txt.substring(5, 7) + "/" + txt.substring(0, 4) + " " + txt.substring(11, 13) + ":" + txt.substring(14, 16) + ":" + txt.substring(17, 19); }

        // DEFINIR PÁGINAS DINÂMICAS
        if (!gW.pages) {
            let retFile; retFile = await file({ e, 'action': 'list', 'functionLocal': false, 'path': './src/pages', 'max': 10 }); if (!retFile.ret) { retFile['res'] = [] }; let retFileNew = []
            for (let [index, v] of retFile.res.entries()) { if (v.path.includes('.html')) { retFile = await file({ e, 'action': 'read', 'path': v.path }); if (retFile.ret) { retFileNew.push(retFile.res) } } };
            if (retFileNew.length > 0) { gW.pages = retFileNew };
        }

        // HTML | PERMITIR CORS
        let bodyHtml = `
        <!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <style> body { background-color: #17191A; color: white; } a:link, a:visited, a:hover, a:active { color: #66b2ff; text-decoration: none; } </style>
         <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>WebSocket</title> </head> <body> ###REPLACE###
        <script> document.addEventListener('keydown',function(event){if(event.key === 'Escape'){history.back()}}) </script> </body> </html>`;
        res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', '*'); res.setHeader('Access-Control-Allow-Headers', '*'); res.setHeader('Access-Control-Allow-Credentials', 'true');

        function resBody(inf = {}) {
            let { body, type, pathFile, } = inf; let p = pathFile; let writeHead = {};
            if (['txt', 'download'].includes(type)) {
                // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                if (['download'].includes(type)) { writeHead['Content-Disposition'] = `attachment; filename="${p || 'arquivo.txt'}"`; }; type = 'text/html; charset=utf-8';
            } else if (['obj', 'arr'].includes(type)) {
                // res.writeHead(200, { 'Content-Type': 'application/json' });
                type = 'application/json'; body = JSON.stringify(body, null, 2);
            } else if (['img',].includes(type)) {
                // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                type = 'image/jpeg'; body = Buffer.from(body);
            } else if (['base64',].includes(type)) {
                type = false; body = bodyHtml.replace('###REPLACE###', `<img src="data:image/png;base64,${Buffer.from({ 'type': 'Buffer', 'data': body }).toString('base64')}" alt="Imagem">`).replace('WebSocket', `${p}`);
            } else {
                type = false
            }; if (type) { writeHead['Content-Type'] = type; res.writeHead(200, writeHead); }; res.end(body);
        }

        if (headers.raw && infAdd.type !== 'download') {
            // ### [RAW]
            if (['obj', 'arr'].includes(infAdd.type)) { // (OBJ/ARR)
                let loc = infAdd.path; let type = (loc && loc.includes('/src/') && loc.includes('.json')) ? 'txt' : infAdd.type; resBody({ 'type': type, 'body': type == 'txt' ? 'ARQUIVO PROTEGIDO!' : body });
            } else if (body.ret === false) { // [FALSE]
                resBody({ 'type': 'obj', 'body': body });
            } else {
                if (!body.res) { // [TRUE]
                    resBody({ 'type': 'txt', 'body': 'Ação executada com sucesso!' });
                } else if (['txt'].includes(infAdd.type)) { // (TXT)
                    resBody({ 'type': 'txt', 'body': body.res });
                } else if (['img'].includes(infAdd.type)) { // (IMG)
                    resBody({ 'type': 'img', 'body': body.res });
                }
            }
        } else {
            // ### [RENDERIZAR]
            if (body.ret === false) { // [FALSE]
                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao executar ação!\n\n${JSON.stringify(body, null, 2)}</pre>`).replace('WebSocket', `${infAdd.title}`) });
            } else if (['obj',].includes(infAdd.type)) { // (OBJ)
                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Ação executada com sucesso!\n\n${JSON.stringify(body, null, 2)}</pre>`).replace('WebSocket', `${infAdd.title}`) });
            } else if (['txt'].includes(infAdd.type)) { // (TXT)
                if (body.res.startsWith('page') && body.res.endsWith('.html')) {
                    let page = Number(body.res.replace('page', '').replace('.html', '')); if (Array.isArray(gW.pages) && gW.pages[page]) {
                        // PÁGINA DINÂMICA
                        resBody({ 'type': 'txt', 'body': gW.pages[page] });
                    } else {
                        resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao executar ação!\n\nPágina não encontrada</pre>`).replace('WebSocket', `${infAdd.title}`) });
                    }
                } else {
                    resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>${body.res}</pre>`).replace('WebSocket', `${infAdd.title}`) });
                }
            } else if (['arr', 'img'].includes(infAdd.type)) { // (ARR)
                let retFile = body.res; let path = infAdd.path; let pathFile;
                if (path) { if (path.length > 3) { pathFile = path.lastIndexOf("/"); pathFile = path.substring(pathFile + 1) } else { pathFile = path.replace('/', '') } }; if (Array.isArray(retFile)) {
                    let tableHtml = '', link = '', tipoEstilo = ''; try {
                        let qtdFolder = 0, qtdFile = 0; for (let item of retFile) { if (item.isFolder) { qtdFolder++ } else { qtdFile++ } }
                        tableHtml += '<table border="1"><tr>'; tableHtml += `<th style="width: 95px; text-align: center;">TAMANHO</th>`; tableHtml += `<th style="width: 150px; text-align: center;">MODIFICAÇÃO</th>`;
                        tableHtml += `<th style="width: 260px; text-align: center;">MD5</th>`; tableHtml += `<th style="width: 80px; text-align: center;">TIPO</th>`;
                        tableHtml += `<th style="width: 65%; text-align: center;">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`; tableHtml += '</tr>'; for (let item of retFile) {
                            link = `<a href="/?act=${gW.par8}&roo=${room}&mes=${encodeURIComponent(encodeURIComponent(item.path))}">${item.path.replace(`/${item.name}`, '')}</a>`;
                            tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'; let dataFormatada = item.edit ? setData(item.edit) : '';
                            tableHtml += `<tr>`; tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`; tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
                            tableHtml += `<td style="text-align: center;">${item.md5 || ''}</td>`; tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                            tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;${item.name || ''}&nbsp;</td>`; tableHtml += `</tr>`;
                        }; tableHtml += '</table>'; resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', tableHtml).replace('WebSocket', `${pathFile}`) });
                    } catch (catchErr) { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao listar arquivos: ${catchErr.message}</pre>`) }); };
                } else {
                    try {
                        if (path && path.includes('/src/') && path.includes('.json')) {
                            resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>ARQUIVO PROTEGIDO!</pre>`) });
                        } else {
                            let resultado = retFile; if (infAdd.type == 'img' || path.match(/\.(jpg|jpeg|png|ico)$/)) {
                                resBody({ 'type': 'base64', 'body': resultado.data, 'pathFile': infAdd.title, });
                            } else {
                                resultado = resultado.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>${resultado}</pre>`).replace('WebSocket', `${pathFile}`) });
                            }
                        }
                    } catch (catchErr) { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao exibir arquivo: ${catchErr.message}</pre>`) }); esLintIgnore = catchErr; }
                }
            } else if (['download',].includes(infAdd.type)) { // (DOWNLOAD)
                resBody({ 'type': 'download', 'body': body.res, 'pathFile': infAdd.title, });
            }
        }

        ret['ret'] = true;
        ret['msg'] = `HTML: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret }), ...(ret.msg && { 'msg': ret.msg }), ...(ret.res && { 'res': ret.res }), };
};

// CHROME | NODEJS
(eng ? window : global)['html'] = html;