// let infApi, retApi
// infApi = { // ########## TYPE → json
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'accept-language': 'application/json' },
//     'body': { 'Chave': 'aaa', 'Valor': 'bbb' }
// };
// infApi = { // ########## TYPE → text
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'content-type': 'text/plain;charset=UTF-8' },
//     'body': '{"topic":"OPSEUA","message":"a"}'
// };
// const formData = new URLSearchParams(); // ########## TYPE → x-www-form-urlencoded
// formData.append('grant_type', 'client_credentials');
// formData.append('resource', 'https://graph.microsoft.com'); infApi = {
//     'method': 'POST', 'url': `https://ntfy.sh/`, 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
//     'body': formData.toString()
// };
// retApi = await api(infApi);
// console.log(retApi)

async function api(inf) {
    await import('./@functions.js')
    let ret = { 'ret': false }; try {
        if (typeof UrlFetchApp !== 'undefined') { // ################ GOOGLE APP SCRIPT
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true, 'muteHttpExceptions': true, 'validateHttpsCertificates': true, };
            if (inf.headers) { reqOpt['headers'] = inf.headers }
            if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) { reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body }
            const req = UrlFetchApp.fetch(inf.url, reqOpt); const resHeaders = req.getAllHeaders();
            const resBody = req.getContentText(); ret['ret'] = true; ret['msg'] = 'API: OK';
            ret['res'] = { 'code': req.getResponseCode(), 'headers': resHeaders, 'body': resBody }
        } else { // ######################################### NODEJS ou CHROME
            const reqOpt = { 'method': inf.method, 'redirect': 'follow', 'keepalive': true };
            if (inf.headers) { reqOpt['headers'] = inf.headers }; if ((inf.body) && (inf.method == 'POST' || inf.method == 'PUT')) {
                reqOpt['body'] = typeof inf.body === 'object' ? JSON.stringify(inf.body) : inf.body
            }; const req = await fetch(inf.url, reqOpt); const resHeaders = {}; req.headers.forEach((value, name) => { resHeaders[name] = value })
            const resBody = await req.text(); ret['ret'] = true; ret['msg'] = 'API: OK'; ret['res'] = { 'code': req.status, 'headers': resHeaders, 'body': resBody }
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['api'] = api;
} else { // NODEJS
    global['api'] = api;
}