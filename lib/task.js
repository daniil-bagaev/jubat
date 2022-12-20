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
            mode: true
        }, 
        search (opts) {
            let 
                jub = {},
                rootDirFiles = fs.readdirSync('./', (err, list) => {
                    if (err) return err;
                        return list;
                });
            rootDirFiles.forEach(el => {
                if (el === 'jub.js')
                    jub.file = el;
                if (el === 'plugins')
                    jub.plugins = el;
            });
            jub.lib = fs.readdirSync(path.join(__dirname, 'tasks'), (err, list) => {
                return list;
            });
            jub.pluginsFiles = 
                (jub.plugins) ? 
                    fs.readdirSync(jub.plugins, (err, list) => {
                        if (err) 
                            return err;
                        return list;
                }) : [];
            if(jub.pluginsFiles.length === 0)
                jub.pluginsFiles = undefined;
            jub.mode = '';
            if(opts.mode)
                jub.mode  = 'l';
            if (jub.file && jub.pluginsFiles)        
                jub.mode += 'fp';
            if (jub.file && !jub.pluginsFiles)
                jub.mode += 'f';
            if (!jub.file && jub.pluginsFiles)
                jub.mode += 'p';
            return jub;
        },
        run (files, task, opts) {
            log('You run ' + task + ' task', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
            let 
                startTime, 
                endTime;
            if (!opts)
                opts = {};
            if (!Object.keys(opts).length)
                opts = tasker.opts;
            let jub = tasker.search(opts);            
            switch(jub.mode) {
                case 'lfp':
                    log('Using jub.js file with plugins and built-in plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'lf':
                    log('Using jub.js file with built-in plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'lp':
                    log('Using plugins and built-in plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'fp':
                    log('Using jub.js file with plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'f':
                    log('Using jub.js file', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'p':
                    log('Using plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                case 'l':
                    log('Using built-in plugins', {color: 'yellow', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    break;
                default:
                    log('Nothing plugins to use', {type: 'error', filename: 'tasker.log', date: 'YYYY-MM-DD HH:mm:ss'});
                    return;
            }
            console.log(jub);
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
            tasker.run(files, cb, opts);
        }
    };
module.exports = tasker.task;
