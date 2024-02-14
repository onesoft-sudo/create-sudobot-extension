#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const readline = require('node:readline/promises');
const chalk = require('chalk');

let targetDirectory = process.argv[2] ?? process.cwd()
let language = 'TypeScript';
let name = null;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let input;

async function main() {
    input = await rl.question(chalk.green("> ") + chalk.bold("Where to create the project?") + " " + chalk.dim("(defaults to current directory)") + " ");
    
    if (input && input.trim() !== '') {
        targetDirectory = input;
    }

    if (fs.existsSync(targetDirectory) && !fs.lstatSync(targetDirectory).isDirectory()) {
        console.error(chalk.red("error: ") + `${targetDirectory} is not a directory`);
        rl.close();
        process.exit(-1);
    }

    if (!targetDirectory.startsWith('/')) {
        targetDirectory = path.resolve(process.cwd(), targetDirectory);
    }

    input = await rl.question(chalk.green("> ") + chalk.bold("What will be the name of the extension?") + " " + chalk.dim("(defaults to the target directory name)") + " ");
    name = input.trim() === '' ? path.basename(targetDirectory) : input;
        
    input = await rl.question(chalk.green("> ") + chalk.bold("What language will you use?") + " " + chalk.dim("(JS/TS, defaults to TS)") + " ");
    input = input.toLowerCase().trim();
    
    if (input !== '') {
        if (['js', 'javascript'].includes(input)) {
            language = 'JavaScript';
        }
        else if (['ts', 'typescript'].includes(input)) {
            language = 'TypeScript';
        }
        else {
            console.error(chalk.red("error: ") + `${input} is not a valid language to use for a SudoBot extension`);
            rl.close();
            process.exit(-1);
        }
    }

    rl.close();

    if (fs.existsSync(targetDirectory) && fs.readdirSync(targetDirectory).length > 0) {
        console.error(chalk.red("error: ") + `Target directory ${targetDirectory} is not empty!`);
        process.exit(-1);
    }

    console.log(chalk.blue("info: Creating a SudoBot extension"));
    console.log(`${chalk.bold("Destination: ")} ${targetDirectory}`);
    console.log(`${chalk.bold("Language: ")}    ${language}`);

    if (language === "JavaScript") {
        createJavaScriptProject();
    }
    else if (language === "TypeScript") {
        createTypeScriptProject();
    }
}

function replace(file, token, value) {
    const contents = fs.readFileSync(file, {encoding:'utf-8'});
    fs.writeFileSync(file, contents.replace(token, value));
}

async function createJavaScriptProject() {
    fs.cpSync(path.resolve(__dirname, '../templates/js'), targetDirectory, {
        recursive: true
    });
    
    const packageJson = path.resolve(targetDirectory, 'package.json');
    const indexJs = path.resolve(targetDirectory, 'src/index.js');
    const extensionJson = path.resolve(targetDirectory, 'extension.json');

    replace(extensionJson, 'ENAME', name ?? path.basename(targetDirectory));
    replace(packageJson, 'ENAME', name ?? path.basename(targetDirectory));

    let className = (name ?? path.basename(targetDirectory)).replace(/\s+/, '');
    className = className[0].toUpperCase() + className.substring(1);

    replace(indexJs, 'EClassName', className);
}

async function createTypeScriptProject() {
    fs.cpSync(path.resolve(__dirname, '../templates/ts'), targetDirectory, {
        recursive: true
    });
    
    const packageJson = path.resolve(targetDirectory, 'package.json');
    const indexTs = path.resolve(targetDirectory, 'src/index.ts');
    const extensionJson = path.resolve(targetDirectory, 'extension.json');

    replace(extensionJson, 'ENAME', name ?? path.basename(targetDirectory));
    replace(packageJson, 'ENAME', name ?? path.basename(targetDirectory));

    let className = (name ?? path.basename(targetDirectory)).replace(/\s+/, '');
    className = className[0].toUpperCase() + className.substring(1);

    replace(indexTs, 'EClassName', className);
}

main();
