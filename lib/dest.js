const 
    dest = {
        config: {
            ext: {
                ".pug": ".php",
                ".less": ".css",
                ".js": ".js",
                ".json": ".json"
            }
        },
        dest (glob, file, opts) {
            let 
                srcArr = (file.dir).split('/'),
                destArr = glob.split('/'),
                fileArr = srcArr.map((el, i) => {
                    return (el === destArr[i]) ? el : (!destArr[i]) ? el : destArr[i];
                });
            file.destDir = fileArr.join('/');
            file.destFileName = (opts && opts.fileName) ? opts.fileName : file.fn;
            file.destExt = (opts && opts.ext) ? opts.ext : (dest.config.ext[file.ext]) ? dest.config.ext[file.ext] : file.ext;
            fileArr.push(file.destFileName+file.destExt);
            file.dest =  fileArr.join('/');

            return file;
        }
    };    
module.exports = dest.dest;