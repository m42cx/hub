/* jslint node: true */

'use strict';

exports.clientName = 'dagcoin';
exports.minClientVersion = '2.0.0';

// https://console.developers.google.com
exports.pushApiProjectNumber = 0;
exports.pushApiKey = '';

exports.getUnitPort = 28952;
exports.bServeAsHub = true;
exports.bSaveJointJson = true;
exports.bLight = false;

// this is used by wallet vendor only, to redirect bug reports to developers' email
exports.bug_sink_email = 'admin@example.org';
exports.bugs_from_email = 'bugs@example.org';

exports.HEARTBEAT_TIMEOUT = 300 * 1000;

exports.storage = 'sqlite';
exports.initial_peers = [];
exports.trustedRegistries = {};

console.log('finished hub conf');
