var config = require('../config.js');
var configfunctions = require('../configfunctions.js');

var m = module.exports = {};

// NOTE: Services in this module:
// iddplugin: event => expected: {'hid': 'Hardware-ID'}
// iddremove: event => expected: {'hid': 'Hardware-ID'}
// iddscan: event => expected: {'hid': 'Hardware-ID','idk':'scanned rfid key (IDentificationKey)'}

m.use = function (socket) {

    socket.on('iddplugin', function (data) {
        var client = config.data.clients[socket.clientid];
        var found = false;
        var deviceId = "";
        if (client.devices === true) {
            for (var did in config.data.devices) {
                if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                    found = true;
                    config.runtime[did].client = socket.clientid;
                    return configfunctions.updateConfigAll(['devices', did, 'client']);
                }
            }
            if (!found) {
                console.log("New Device");
                config.createDevice('idd', 'IDD Device', data.hid, socket.clientid);
            }
        }
    });

    socket.on('iddremove', function (data) {
        var client = config.data.clients[socket.clientid];
        if (client.devices === true) {
            for (var did in config.data.devices) {
                if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                    config.runtime[did].client = '';
                    return configfunctions.updateConfigAll(['devices', did, 'client']);
                }
            }

        }
    });

    socket.on('iddscan', function (data) {
        var client = config.data.clients[socket.clientid];
        if (client.devices === true) {
            for (var did in config.data.devices) {
                if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                    for (var cid in config.data.clients) {
                        if (config.data.clients[cid].type === 'cashpanel' && config.data.clients[cid].idd === did) {
                            for (var k in config.runtime[cid].sockets) {
                                config.runtime[cid].sockets[k].iddscan({
                                    'hid': data.hid,
                                    'did': did,
                                    'idk': data.idk
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    socket.on('disconnect', function (data) {
        var client = config.data.clients[socket.clientid];
        if (client.devices === true) {
            for (var did in config.data.devices) {
                if (config.data.devices[did].type === 'idd' && config.runtime[did].client === socket.clientid) {
                    config.runtime[did].client = '';
                    return configfunctions.updateConfigAll(['devices', did, 'client']);
                }
            }
        }
    });
};