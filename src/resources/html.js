// let infHtml, retHtml, infAdd = { 'title': 'Erro', 'type': '' }
// retHtml = await html({ 'e': e, 'server': resWs, 'body': body, 'room': room, 'infAdd': infAdd })
// console.log(retHtml)

let e = import.meta.url, ee = e
async function html(inf) {
    let ret = { 'ret': false }; e = inf && inf.e ? inf.e : e;
    if (catchGlobal) {
        let errs = async (errC, ret) => { if (!ret.stop) { ret['stop'] = true; regexE({ 'e': errC, 'inf': inf, 'catchGlobal': true }) } };
        if (typeof window !== 'undefined') { window.addEventListener('error', (errC) => errs(errC, ret)); window.addEventListener('unhandledrejection', (errC) => errs(errC, ret)) }
        else { process.on('uncaughtException', (errC) => errs(errC, ret)); process.on('unhandledRejection', (errC) => errs(errC, ret)) }
    }
    try {
        let room = inf.room
        let res = inf.server
        let infAdd = inf.infAdd
        let body = inf.body

        function setData(inf) {
            let day = inf.substring(8, 10), mon = inf.substring(5, 7), yer = inf.substring(0, 4); let hou = inf.substring(11, 13)
            let min = inf.substring(14, 16), sec = inf.substring(17, 19); return day + "/" + mon + "/" + yer + " " + hou + ":" + min + ":" + sec;
        }

        // HTML
        let bodyHtml = `
        <!DOCTYPE html> <html lang="en"><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>WebSocket</title> </head> <body> ####REPLACE####
        <script> document.addEventListener('keydown',function(event){if(event.key === 'Escape'){history.back()}}) </script> </body> </html>`;
        if (infAdd.type == 'text') {
            // ### TEXT
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(bodyHtml.replace('####REPLACE####', `<pre>${body}</pre>`).replace('WebSocket', `${infAdd.title}`));
        } else if (infAdd.type == 'image') {
            // ### IMAGE
            let imagemBase64 = Buffer.from({ type: 'Buffer', data: body.data }).toString('base64');
            res.end(bodyHtml.replace('####REPLACE####', `<img src="data:image/png;base64,${imagemBase64}" alt="Imagem">`).replace('WebSocket', `${infAdd.title}`));
        } else if (infAdd.type == 'array') {
            // ### ARRAY
            let retFile = body
            let path = infAdd.path
            let pathFile
            if (path.length > 3) {
                pathFile = path.lastIndexOf("/");
                pathFile = path.substring(pathFile + 1);
            } else {
                pathFile = path.replace('/', '')
            }
            if (retFile instanceof Array) {
                let tableHtml = '', link = '', tipoEstilo = '';
                res.writeHead(200, { 'Content-Type': 'text/html' });
                try {
                    let qtdFolder = 0, qtdFile = 0
                    for (let item of retFile) { if (item.isFolder) { qtdFolder++ } else { qtdFile++ } }
                    tableHtml += '<table border="1"><tr>';
                    tableHtml += `<th style="width: 95px; text-align: center;">TAMANHO</th>`;
                    tableHtml += `<th style="width: 150px; text-align: center;">MODIFICAÇÃO</th>`;
                    tableHtml += `<th style="width: 260px; text-align: center;">MD5</th>`;
                    tableHtml += `<th style="width: 80px; text-align: center;">TIPO</th>`;
                    tableHtml += `<th style="width: 65%; text-align: center;">PATH [pastas: ${qtdFolder} | arquivos: ${qtdFile} | total: ${retFile.length}]</th>`;
                    tableHtml += '</tr>';
                    for (let item of retFile) {
                        link = `<a href="/?act=${globalWindow.par8}&roo=${room}&mes=${encodeURIComponent(encodeURIComponent(item.path))}">${item.path.replace(`/${item.name}`, '')}</a>`;
                        tipoEstilo = item.isFolder ? 'background-color: #1bcf45; color: #ffffff;' : 'background-color: #db3434; color: #ffffff;'
                        let dataFormatada = item.edit ? setData(item.edit) : '';
                        tableHtml += `<tr>`;
                        tableHtml += `<td style="text-align: center;">${item.size || ''}</td>`;
                        tableHtml += `<td style="text-align: center;">${dataFormatada}</td>`;
                        tableHtml += `<td style="text-align: center;">${item.md5 || ''}</td>`;
                        tableHtml += `<td style="text-align: center; ${tipoEstilo}">${item.isFolder ? 'PASTA' : 'ARQUIVO'}</td>`;
                        tableHtml += `<td style="text-align: left;">${link}&nbsp;&nbsp;&nbsp;[${item.name || ''}]&nbsp;</td>`;
                        tableHtml += `</tr>`;
                    }
                    tableHtml += '</table>';
                    res.end(bodyHtml.replace('####REPLACE####', tableHtml).replace('WebSocket', `${pathFile}`));
                } catch (error) {
                    res.end(bodyHtml.replace('####REPLACE####', `<pre>Erro ao listar arquivos: ${error.message}</pre>`));
                }
            } else {
                try {
                    if (path.includes('/src/') && (path.includes('.json'))) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(bodyHtml.replace('####REPLACE####', `<pre>ARQUIVO PROTEGIDO!</pre>`));
                    } else {
                        let resultado = retFile;
                        if (path.match(/\.(jpg|jpeg|png|ico)$/)) {
                            let imagemBase64 = Buffer.from({ type: 'Buffer', data: resultado.data }).toString('base64');
                            res.end(bodyHtml.replace('####REPLACE####', `<img src="data:image/png;base64,${imagemBase64}" alt="Imagem">`).replace('WebSocket', `${pathFile}`));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end(bodyHtml.replace('####REPLACE####', `<pre>${resultado}</pre>`).replace('WebSocket', `${pathFile}`));
                        }
                    }
                } catch (error) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(bodyHtml.replace('####REPLACE####', `<pre>Erro ao exibir arquivo: ${error.message}</pre>`));
                }
            }
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(bodyHtml.replace('####REPLACE####', `<pre>${body}</pre>`).replace('WebSocket', `Tipo de conteúdo não identificado`));
        }

        ret['ret'] = true;
        ret['msg'] = `HTML: OK`;

        // ### LOG FUN ###
        if (inf && inf.logFun) {
            let infFile = { 'e': e, 'action': 'write', 'functionLocal': false, 'logFun': new Error().stack, 'path': 'AUTO', }
            infFile['rewrite'] = false; infFile['text'] = { 'inf': inf, 'ret': ret }; file(infFile);
        }
    } catch (err) {
        let retRegexE = await regexE({ 'inf': inf, 'e': err, 'catchGlobal': false });
        ret['msg'] = retRegexE.res
    };
    return {
        ...({ ret: ret.ret }),
        ...(ret.msg && { msg: ret.msg }),
        ...(ret.res && { res: ret.res }),
    };
}

if (eng) { // CHROME
    window['html'] = html;
} else { // NODEJS
    global['html'] = html;
}