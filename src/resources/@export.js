globalThis['eng'] = (typeof globalThis.alert !== 'undefined'); // [true] CHROME | [false] NODE

// DEFINIR O 'devChildren' → [CHROME] EMAIL DO USUÁRIO | [NODE] PRIMEIRO ARQUIVO A SER EXECUTADO (NA MAIORIA DOS CASOS 'server')
let devC = new Error().stack.split('\n'); devC = devC[devC.length - 1]; let devChildren = devC.includes('.js:') ? devC.match(/\/([^/]+)\.[^/]+$/)[1] : false;
if (eng) { devChildren = await new Promise((resolve) => { chrome.identity.getProfileUserInfo(function (u) { resolve(u.email); }); }); }

// @functions
await import(`../../../${process.env.fileChrome_Extension.split('PROJETOS\\')[1]}/src/resources/@functions.js`);

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
await getPath({ 'e': new Error(), devChildren, });

/* FUNÇÕES */ let project = gW.project;
globalThis['html'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/html.js`, inf, project, }); };
globalThis['logsDel'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/logsDel.js`, inf, project, }); };
globalThis['messageAction'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/messageAction.js`, inf, project, }); };
globalThis['performanceDev'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/performanceDev.js`, inf, project, }); };
globalThis['roomParams'] = (inf) => { return importFun({ 'engOk': (!eng), 'path': `./src/resources/roomParams.js`, inf, project, }); };


