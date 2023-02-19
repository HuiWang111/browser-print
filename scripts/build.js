const { runCommand, getCwdPath } = require('./utils')

main()

async function main() {
  await runCommand('npm run build', { cwd: getCwdPath('packages/print-core') })
  await runCommand('npm run compile', { cwd: getCwdPath('packages/print-vue') })
  await runCommand('npm run compile', { cwd: getCwdPath('packages/print-vue3') })
}
