// let infRegex
// infRegex = { 'pattern': 'UM(.*?)TRES', 'text': 'UMDOISTRES' }
// infRegex = { 'simple': true, 'pattern': '*DOIS*', 'text': 'UMDOISTRES' }
// const retRegex = regex(infRegex);
// console.log(retRegex)

function regex(inf) { // NAO POR COMO 'async'!!!
    (async () => { await import('./@functions.js') })()
    let ret = { 'ret': false }; try {
        if (inf.pattern.includes('(.*?)')) {
            let res = {}; let ok = false; const patternSplit = inf.pattern.split('(.*?)'); const split1 = patternSplit[0].replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            const split2 = patternSplit[1].replace(/[.+?^${}()|[\]\\]/g, '\\$&'); const result1 = inf.text.match(`${split1}(.*?)${split2}`);
            const result2 = inf.text.match(`(?<=${split1})(.+)(?=${split2})`); const result3 = inf.text.match(`${split1}([\\s\\S]*?)${split2}`);
            const result4 = inf.text.match(`(?<=${split1})([\\s\\S]+)(?=${split2})`);
            res['0'] = `res.['1'] → [-|<] | res.['2'] → [-|>] | res.['3'] → [^|<] | res.['4'] → [^|>]`
            if (result1 && result1.length > 0) { res['1'] = result1[1]; ok = true } else { res['1'] = `[-|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result2 && result2.length > 0) { res['2'] = result2[1]; ok = true } else { res['2'] = `[-|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result3 && result3.length > 0) { res['3'] = result3[1]; ok = true } else { res['3'] = `[^|<] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (result4 && result4.length > 0) { res['4'] = result4[1]; ok = true } else { res['4'] = `[^|>] PADRAO '${inf.pattern}' NAO ENCONTRADO` }
            if (ok) { ret['msg'] = `REGEX: OK`; ret['res'] = res; ret['ret'] = true }
        } else {
            const pattern = inf.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'); const result = new RegExp(`^${pattern}$`).test(inf.text);
            if (inf.simple) { if (result) { return true } else { return false } } else {
                if (result) { ret['msg'] = `REGEX: OK`; ret['res'] = 'TEXTO POSSUI O PADRAO'; ret['ret'] = true; }
                else { ret['msg'] = `\n\n #### ERRO #### REGEX \n PADRAO '${inf.pattern}' NAO ENCONTRADO \n\n`; }
            }
        }
    } catch (e) { (async () => { const m = await regexE({ 'e': e }); ret['msg'] = m.res; })() };
    ret = { 'ret': ret.ret, 'msg': ret.msg, 'res': ret.res }; return ret
}

if (typeof window !== 'undefined') { // CHROME
    window['regex'] = regex;
} else { // NODEJS
    global['regex'] = regex;
}