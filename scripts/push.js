const shell = require('shelljs')
const fs = require('fs')
const package = require('../package.json')

const configLite = ((package) => {
    const { name, version, main, author, license, keywords, description } = package
    return { name, version, main, author, license, keywords, description }
}) (package);


shell.exec('npm run build', () => fs.writeFileSync('./dist/package.json', JSON.stringify(configLite)))

shell.exec('cd dist && npm publish')
 