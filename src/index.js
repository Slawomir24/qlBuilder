const program = require('commander');
const argsFunctions = require('./packages/argumentsFunctions');
const helpers = require('./packages/helpers');
const common = require('./packages/common');
const currentVersion = require('..\\package.json').version

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

(async function () {
    program.version(currentVersion, '-v, --version', 'Output the current version');

    program
        .command('create [name]')
        .description('Create new project folder structure')
        .action(async function (name, options) {
            if (!name) common.write.log({ error: true, message: `Please specify project name`, exit: true })

            let init = await argsFunctions.create(name)

            if (init.error) common.writeLog('err', init.message, true)
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
        .action(async function (envName, options) {
            // if local config exists; src and dist folders exists
            let initialChecks = helpers.initialChecks.combined(envName)
            if (initialChecks.error) common.writeLog('err', initialChecks.message, true)

            // if the specified environment exists in the local config 
            // let envDetails = helpers.initialChecks.environment(envName)
            // if (envDetails.error) common.writeLog('err', envDetails.message, true)

            // if the required environment variables exists OR
            // the .qlbuilder exists in the home folder
            // if both exists - home folder config is returned
            // let envVariables = helpers.initialChecks.environmentVariables(envDetails.message[0])
            // if (envVariables.error) common.writeLog('err', envVariables.message, true)

            let script = await argsFunctions.getScript({ environment: initialChecks.message.env, variables: initialChecks.message.variables })
            if (script.error) common.writeLog('err', script.message, true)

            common.writeLog('ok', script.message, true)
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
        .action(async function (envName, options) {
            // if local config exists; src and dist folders exists
            let initialChecks = helpers.initialChecks.combined()
            if (initialChecks.error) common.writeLog('err', initialChecks.message, true)

            // if the specified environment exists in the local config 
            // let envDetails = helpers.initialChecks.environment(envName)
            // if (envDetails.error) common.writeLog('err', envDetails.message, true)

            let buildScript = await argsFunctions.buildScript()
            if (buildScript.error) common.writeLog('err', buildScript.message, true)

            common.writeLog('ok', buildScript.message, true)
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
            let checkUpdate = await argsFunctions.checkForUpdate()
            if (checkUpdate.error) common.writeLog('err', checkUpdate.message, true)

            common.writeLog('ok', checkUpdate.message, true)
        });

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

