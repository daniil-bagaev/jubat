'use strict';
const 
    path = require('node:path'),
    fg = require('fast-glob');
const 
    src = (src) => {
        return fg.sync(src, {onlyFiles: true}).map(el => {
            return {
                fn: path.parse(el).name,
                dir: path.parse(el).dir,
                ext: path.parse(el).ext,
                src: el
            };
        });
    };
module.exports = src;
