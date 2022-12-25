import { rollup } from 'rollup'
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

const options = { input: './src/index.ts' }

build()

async function build() {
  const baseOutput = {
    format: 'iife',
    name: 'Printer'
  }
  const outputs = [
    {
      ...baseOutput,
      file: 'dist/printer.es.js',
    },
    {
      ...baseOutput,
      file: 'dist/printer.es.min.js',
    },
    {
      ...baseOutput,
      file: 'dist/printer.js',
    },
    {
      ...baseOutput,
      file: 'dist/printer.min.js',
    }
  ]

  try {
    for (const output of outputs) {
      await createBundle(output)
    }
  } catch(e) {
    console.error(e)
  }
}

async function createBundle(output) {
  const tsOptions = {
    tsconfigOverride: {
      compilerOptions: {
        declaration: false
      }
    }
  }
  const isESM = output.file.includes('es')
  
  const bundle = await rollup({
    ...options,
    plugins: [
      typescript(tsOptions),
      output.file.includes('min') ? terser() : undefined,
      isESM ? undefined : getBabelOutputPlugin({
        allowAllFormats: true,
        presets: [
          [
            "@babel/preset-env",
            {
              "targets": {
                "chrome": "49",
                "ie": "10"
              }
            }
          ]
        ]
      })
    ]
  })

  bundle.write(output)
}
