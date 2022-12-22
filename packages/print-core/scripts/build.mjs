import { rollup } from 'rollup'
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser'

build()

async function build() {
  const output = {
    file: 'dist/printer.js',
    format: 'iife',
    name: 'Printer'
  }
  const baseOptions = {
    input: './src/index.ts',
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false
          }
        }
      })
    ]
  }

  try {
    const bundle = await rollup(baseOptions)
    const minifyBundle = await rollup({
      ...baseOptions,
      plugins: [
        ...baseOptions.plugins,
        terser()
      ]
    })

    bundle.write(output)
    minifyBundle.write({ ...output, file: 'dist/printer.min.js' })
  } catch(e) {
    console.error(e)
  }
}
