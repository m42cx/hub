/* jslint node: true */

'use strict';

require('relay');
const conf = require('./conf');
const network = require('core/network');
const eventBus = require('core/event_bus.js');

if (conf.trustedRegistries && Object.keys(conf.trustedRegistries).length > 0) { require('./asset_metadata.js'); }

eventBus.on('peer_version', (ws, body) => {
    if (body.program == conf.clientName) {
        if (conf.minClientVersion && compareVersions(body.program_version, conf.minClientVersion) === '<') {
            network.sendJustsaying(ws, 'new_version', { version: conf.minClientVersion});
        }
        if (compareVersions(body.program_version, conf.minClientVersion) === '<') {
            ws.close(1000, 'mandatory upgrade');
        }
    }
});

function compareVersions(currentVersion, minVersion) {
    if (currentVersion === minVersion) return '==';

    const cV = currentVersion.match(/([0-9])+/g);
    const mV = minVersion.match(/([0-9])+/g);
    const l = Math.min(cV.length, mV.length);
    let diff;

    for (let i = 0; i < l; i++) {
        diff = parseInt(cV[i], 10) - parseInt(mV[i], 10);
        if (diff > 0) {
            return '>';
        } else if (diff < 0) {
            return '<';
        }
    }

    diff = cV.length - mV.length;
    if (diff === 0) {
        return '==';
    } else if (diff > 0) {
        return '>';
    } else if (diff < 0) {
        return '<';
    }
}

