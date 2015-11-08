import express from 'express';
import path from 'path';
import webpack from 'webpack';
import wconfig from './config.js';

function log(msg = this, level = 'log'){
  console[level](msg);
  return this;
}

// this will start up the server
const app = express();

const compiler = webpack(wconfig);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: wconfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname, '../')));

// start the falcor server
app.listen(3000, () => 'server started on port 3000'::log());

