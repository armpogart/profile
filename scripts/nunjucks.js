#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const globby = require('globby');
const makeDir = require('make-dir');
const chalk = require('chalk');
const chokidar = require('chokidar');
const argv = require('yargs')
    .option('o', {
        alias: 'output',
        demandOption: true,
        requiresArg: true,
        describe: 'Output path for rendered files',
        type: 'string',
    })
    .option('c', {
        alias: 'context',
        requiresArg: true,
        describe: 'Path to data files for the context',
        type: 'string',
    })
    .demandCommand(1, 1, 'You need to specify templates to render.')
    .argv;

const cwd = process.cwd();

// set options
const options = {
    trimBlocks: true,
    lstripBlocks: true
};
// set nunjucks environment
const environment = nunjucks.configure(cwd, options);
// parse data files for context
const context = {};
if (argv.context) {
    const dataFiles = globby.sync(path.resolve(cwd, argv.context));
    for (const file of dataFiles) {
        // set property with file name on context
        const objectName = path.basename(file, path.extname(file));
        context[objectName] = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
}

const inputFiles = globby.sync(path.resolve(argv._[0]));
const outputPath = path.resolve(cwd, argv.output);
for (const file of inputFiles) {
    environment.render(file, context, (error, result) => {
        if (error) return console.error(chalk.red(error));
        const fileName = path.basename(file).replace(/\.\w+$/, '') + '.html';
        makeDir.sync(outputPath);
        console.log(chalk.blue(`Rendering: ${fileName}`));
        fs.writeFileSync(path.resolve(outputPath, fileName), result);
    });
}
