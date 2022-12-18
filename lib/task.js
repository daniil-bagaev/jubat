'use strict';
const 
    path = require('node:path'),
    fs = require('node:fs');
const
    source = require('../lib/src.js'),
    log = require('../lib/log.js'),
    destination = require('../lib/dest.js');
const 
    tasker = {
        run (files, task, opts) {
            
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


        }
    };
module.exports = tasker.task;
