const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./backend/lambda.ts'],
  outfile: './backend/dist/lambda.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
}).catch(() => process.exit(1))