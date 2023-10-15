// const retClipboard = await clipboard({ 'value': `Esse é o texto` });
// console.log(retClipboard)

async function clipboard(inf) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        if (inf.value == null || inf.value == '') { ret['msg'] = `\n\n #### ERRO #### CLIPBOARD \n INFORMAR O 'value' \n\n` } else {
            let text = inf.value; if (typeof text === 'object') { text = JSON.stringify(text, null, 2) }  // OBJETO INDENTADO EM TEXTO BRUTO
            if (typeof window !== 'undefined') { // CHROME
                const element = document.createElement('textarea'); element.value = text; document.body.appendChild(element);
                element.select(); document.execCommand('copy'); document.body.removeChild(element)
            } else { _clipboard.writeSync(text) }; ret['ret'] = true; ret['msg'] = 'CLIPBOARD: OK' // NODEJS
        }
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['clipboard'] = clipboard;
} else { // NODEJS
    global['clipboard'] = clipboard;
}