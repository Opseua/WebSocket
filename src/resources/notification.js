// const infNotification = {
//     'duration': 2, 'icon': './src/media/icon_4.png',
//     'buttons': [{ 'title': 'BOTAO 1' }, { 'title': 'BOTAO 2' }],
//     'title': `TITULO`, 'text': 'TEXTO',
// };
// const retNotification = await notification(infNotification);
// console.log(retNotification)

async function notification(infOk) {
    await import('./@functions.js');
    let ret = { 'ret': false }; try {
        let inf, imgBase64; if (!infOk) { inf = {} } else { inf = infOk }; if (typeof window == 'undefined') { // [ENCONTRAR DEVICE] NODEJS
            const infDevAndFun = {
                'name': 'notification', 'retUrl': inf.retUrl,
                'par': { 'buttons': inf.buttons, 'duration': inf.duration, 'icon': inf.icon, 'title': inf.title, 'text': inf.text }
            }; const retDevAndFun = await devAndFun(infDevAndFun); return retDevAndFun
        }; if (!inf.icon || inf.icon.length > 1) {
            const imgSrc = !inf.icon ? './src/media/icon_3.png' : inf.icon; const imgBinary = await fetch(imgSrc).then(response => response.arrayBuffer())
            imgBase64 = btoa(String.fromCharCode(...new Uint8Array(imgBinary)))
        } else { imgBase64 = inf.icon }; const json = {
            duration: ((!inf.duration) || !(inf.duration > 0)) ? 5 : inf.duration, type: 'basic', icon: `data:image/png;base64,${imgBase64}`,
            title: ((!inf.title) || (inf.title == '')) ? `TITULO VAZIO` : `${inf.title}`, text: ((!inf.text) || (inf.text == '')) ? `TEXT VAZIO` : `${inf.text}`,
            buttons: inf.buttons ? inf.buttons : [],
        }; const not = {
            type: json.type, iconUrl: json.icon, title: json.title.substring(0, 88),   // máximo [considerando tudo 'i'] + 1 caractere
            message: json.text.substring(0, 349), buttons: json.buttons // máximo [considerando tudo 'i'] + 1 caractere
        }; chrome.notifications.create(not, (notificationId) => {
            chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => { // ALGUM BOTAO PRESSIONADO
                if (notifId === notificationId && btnIdx === 0) { alert('1') }; if (notifId === notificationId && btnIdx === 1) { alert('2') }
            }); setTimeout(() => { chrome.notifications.clear(notificationId) }, json.duration * 1000)
        }); ret['ret'] = true; ret['msg'] = 'NOTIFICATION: OK'
    } catch (e) { const m = await regexE({ 'e': e }); ret['msg'] = m.res };
    if (!ret.ret) { console.log(ret.msg) }; ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['notification'] = notification;
} else { // NODEJS
    global['notification'] = notification;
}