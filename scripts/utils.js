const { spawn } = require('child_process')
const { join } = require('path')

const cwd = process.cwd()

function isNil(val) {
  return val == null
}

async function runCommand(
  command,
  {
    cwd = cwd,
    stdio = 'inherit',
    beforeRun,
  } = {
    cwd,
    stdio: 'inherit'
  }
) {
  return new Promise((resolve, reject) => {
    const shouldToRun = beforeRun && beforeRun(command)
    if (shouldToRun === false) {
      return
    }

    const [cmd, ...args] = command.split(' ')
    let data = ''

    const app = spawn(cmd, args, {
      cwd,
      stdio: stdio === null ? undefined : stdio,
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.stdout && app.stdout.on('data', (message) => {
      if (isNil(stdio)) {
        data += message
      }
    })
    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)
      
      if (code === 0) resolve(isNil(stdio) ? data : undefined)
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
}

function getCwdPath(path) {
  return join(cwd, path)
}

module.exports = {
  runCommand,
  getCwdPath,
}
