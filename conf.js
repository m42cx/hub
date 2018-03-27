/*jslint node: true */
"use strict";

exports.clientName = 'dagcoin';
exports.minClientVersion = '1.4.3';

// https://console.developers.google.com
exports.pushApiProjectNumber = 0;
exports.pushApiKey = '';

exports.port = 26611;
//exports.myUrl = 'wss://mydomain.com/bb';
exports.bServeAsHub = true;
exports.bSaveJointJson = true;
exports.bLight = false;

// this is used by wallet vendor only, to redirect bug reports to developers' email
exports.bug_sink_email = 'admin@example.org';
exports.bugs_from_email = 'bugs@example.org';

exports.HEARTBEAT_TIMEOUT = 300*1000;

exports.storage = 'sqlite';


exports.initial_witnesses = [
	'DKXEANWQQDYVTWQEJS5MBLMGGQBC5BFT',
	'Z2XQRGHWRCGDWP2DK4PIHXFEIZ3O7PRB'
];

exports.initial_peers = [];

exports.trustedRegistries = {
	'AM6GTUKENBYA54FYDAKX2VLENFZIMXWG': 'market'
};

console.log('finished hub conf');
