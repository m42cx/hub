/* jslint node: true */

'use strict';

exports.clientName = 'dagcoin-wallet';
exports.minClientVersion = '2.0.0';

// https://console.developers.google.com
exports.pushApiProjectNumber = 0;
exports.pushApiKey = '';

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

exports.initial_witnesses = [
    "2OY57MQYKZSFDJXLDUFDEMNK7TMMBL5L",
    "J72HTGBVYZPEHMXLCPBJHH4OHZRASU2H",
    "L4XM66D4XJM7XKVOMSMDCZ5SJDWTLAVG",
    "QLQSJ4VMDHF5YD4VBVKMQ2XTATQS735Q",
    "WCKDY6NUPSTKA2UYBW5WFIZNPJ6VA2LG",
    "YHVFZ7IMRM7FZAVJ2YRJVIWSJEN5O7HB"
];

exports.MERCHANT_INTEGRATION_API = 'https://api.dagpay.io/api/invoices';
exports.WS_PROTOCOL = "ws://";
exports.port = 16611;
exports.getUnitPort = 28952;


console.log('finished hub conf');