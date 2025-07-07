import terser from '@rollup/plugin-terser';

/**
 * Creates an output options object.
 * @param {import('rollup').OutputOptions} options
 * @returns {import('rollup').OutputOptions}
 */
const Option = (options) => ({
  exports: 'default',
  sourcemap: true,
  ...options,
});

/**
 * An object with all configuration for `Rollup.js`.
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: './src/index.js',
  output: [
    Option({
      file: './dist/index.js',
      format: 'commonjs',
    }),
    Option({
      file: './dist/index.esm.js',
      format: 'esm',
    }),
    Option({
      file: './dist/index.mjs',
      format: 'esm',
    }),
    Option({
      file: './dist/index.umd.js',
      name: 'createRequest',
      format: 'umd',
    }),
    Option({
      file: './dist/index.umd.min.js',
      name: 'createRequest',
      format: 'umd',
      plugins: [terser()],
    }),
  ],
};

export default options;
