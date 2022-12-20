'use strict';
const 
    path = require('node:path');
const 
    jubat = {
        package: require(path.join(__dirname, 'package.json')),
        log: require(path.join(__dirname, 'lib', 'log.js')),
        src: require(path.join(__dirname, 'lib', 'src.js')),
        dest: require(path.join(__dirname, 'lib', 'dest.js')),
        git: require(path.join(__dirname, 'lib', 'git.js')),
        task: require(path.join(__dirname, 'lib', 'task.js'))
    };
module.exports = jubat;
