'use strict';
const 
    path = require('node:path'),
    fs = require('node:fs');
const
    source = require(path.join(__dirname, 'src.js')),
    log = require(path.join(__dirname, 'log.js')),
    destination = require(path.join(__dirname, 'dest.js'));
const 
    tasker = {
        opts: {
            mode: true,
            debug: false,
            logsave: false
        }, 
        run (files, task, opts) {
            let jub = {};
            jub.type =  (typeof task === 'object') ? (Array.isArray(task)) ? 'array' : undefined : (typeof task === 'string' || typeof task === 'function') ? typeof task : undefined;
            switch(jub.type) {
                case 'string':
                    jub.name = task;
                    //console.log(jub);
                    break;
                case 'array':
                    task.forEach(el => {
                        tasker.run(files, el, opts);
                    });
                    break;
                case 'function':
                    files.forEach(file => {
                        let 
                            content = fs.readFileSync(file.src).toString(),
                            result = task(content);
                        fs.unlinkSync(file.dest, (err) => {
                            if (err)
                                log ('Can`t delete existing file' + file.dest, {type: 'error', file: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});

                        });
                        /*let 
                            newer = fs.openSync(file.dest, 'w');
                        

                        fs.openSync(file.dest, 'w', (err, fd) => {
                            if (err)
                                if (err.code === 'EEXIST') 
                                    fs.unlinkSync(file.dest, err => {
                                        if (err)
                                    });
                        });
                        fs.mkdirSync(path.parse(file.dest).dir, result, err => {
                            if (err)
                                log ('Write file error' + file.dest, {type: 'error', file: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'})
                        })*/
                    });
                    break;
                default:
                    break;
            }

        },
        task(task, src, dest, opts, cb) {
            if(!src) {
                log('No source glob', {type: 'error', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                return;
            }
            if(!dest) {
                log('No destination glob', {type: 'error', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                return;
            }
            if(!task) {
                log('No task', {type: 'error', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                return;
            }
            if(!opts) 
                opts = {};
            if(typeof opts === 'function' || typeof opts === 'string') {
                cb = opts;
                opts = {};
            }
            if(!cb)
                cb = task;
            let 
                files = 
                    source(src)
                        .map(el => { return destination(dest, el, opts)})
                            .map(el => { return {src: el.src, dest: el.dest}});
            opts.taskname = task;
            tasker.run(files, cb, opts);
        }
    };
module.exports = tasker.task;
