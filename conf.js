/* jslint node: true */

'use strict';

exports.clientName = 'dagcoin';
exports.minClientVersion = '2.0.0';

// https://console.developers.google.com
exports.pushApiProjectNumber = 0;
exports.WS_PROTOCOL = "ws://";
exports.pushApiKey = '';

exports.port = 16611;
exports.getUnitPort = 28952;
// exports.myUrl = 'wss://mydomain.com/bb';
exports.bServeAsHub = true;
exports.bSaveJointJson = true;
exports.bLight = false;

// this is used by wallet vendor only, to redirect bug reports to developers' email
exports.bug_sink_email = 'admin@example.org';
exports.bugs_from_email = 'bugs@example.org';

exports.HEARTBEAT_TIMEOUT = 300 * 1000;
exports.MERCHANT_INTEGRATION_API = 'https://api.dagpay.io/api/invoices';
exports.paymentApi = 'https://explorer.dagcoin.link/mocks/getPaymentById?paymentId=';

exports.storage = 'sqlite';

// testnet
// exports.initial_witnesses = [
// 	'DKXEANWQQDYVTWQEJS5MBLMGGQBC5BFT',
// 	'Z2XQRGHWRCGDWP2DK4PIHXFEIZ3O7PRB'
// ];

exports.initial_witnesses = [
    "2OY57MQYKZSFDJXLDUFDEMNK7TMMBL5L",
    "J72HTGBVYZPEHMXLCPBJHH4OHZRASU2H",
    "L4XM66D4XJM7XKVOMSMDCZ5SJDWTLAVG",
    "QLQSJ4VMDHF5YD4VBVKMQ2XTATQS735Q",
    "WCKDY6NUPSTKA2UYBW5WFIZNPJ6VA2LG",
    "YHVFZ7IMRM7FZAVJ2YRJVIWSJEN5O7HB"
];

exports.initial_peers = [];

exports.trustedRegistries = {};

console.log('finished hub conf');
