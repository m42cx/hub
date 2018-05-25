/* jslint node: true */

'use strict';

require('relay');
const conf = require('./conf');
const network = require('core/network');
const eventBus = require('core/event_bus.js');
require('./push');

if (conf.trustedRegistries && Object.keys(conf.trustedRegistries).length > 0) { require('./asset_metadata.js'); }

eventBus.on('peer_version', (ws, body) => {
    if (body.program === conf.clientName) {
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

eventBus.on('mci_became_stable', function (mci) {
    const Unit = require('./services/unitUtility');
    console.log('STABLE MCI: ' + JSON.stringify(mci));

    const db = require('core/db');
    db.query('SELECT unit FROM units WHERE main_chain_index = ?', [mci], (rows) => {
        if (rows == null || rows.length === 0) {
            return;
        }

        rows.forEach((row) => {
            const unit = new Unit(row.unit);
            unit.load().then(() => {
                return unit.getInvoiceId();
            }).then((invoiceId) => {
                console.log(`UNIT ${unit.hash} WITH MCI ${mci} FOR INVOICE ${invoiceId}`);

                if (invoiceId == null) {
                    return;
                }

                const options = {
                    uri: `${conf.MERCHANT_INTEGRATION_API}/payment-unit-updated`,
                    method: 'POST',
                    json: {
                        invoiceId,
                        'paymentUnitId': unit.hash
                    }
                };

                const request = require('request');
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(`PAYMENT UNIT UPDATE ERROR: ${error}`);
                    }
                    console.log(`RESPONSE: ${JSON.stringify(response)}`);
                    console.log(`BODY: ${JSON.stringify(body)}`);
                });
            });
        });
    });
});

function receipt(receiptRequest) {
    const storage = require('core/storage');
    const db = require('core/db');

    const Unit = require('./services/unitUtility');
    const unit = new Unit(receiptRequest.unitHash);

    return unit.load()
    .then((u) => u.checkIsDagcoin())
    .then((isDagcoin) => {
        console.log('IS' + (isDagcoin?' RELATED ' : ' NOT RELATED ') + 'TO DAGCOIN');
        if (isDagcoin) {
            return checkAuthor(unit, receiptRequest.proof.address);
        } else {
            return Promise.resolve();
        }
    });
}

function checkAuthor(unit, address) {
    return unit.checkHasAuthor(address).then((hasAuthor) => {
        if(!hasAuthor) {
            console.log(`ADDRESS ${address} NOT FOUND IN UNIT ${unit.hash} AUTHORS`);
            return Promise.resolve(false);
        } else {
            console.log(`ADDRESS ${address} FOUND IN UNIT ${unit.hash} AUTHORS`);
        }
    });
}

function compareVersions(currentVersion, minVersion) {
    if (currentVersion === minVersion) return '==';

    var cV = currentVersion.match(/([0-9])+/g);
    var mV = minVersion.match(/([0-9])+/g);
    var l = Math.min(cV.length, mV.length);
    var diff;

    for (var i = 0; i < l; i++) {
        diff = parseInt(cV[i], 10) - parseInt(mV[i], 10);
        if (diff > 0) {
            return '>';
        } else if (diff < 0) {
            return '<'
        }
    }

    diff = cV.length - mV.length;
    if (diff == 0) {
        return '==';
    } else if (diff > 0) {
        return '>';
    } else if (diff < 0) {
        return '<';
    }
}

function startBalanceService() {
    var express = require('express');
    var app = express();

    // This responds a GET request for the /list_user page.
    app.get('/getAddressBalance', function (req, res) {
        const address = req.query.address;

        res.set("Connection", "close");

        getAddressBalances(address).then((balances) => {
            console.log(`BALANCES FOR ${address}: ${JSON.stringify(balances)}`);
            res.json(balances);
            res.end();
        });
    });

    app.get('/', function(req, res){
        res.sendStatus(200);
    })

    app.get('/getUnit', function (req, res) {
        const unitHash = req.query.unit;

        res.set("Connection", "close");

        const Unit = require('./services/unitUtility');
        const unit = new Unit(unitHash);

        return unit.load()
        .then((u) => {
            return unit.getPaymentInfo();
        }).then((u) => {
            res.json(u);
            res.end();
        }).catch((err) => {
            res.status(404).json({error: err});
            res.end();
        });
    });

    var server = app.listen(conf.getUnitPort, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log("Example app listening at http://%s:%s", host, port);
    });
}

function getAddressBalances(address) {
    return new Promise((resolve) => {
        const db = require('core/db');
        db.query(
            "SELECT COALESCE(outputs.asset, 'base') as asset, units.is_stable as stable, sum(outputs.amount) as amount \n\
            FROM outputs, units \n\
            WHERE units.unit = outputs.unit AND outputs.address = ? AND outputs.is_spent=0 \n\
            GROUP BY outputs.address, outputs.asset, units.is_stable",
            [address],
            (rows) => {
                const balances = {};

                balances['base'] = {};

                balances['base'].stable = 0;
                balances['base'].pending = 0;
                balances['base'].total = 0;

                for (let index in rows) {
                    const balance = rows[index];

                    if(!balances[balance.asset]) {
                        balances[balance.asset] = {
                            stable: 0,
                            pending: 0
                        };
                    }

                    if(balance.stable) {
                        balances[balance.asset].stable = balance.amount;
                    } else {
                        balances[balance.asset].pending = balance.amount;
                    }

                    balances[balance.asset].total = balances[balance.asset].stable + balances[balance.asset].pending;
                }

                resolve(balances);
            }
        );
    });
}

startBalanceService();
