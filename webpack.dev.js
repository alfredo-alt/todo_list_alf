import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: "eval-source-map",
  devServer: {
    static: './dist',
    watchFiles: ['./src/**/*'],
    port: 3000,                          // Opcional: define tu puerto favorito
    open: true,                          // Opcional: abre el navegador automáticamente
  },
});