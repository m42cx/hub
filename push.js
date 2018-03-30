const db = require('core/db');
const conf = require('core/conf');
const eventBus = require('core/event_bus.js');
const https = require('https');


eventBus.on('peer_sent_new_message', (ws, objDeviceMessage) => {
    sendPushAboutMessage(objDeviceMessage.to);
});

eventBus.on('enableNotification', (deviceAddress, registrationId) => {
    db.query('SELECT device_address FROM push_registrations WHERE device_address=? LIMIT 0,1', [deviceAddress], (rows) => {
        if (rows.length === 0) {
            db.query(`INSERT ${db.getIgnore()} INTO push_registrations (registrationId, device_address) VALUES (?, ?)`, [registrationId, deviceAddress], () => {

            });
        } else if (rows.length) {
            if (rows[0].registration_id !== registrationId) {
                db.query('UPDATE push_registrations SET registrationId = ? WHERE device_address = ?', [registrationId, deviceAddress], () => {

                });
            }
        }
    });
});

eventBus.on('disableNotification', (deviceAddress, registrationId) => {
    db.query('DELETE FROM push_registrations WHERE registrationId=? and device_address=?', [registrationId, deviceAddress], () => {

    });
});

function sendRest(registrationIds) {
    const options = {
        host: 'android.googleapis.com',
        port: 443,
        path: '/gcm/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${conf.pushApiKey}`
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            if (res.statusCode !== 200) {
                console.log(`Error push rest. code: ${res.statusCode} Text: ${d}`);
                console.log(registrationIds);
            }
        });
    });
    req.write(JSON.stringify({
        registration_ids: registrationIds,
        data: {
            message: 'New message',
            title: 'Dagcoin',
            vibrate: 1,
            sound: 1
        }
    }));
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

function sendPushAboutMessage(device_address) {
    db.query('SELECT registrationId FROM push_registrations WHERE device_address=?', [device_address], (rows) => {
        if (rows.length > 0) {
            sendRest([rows[0].registrationId]);
        }
    });
}

exports.sendPushAboutMessage = sendPushAboutMessage;
