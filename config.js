// config.js
const path = require('path');

const config = {
    flaskPath: path.join(__dirname, 'flaskEnd', 'dist', 'flask_app.exe'),
    reactBuildPath: path.join(__dirname, 'pg1', 'build'),
    reactPath:path.join(__dirname, 'pg1')
};

module.exports = config;
