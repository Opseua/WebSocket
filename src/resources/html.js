// → CONTEUDO: ENVIAR BRUTO (RESPOSTA EM JSON)
// {'mode': 'raw }
// &mode=raw

// → CONTEUDO: DOWNLOAD (APENAS ARQUIVOS DE TEXTO!!!)
// {'mode': 'dow }
// &mode=dow

// → CONTEUDO: RENDERIZARA PÁGINA HTML (APENAS ARQUIVOS HTML!!!)
// {'mode': 'htm }
// &mode=htm

let e = currentFile(new Error()), ee = e;
async function html(inf = {}) {
    let ret = { 'ret': false, }; e = inf.e || e;
    try {
        let { room, infAdd = {}, body, server, } = inf;

        let { type, path, } = infAdd; let res = server, mode; function htmlWithPre(b, pre) { return bodyHtml.replace('_REP_LACE_', pre ? `<pre>${b}</pre>` : b).replace('_Web_Socket_', title); }
        let headersUrlParams = { ...res.headers || {}, ...res.urlParams, }, title = path ? path.split('/').reverse()[0] : infAdd.title || 'download.txt'; type = path?.match(/\.(jpg|jpeg|png|ico)$/) ? 'img' : type;
        function setData(txt) { return txt.substring(8, 10) + '/' + txt.substring(5, 7) + '/' + txt.substring(0, 4) + ' ' + txt.substring(11, 13) + ':' + txt.substring(14, 16) + ':' + txt.substring(17, 19); }

        // HTML | PERMITIR CORS
        let bodyHtml = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <style>body{background-color:#17191A;color:white;font-size:13.5px}a:link,a:visited,a:hover,a:active{color:#66b2ff;text-decoration:none}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <title>_Web_Socket_</title> </head> <body> _REP_LACE_ <script> document.addEventListener('keydown', function (event)  {if (event.key === 'Escape') { history.back(); history.back() } } ) </script> </body> </html>`;
        res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', '*'); res.setHeader('Access-Control-Allow-Headers', '*'); res.setHeader('Access-Control-Allow-Credentials', 'true');

        function resBody() { // img → imagem | arr → webfile (LISTA/LENDO) | obj  → OBJETO
            let writeHead = {}, resWriHeaEnd = false; try {
                if (mode === 'ren' || mode === 'htm') {
                    // === RENDERIZAR ===
                    if (type === 'obj' || type === 'arr') {
                        if (type === 'arr') { body = tableFile(); } body = typeof body === 'object' ? `${body.ret ? 'Ação executada com sucesso' : 'Erro ao executar ação'}!\n\n${JSON.stringify(body, null, 2)}` : body;
                    } else if (type === 'img') {
                        body = `<img src="data:image/png;base64,${Buffer.from(body.res).toString('base64')}" alt="Imagem">`;
                    }
                    writeHead['Content-Type'] = `${path?.endsWith('.js') && mode === 'htm' ? 'application/javascript' : 'text/html'}; charset=utf-8`;
                } else if (mode === 'raw') {
                    // === BRUTO ===
                    if (type === 'obj' || type === 'arr') {
                        body = JSON.stringify(body); writeHead['Content-Type'] = 'application/json';
                    } else if (type === 'img') {
                        body = Buffer.from(body.res); writeHead['Content-Type'] = 'image/jpeg';
                    }
                } else if (mode === 'dow') {
                    // === DOWNLOAD ===
                    if (type === 'obj') {
                        body = Buffer.from(JSON.stringify(body), 'utf8'); writeHead['Content-Type'] = 'text/plain; charset=utf-8';
                    } else if (type === 'arr') {
                        body = Buffer.from(body.res, 'utf8'); writeHead['Content-Type'] = `${path?.endsWith('.css') ? 'text/css' : 'text/plain'}; charset=utf-8`;
                    } else if (type === 'img') {
                        body = Buffer.from(body.res); writeHead['Content-Type'] = 'application/octet-stream';
                    }
                    writeHead['Content-Disposition'] = `attachment; filename="${title}"`;
                }
            } catch (err) { resWriHeaEnd = err; } // REQ DEU ERRO: SIM/NÃO | ENVIAR RESPOSTA
            if (resWriHeaEnd) { resWriHeaEnd = { 'writeHead': { 'Content-Type': 'text/plain; charset=utf-8', }, 'end': JSON.stringify({ 'ret': false, 'msg': `HTML: ERRO | ${resWriHeaEnd.message}`, }), }; }
            else { resWriHeaEnd = { writeHead, 'end': mode === 'ren' ? htmlWithPre(body, (type === 'obj' || (type === 'arr' && !body.includes('<tr>#<th'.replace('#', ''))))) : body, }; }
            res.writeHead(200, resWriHeaEnd.writeHead); res.end(resWriHeaEnd.end);
        }

        function tableFile() {
            let resOk = '', link = '', tipoEstilo = '', qtdFolder = 0, qtdFile = 0, t = `<th style="text-align: center; cursor: pointer; `, bacCol = `background-color: #3C3C3C`; try {
                if (Array.isArray(body.res)) { // TABELA
                    for (let item of body.res) { if (item.isFolder) { qtdFolder++; } else { qtdFile++; } } resOk += '<table border="1" id="fileTable" style="white-space: nowrap; margin-bottom: 50px;"><tr>';
                    resOk += `${t}${bacCol};padding: 0 5px;" onclick="sortTable(0)">TAMANHO</th>`; resOk += `${t}${bacCol}; padding: 0 13px;" onclick="sortTable(1)">MODIFICAÇÃO</th>`;
                    resOk += `${t}${bacCol};padding: 0 96px;" onclick="sortTable(2)">MD5</th>`; resOk += `${t}${bacCol}; padding: 0 19px;" onclick="sortTable(3)">TIPO</th>`;
                    resOk += `${t}${bacCol};width: 100%;"onclick="sortTable(4)">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${body.res.length}]</th>`; resOk += `</tr> <script> let currentSort = {};
                        function parseSize(size) { if (!size || size.trim() === "" || size.toLowerCase().includes("pasta")) { return 0; }; let value = parseFloat(size); if (size.includes("KB")) { return value * 1024; } 
                        else if (size.includes("MB")) { return value * 1024 * 1024; } else if (size.includes("GB")) { return value * 1024 * 1024 * 1024; } else { return value;  } }; function sortTable(columnIndex) {
                        let table = document.getElementById("fileTable"); let rows = Array.from(table.rows).slice(1); let isAscending = currentSort[columnIndex] !== "asc"; rows.sort((rowA, rowB) => {
                        let cellA = rowA.cells[columnIndex].innerText.trim(); let cellB = rowB.cells[columnIndex].innerText.trim(); if (columnIndex === 0) { let sizeA = parseSize(cellA); let sizeB = parseSize(cellB);
                        return isAscending ? sizeA - sizeB : sizeB - sizeA;}; return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA); }); rows.forEach(row => table.appendChild(row));
                        currentSort[columnIndex] = isAscending ? "asc" : "desc"; let headers = table.querySelectorAll("th"); headers.forEach((header, index) => { if (index === columnIndex) {
                        header.innerHTML = header.innerHTML.replace(/(▲|▼)?$/, isAscending ? " ▼" : " ▲");} else { header.innerHTML = header.innerHTML.replace(/(▲|▼)?$/, "");}});}</script>`; for (let item of body.res) {
                        link = `<a href="/?act=${gW.par5}&roo=${room}&mes=${encodeURIComponent(encodeURIComponent(item.path))}">${item.path.replace(`/${item.name}`, '')}</a>`;
                        tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'; let dataFormatada = item.edit ? setData(item.edit) : '';
                        resOk += `<tr>`; resOk += `<td style="text-align: center;">${item.size || ''}</td>`; resOk += `<td style="text-align: center;">${dataFormatada}</td>`;
                        resOk += `<td style="text-align: center;">${item.md5 || ''}</td>`; resOk += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                        resOk += `<td style="text-align: left;">&nbsp;&nbsp;${link}&nbsp;&nbsp;&nbsp;${item.name || ''}&nbsp;&nbsp;</td>`; resOk += `</tr>`;
                    } resOk += '</table>';
                } else if (path && path.includes('/src/') && path.includes('.jsonAAA')) { // PROTEGIDO
                    resOk = { 'ret': false, 'msg': `ERRO | ARQUIVO PROTEGIDO! '${path}'`, };
                } else if (mode === 'htm') { // HTML (ANTIGO 'page')
                    resOk = body.res;
                } else { // OUTROS ARQUIVOS
                    resOk = body.res.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                }
            } catch (err) { resOk = { 'ret': false, 'msg': `{TABLE/VIEW}: ERRO | '${path}' → ${err.message}`, }; } return resOk;
        }

        mode = ['raw', 'dow', 'htm',].includes(headersUrlParams.mode) ? headersUrlParams.mode : 'ren'; resBody();

        ret['ret'] = true;
        ret['msg'] = `HTML: OK`;

    } catch (catchErr) {
        let retRegexE = await regexE({ inf, 'e': catchErr, }); ret['msg'] = retRegexE.res; ret['ret'] = false; delete ret['res'];
    }

    return { ...({ 'ret': ret.ret, }), ...(ret.msg && { 'msg': ret.msg, }), ...(ret.hasOwnProperty('res') && { 'res': ret.res, }), };
}

// CHROME | NODE
globalThis['html'] = html;


