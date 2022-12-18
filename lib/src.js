const 
    path = require('node:path'),
    fg = require('fast-glob');
module.exports = (src) => {
    return fg.sync(src, {onlyFiles: true}).map(el => {
        return {
            fn: path.parse(el).name,
            dir: path.parse(el).dir,
            ext: path.parse(el).ext,
            src: el
        };
    });
};
