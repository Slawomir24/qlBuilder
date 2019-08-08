const program = require('commander');
const argsFunctions = require('./packages/argumentsFunctions');
const helpers = require('./packages/helpers')
const currentVersion = require('..\\package.json').version

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

(async function () {
    program
        .command('create [name]')
        .description('Create new project folder structure')
        .action(async function (name, options) {
            await argsFunctions.create(name)
        });

    program
        .command('setscript [env]')
        .description('Build and set the script')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.setScript(env)
        });

    program
        .command('getscript [env]')
        .description('Get the script from the target Qlik app and overwrite the local script')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.getScript(env)
        });

    program
        .command('checkscript [env]')
        .description('Check local script for syntax errors')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.checkScript(env)
        });

    program
        .command('watch [env]')
        .description('Start qlBuilder in watch mode')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.startWatching(program.reload, program.set, env)
        });

    program
        .command('build')
        .description('Combine the tab script files into one')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.buildScript()
        });

    program
        .command('reload [env]')
        .description('Set script and reload the target app')
        .action(async function (env, options) {
            helpers.initialChecks.combined()
            helpers.initialChecks.environment(env)
            await argsFunctions.reload(env)
        });

    program
        .command('checkupdate')
        .description('Check for qlBuilder updates')
        .action(async function () {
            await argsFunctions.checkForUpdate()
        });

    program
        .usage(' ')
        .version(currentVersion)
        .option('-r, --reload', '(optional) In watch mode - Reload the app on each file change')
        .option('-s, --set', '(optional) In watch mode - Build and set the script')

    program.on('--help', function () {
        console.log('')
        console.log('Examples:');
        console.log(' > qlbuilder setscript desktop');
        console.log(' > qlbuilder reload desktop');
        console.log(' > qlbuilder watch desktop -r');
        console.log(' > qlbuilder watch desktop -s');
    });

    program.on('command:*', function () {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
        process.exit(1);
    });

    program.parse(process.argv);
})()

