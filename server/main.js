const express = require('express');
const debug = require('debug')('app:server');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');
const compress = require('compression');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let session = require('express-session');

let dbUrl = 'mongodb://localhost/team-divider';

mongoose.connect(dbUrl, function(err, res){
  if(err) {
    console.log("DB CONNECTION FAILED: "+err)
  } else {
    console.log("DB CONNECTION SUCCES")
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser({limit: '50mb'}));

/*
app.use(session({
    secret: 'secret_key',
    resave: true,
    saveUnitialized: true
}));
*/

// Login endpoint
// Authentication and Authorization Middleware
/*
let auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Login endpoint
app.post('/api/login', function (req, res) {
    console.log(req.body)
  if (!req.body.username || !req.body.password) {
    res.send('login failed');    
  } else if(req.body.username === "amy" || req.body.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
  res.send('what is happening')
});
 
// Logout endpoint
app.get('/logout', auth, function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Apply gzip compression
*/

app.use(compress());
//app.use('/api', api);
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
    const compiler = webpack(webpackConfig);

    debug('Enabling webpack dev and HMR middleware');
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: project.paths.client(),
        hot: true,
        quiet: project.compiler_quiet,
        noInfo: project.compiler_quiet,
        lazy: false,
        stats: project.compiler_stats
    }));
    app.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr'
    }));

    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(project.paths.public()));

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.

    /*
    app.use('/login' , function (req, res, next) {
        const filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end()
        })
    });
    */

    app.use('*', function (req, res, next) {
        const filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end()
        })
    })
} else {
    debug(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
    );

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
    app.use(express.static(project.paths.dist()))
}

module.exports = app;
