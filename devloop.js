'use strict'

let npm = run({
  sh: `npm install`,
  watch: 'package.json'
});

let tspublic = run({
  name: 'ts public',
  sh: 'grunt ts:public',
  watch: ['public/**/*.ts']
});

let tsserver = run({
  name: 'ts server',
  sh: 'grunt ts:server',
  watch: ['app.ts', 'server/**/*.ts']
}).dependsOn(npm);

let server = runServer({
  httpPort: 3000,
  sh: `node app.js`
}).dependsOn(tsserver);

proxy(server, 8080).dependsOn(tspublic, tsserver);
