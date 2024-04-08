// FUNCTIONS
await import('../../../Chrome_Extension/src/resources/@functions.js');

// DEFINIR → LETTER | ROOT | FUNCTION | PROJECT | FILE | LINE
let retGetPath = await getPath({ 'e': new Error(), 'isFunction': false, 'devSlave': cng == 1 ? 'CHROME' : 'NODEJS' })

// FUNÇÕES DESSE PROJETO
await import('./html.js');
await import('./messageAction.js');
await import('./roomParams.js');



