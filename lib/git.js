'use strict';
const 
    path = require('node:path'),
    fs = require('node:fs'),
    execSync = require('node:child_process').execSync,
    pack = require('../package.json');
const
    log = require(path.join(__dirname, 'log.js'));
const 
    gitter = {
        version: pack.version,
        opts: {
            title: '',
            msg: 'Add new features',
            type: 'patch',
            status: true,
            add: false,
            push: false,
            commit: false,
            statusE: 'git status -b --ignored=matching',
            addE: 'git add .',
            pushE: 'git push -u origin main',
            commitE: 'git commit -m'
        },
        bump (ver, type) {
            let 
                types = ver.split(/[.-]/),
                str,
                version = {};
            if (types[0])
                version.major = Number(types[0]);
            if (types[1])
                version.minor = Number(types[1]);
            if (types[2])
                version.patch = Number(types[2]);
            if (types[3])
                version.prerelease = types[3];
            switch(type) {
                case 'major':
                    version.major = version.major + 1;
                    version.minor = 0;
                    version.patch = 0;
                    version.prerelease = '';
                    break;
                case 'minor':
                    version.minor = version.minor + 1;
                    version.patch = 0;
                    version.prerelease = '';
                    break;
                case 'patch':
                    version.patch = version.patch + 1;
                    version.prerelease = '';
                    break;
                case 'prerelease':
                    if (!version.prerelease || version.prerelease === undefined)
                        version.prerelease = String.fromCharCode(97);
                    else if (version.prerelease)
                        version.prerelease = String.fromCharCode(version.prerelease.charCodeAt(version.prerelease.length - 1) + 1);
                    break;
            }     
            if (version.prerelease) 
                str = '-' + version.prerelease;
            str = '.' + version.patch + (str || '');
            str = '.' + version.minor + (str || '');
            str = version.major + (str || '');
            return str;
        },
        exec (cmd) {
            return execSync(cmd).toString();
        },
        git (opts) {
            if (!opts)
                opts = {};
            opts = (!Object.keys(opts).length) ? gitter.opts : {
                title: (opts.title || gitter.opts.title),
                msg: (opts.msg || gitter.opts.msg),
                type: (opts.type || gitter.opts.type),
                status: (opts.status || gitter.opts.status),
                add:  (opts.add || gitter.opts.add),
                commit: (opts.commit || gitter.opts.commit),
                push: (opts.push || gitter.opts.push),
                statusE: gitter.opts.statusE,
                addE:  gitter.opts.addE,
                commitE: gitter.opts.commitE,
                pushE: gitter.opts.pushE
            };
            let 
                ver = gitter.bump(gitter.version, opts.type);
                pack.version = ver;
            let 
                writePackage = JSON.stringify(pack, null, '\t');
            fs.writeFileSync(path.resolve('./package.json'), writePackage);
            if(!opts.title)
                opts.title = 'v.'+pack.version;
            let status, add, commit, push;
            if (opts.status)
                status = gitter.exec(opts.statusE).toString();
            if (opts.add) {
                status = gitter.exec(opts.statusE).toString();
                add = gitter.exec(opts.addE).toString();
            }
            if (opts.commit) {
                status = gitter.exec(opts.statusE).toString();
                add = gitter.exec(opts.addE).toString();
                commit =  gitter.exec(opts.commitE + '"' + opts.title + '"' + ' -m '+ '"' + opts.msg + '"').toString();
            }
            if (opts.push) {
                status = gitter.exec(opts.statusE).toString();
                add = gitter.exec(opts.addE).toString();
                commit =  gitter.exec(opts.commitE + '"' + opts.title + '"' + ' -m '+ '"' + opts.msg + '"').toString();
                push = gitter.exec(opts.pushE).toString();
            }
            log(status, {filename: 'gitter.log', header: '[Git status]', date: 'YYYY-MM-DD HH:mm:ss'});
            log(add, {filename: 'gitter.log', header: '[Git add]', date: 'YYYY-MM-DD HH:mm:ss'});
            log(commit, {filename: 'gitter.log', header: '[Git commit]', date: 'YYYY-MM-DD HH:mm:ss'});
            log(push, {filename: 'gitter.log', header: '[Git push]', date: 'YYYY-MM-DD HH:mm:ss'});
        }
    }
module.exports = gitter.git;
