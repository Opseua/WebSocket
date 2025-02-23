let eng = (typeof window !== 'undefined'); (eng ? window : global)['eng'] = eng; let gloWin = eng ? window : global; // [true] CHROME | [false] NODEJS
// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODEJS] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); };

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), devChildren, });

// console.log(`${eng} | ${engName} | ${letter}\n${fileProjetos} | ${fileWindows}`); console.log('\n'); console.log('securityPass:', gW.securityPass);
// console.log('portWeb:', gW.portWeb, '|', 'serverWeb:', gW.serverWeb); console.log('portLoc:', gW.portLoc, '|', 'serverLoc:', gW.serverLoc);
// console.log(`devMaster: ${gW.devMaster}\ndevSlave: ${gW.devSlave}\ndevChildren: ${gW.devChildren}`); console.log(`devSend:\n${gW.devSend}`);
// console.log(`devGet:\n${gW.devGet[0]}\n${gW.devGet[1]}`); console.log('conf:', gW.conf); console.log('root:', gW.root); console.log('functions:', gW.functions); console.log('project:', gW.project);

// PEGAR O NOME DO ARQUIVO(SEM EXTENSÃO)
function funFile(txt) { return txt.match(/([^\\/]+)(?=\.[^\\.]+$)/)[0]; };

// IMPORTAR FUNÇÕES DINAMICAMENTE QUANDO NECESSÁRIO 
let qtd1 = 0; async function funImport(infOk) { let { path, inf, } = infOk; qtd1++; let name = funFile(path); if (qtd1 > 30) { console.log('IMPORTANDO...', name); }; await import(`${path}`); return await gloWin[name](inf); };

// FUNÇÃO GENÉRICA (QUANDO O ENGINE ESTIVER ERRADO) | ENCAMINHAR PARA DEVICE
async function funGeneric(infOk) { let { path, inf, } = infOk; let name = funFile(path); let retDevAndFun = await devFun({ 'e': import.meta.url, 'enc': true, 'data': { name, 'par': inf, }, }); return retDevAndFun; };

// FUNÇÕES DESSE PROJETO
gloWin['html'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './html.js', inf, }); };
gloWin['logsDelOld'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './logsDelOld.js', inf, }); };
gloWin['messageAction'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './messageAction.js', inf, }); };
gloWin['performanceDev'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './performanceDev.js', inf, }); };
gloWin['roomParams'] = (inf) => { let fun = (!eng) ? funImport : funGeneric; return fun({ 'path': './roomParams.js', inf, }); };


