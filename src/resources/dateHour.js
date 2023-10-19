// const retDateHour = dateHour();
// console.log(retDateHour)

function dateHour(inf = 0) { // NAO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        const dt1 = new Date(); dt1.setSeconds(new Date().getSeconds() + inf).setSeconds; const dt2 = Date.now() + (inf * 1000); ret['res'] = {
            'day': String(dt1.getDate()).padStart(2, '0'), 'mon': String(dt1.getMonth() + 1).padStart(2, '0'),
            'yea': String(dt1.getFullYear()), 'hou': String(dt1.getHours()).padStart(2, '0'),
            'min': String(dt1.getMinutes()).padStart(2, '0'), 'sec': String(dt1.getSeconds()).padStart(2, '0'),
            'mil': String(dt2.toString().slice(-3)), 'tim': String(dt2.toString().slice(0, -3)), 'timMil': String(dt2.toString()),
            'monNam': ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][dt1.getMonth()]
        }; ret['ret'] = true; ret['msg'] = `DATE HOUR: OK`  // manter o 'String' para forcar o '0' (zero) na frente → '001'
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    if (!ret.ret) { console.log(ret.msg) }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['dateHour'] = dateHour;
} else { // NODEJS
    global['dateHour'] = dateHour;
}


