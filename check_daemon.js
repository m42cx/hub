/* jslint node: true */

'use strict';

const check_daemon = require('core/check_daemon.js');

check_daemon.checkDaemonAndRestart('node start.js', 'node start.js 1>log 2>>errlog');

