'use strict';
const 
    config = require('./config/jubat.json');
const 
    jubat = {
        package: require(config.package),
        log: require(config.log),
        src: require(config.src),
        dest: require(config.dest),
        git: require(config.git)
    };
module.exports = jubat;
