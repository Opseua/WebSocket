/* eslint-disable no-lonely-if */

// let infHtml, retHtml, infAdd = { 'title': 'Erro', 'type': '', };
// retHtml = await html({ e, 'server': 'resWs/res', 'body': body, 'room': room, 'infAdd': infAdd, }); console.log(retHtml);

let e = import.meta.url, ee = e;
async function html(inf = {}) {
    let ret = { 'ret': false, }; e = inf && inf.e ? inf.e : e;
    try {
        let { room, infAdd = {}, body, server, } = inf;

        let res = server; let headers = res.headers || {};
        function setData(txt) { return txt.substring(8, 10) + '/' + txt.substring(5, 7) + '/' + txt.substring(0, 4) + ' ' + txt.substring(11, 13) + ':' + txt.substring(14, 16) + ':' + txt.substring(17, 19); }

        // DEFINIR PÁGINAS DINÂMICAS
        if (!gW.pages) {
            let retFile; retFile = await file({ e, 'action': 'list', 'path': './src/pages', 'max': 10, }); if (!retFile.ret) { retFile['res'] = []; }; let retFileNew = [];
            for (let [index, v,] of retFile.res.entries()) { if (v.path.includes('.html')) { retFile = await file({ e, 'action': 'read', 'path': v.path, }); if (retFile.ret) { retFileNew.push(retFile.res); } } };
            if (retFileNew.length > 0) { gW.pages = retFileNew; };
        }

        // HTML | PERMITIR CORS
        let bodyHtml = ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <style> body { background-color: #17191A; color: white; } a:link, a:visited, a:hover, a:active { color: #66b2ff; text-decoration: none}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <title>WebSocket</title> </head> <body> ###REPLACE### <script> document.addEventListener('keydown', function (event)  {if (event.key === 'Escape') { history.back(); history.back() } } ) </script> </body> </html>`;
        res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', '*'); res.setHeader('Access-Control-Allow-Headers', '*'); res.setHeader('Access-Control-Allow-Credentials', 'true');

        function resBody(inf = {}) {
            let { body, type, pathFile, } = inf; let p = pathFile; let writeHead = {};
            if (['txt', 'download',].includes(type)) { if (['download',].includes(type)) { writeHead['Content-Disposition'] = `attachment; filename="${p || 'arquivo.txt'}"`; }; type = 'text/html; charset=utf-8'; }
            else if (['obj', 'arr',].includes(type)) { type = 'application/json'; body = JSON.stringify(body, null, 2); }
            else if (['img',].includes(type)) { type = 'image/jpeg'; body = Buffer.from(body); } else if (['base64',].includes(type)) {
                type = false; body = bodyHtml.replace('###REPLACE###', `<img src="data:image/png;base64,${Buffer.from({ 'type': 'Buffer', 'data': body, }).toString('base64')}" alt="Imagem">`).replace('WebSocket', `${p}`);
            } else { type = false; }; if (type) { writeHead['Content-Type'] = type; res.writeHead(200, writeHead); }; res.end(body);
        }

        if (headers.raw && infAdd.type !== 'download') {
            // ### [RAW]
            if (['obj', 'arr',].includes(infAdd.type)) { // (OBJ/ARR) # [FALSE] | (TXT) | (IMG)
                let loc = infAdd.path; let type = (loc && loc.includes('/src/') && loc.includes('.jsonAAA')) ? 'txt' : infAdd.type; resBody({ 'type': type, 'body': type === 'txt' ? 'ARQUIVO PROTEGIDO!' : body, });
            } else if (body.ret === false) { resBody({ 'type': 'obj', 'body': body, }); } else if (!body.res) { resBody({ 'type': 'txt', 'body': 'Ação executada com sucesso!', }); }
            else if (['txt',].includes(infAdd.type)) { resBody({ 'type': 'txt', 'body': body.res, }); } else if (['img',].includes(infAdd.type)) { resBody({ 'type': 'img', 'body': body.res, }); }
        } else {
            // ### [RENDERIZAR]
            if (body.ret === false) { // [FALSE]
                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao executar ação!\n\n${JSON.stringify(body, null, 2)}</pre>`).replace('WebSocket', `${infAdd.title}`), });
            } else if (['obj',].includes(infAdd.type)) { // (OBJ)
                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Ação executada com sucesso!\n\n${JSON.stringify(body, null, 2)}</pre>`).replace('WebSocket', `${infAdd.title}`), });
            } else if (['txt',].includes(infAdd.type)) { // (TXT)
                if (body.res.startsWith('page') && body.res.endsWith('.html')) { // PÁGINA DINÂMICA
                    let page = Number(body.res.replace('page', '').replace('.html', '')); if (Array.isArray(gW.pages) && gW.pages[page]) { resBody({ 'type': 'txt', 'body': gW.pages[page], }); }
                    else { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao executar ação!\n\nPágina não encontrada</pre>`).replace('WebSocket', `${infAdd.title}`), }); }
                } else { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>${body.res}</pre>`).replace('WebSocket', `${infAdd.title}`), }); }
            } else if (['arr', 'img',].includes(infAdd.type)) { // (ARR)
                let retFile = body.res; let path = infAdd.path; let pathFile;
                if (path) { if (path.length > 3) { pathFile = path.lastIndexOf('/'); pathFile = path.substring(pathFile + 1); } else { pathFile = path.replace('/', ''); } }; if (Array.isArray(retFile)) {
                    try {
                        let tableHtml = '', link = '', tipoEstilo = ''; let qtdFolder = 0, qtdFile = 0; for (let item of retFile) { if (item.isFolder) { qtdFolder++; } else { qtdFile++; } }
                        tableHtml += '<table border="1" id="fileTable" style="margin-bottom: 50px;"><tr>'; tableHtml += `<th style="width: 125px; text-align: center; cursor: pointer;" onclick="sortTable(0)">TAMANHO</th>`;
                        tableHtml += `<th style="width: 160px; text-align: center; cursor: pointer;" onclick="sortTable(1)">MODIFICAÇÃO</th>`;
                        tableHtml += `<th style="width: 270px; text-align: center; cursor: pointer;" onclick="sortTable(2)">MD5</th>`;
                        tableHtml += `<th style="width: 80px; text-align: center; cursor: pointer;" onclick="sortTable(3)">TIPO</th>`;
                        tableHtml += `<th style="width: 62%; text-align: center; cursor: pointer;" onclick="sortTable(4)">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`;
                        tableHtml += '</tr>'; tableHtml += `<script> let currentSort = {};
                        function parseSize(size) { if (!size || size.trim() === "" || size.toLowerCase().includes("pasta")) { return 0; }; let value = parseFloat(size); if (size.includes("KB")) { return value * 1024; } 
                        else if (size.includes("MB")) { return value * 1024 * 1024; } else if (size.includes("GB")) { return value * 1024 * 1024 * 1024; } else { return value;  } }; function sortTable(columnIndex) {
                        let table = document.getElementById("fileTable"); let rows = Array.from(table.rows).slice(1); let isAscending = currentSort[columnIndex] !== "asc"; rows.sort((rowA, rowB) => {
                        let cellA = rowA.cells[columnIndex].innerText.trim(); let cellB = rowB.cells[columnIndex].innerText.trim(); if (columnIndex === 0) { let sizeA = parseSize(cellA); let sizeB = parseSize(cellB);
                        return isAscending ? sizeA - sizeB : sizeB - sizeA;}; return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA); }); rows.forEach(row => table.appendChild(row));
                        currentSort[columnIndex] = isAscending ? "asc" : "desc"; let headers = table.querySelectorAll("th"); headers.forEach((header, index) => { if (index === columnIndex) {
                        header.innerHTML = header.innerHTML.replace(/(▲|▼)?$/, isAscending ? " ▼" : " ▲");} else { header.innerHTML = header.innerHTML.replace(/(▲|▼)?$/, "");}}); } </script>`; for (let item of retFile) {
                            link = `<a href="/?act=${gW.par8}&roo=${room}&mes=${encodeURIComponent(encodeURIComponent(item.path))}">${item.path.replace(`/${item.name}`, '')}</a>`;
                            tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'; let dataFormatada = item.edit ? setData(item.edit) : '';
                            tableHtml += `<tr>`; tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`; tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
                            tableHtml += `<td style="text-align: center;">${item.md5 || ''}</td>`; tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                            tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;${item.name || ''}&nbsp;</td>`; tableHtml += `</tr>`;
                        }; tableHtml += '</table>'; resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', tableHtml).replace('WebSocket', `${pathFile}`), });
                    } catch (catchErr) { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao listar arquivos: ${catchErr.message}</pre>`), }); };
                } else {
                    try {
                        if (path && path.includes('/src/') && path.includes('.jsonAAA')) { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>ARQUIVO PROTEGIDO!</pre>`), }); } else {
                            let resultado = retFile; if (infAdd.type === 'img' || path.match(/\.(jpg|jpeg|png|ico)$/)) { resBody({ 'type': 'base64', 'body': resultado.data, 'pathFile': infAdd.title, }); } else {
                                resultado = resultado.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                                resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>${resultado}</pre>`).replace('WebSocket', `${pathFile}`), });
                            }
                        }
                    } catch (catchErr) { resBody({ 'type': 'txt', 'body': bodyHtml.replace('###REPLACE###', `<pre>Erro ao exibir arquivo: ${catchErr.message}</pre>`), }); esLintIgnore = catchErr; }
                }
            } else if (['download',].includes(infAdd.type)) { resBody({ 'type': 'download', 'body': body.res, 'pathFile': infAdd.title, }); } // (DOWNLOAD)
        }

        ret['ret'] = true;
        ret['msg'] = `HTML: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ 'inf': inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    };

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.res && { 'res': ret.res, }), };
};

// CHROME | NODEJS
(eng ? window : global)['html'] = html;


