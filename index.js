'use strict';
const 
    path = require('node:path'),
    config = require('./config/jubat.json');
const 
    jubat = {
        package: require(path.resolve(config.package))
    };
module.exports = jubat;
