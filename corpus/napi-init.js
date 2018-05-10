/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

/*
 * NAPI data initialization
 */

'use strict';

var constants = require('./util/constants');
var errors = require('./util/errors');
var fmt = require('util').format;
var mod_nicTag = require('./models/nic-tag');
var mod_net = require('./models/network');
var util_common = require('./util/common');
var util_ip = require('./util/ip');
var vasync = require('vasync');

// --- Internal helpers

/*
 * Create a nic tag in moray if it does not exist
 */
function initNicTag(app, log, params, callback) {
    log.info({ params: params }, 'initializing nic tag');

    mod_nicTag.get(app, log, { name: params.name }, function XXX(err, res) {
        if (err && err.name !== 'ResourceNotFoundError') {
            return callback(err);
        }

        if (res) {
            return callback();
        }

        mod_nicTag.create(app, log, params, function XXX2(cErr, tag) {
            if (cErr) {
                log.error(
                    cErr,
                    'Error creating initial nic tag "%s"',
                    params.name
                );
                return callback(cErr);
            }

            if (tag) {
                log.info(
                    { tag: tag.serialize() },
                    'Created initial nic tag "%s"',
                    params.name
                );
            }

            return callback();
        });
    });
}

/**
 * Loads a network specified in the config file into moray
 */
function initNetwork(app, log, name, netData, callback) {
    log.debug(netData, 'initNetwork: entry: %s', name);
    // Required values for every logical network:
    var required = ['network', 'netmask', 'startIP', 'endIP'];
    var missing = util_common.requireParams(required, netData);

    if (missing.length !== 0) {
        var reqErr = new errors.InvalidParamsError(
            'Missing parameters',
            missing
        );
        log.error(reqErr, 'initNetwork: %s: parameters required', name);
        return callback(reqErr);
    }

    var cidr = util_ip.netmaskToBits(netData.netmask);
    if (!cidr) {
        return callback(
            new Error(
                fmt(
                    'Invalid netmask for network "%s": %s',
                    name,
                    netData.netmask
                )
            )
        );
    }

    var map = {
        endIP: 'provision_end_ip',
        gateway: 'gateway',
        owner_uuids: 'owner_uuids',
        resolvers: 'resolvers',
        startIP: 'provision_start_ip',
        uuid: 'uuid',
        vlan: 'vlan_id'
    };
    var netParams = {
        name: name,
        nic_tag: name,
        subnet: fmt('%s/%d', netData.network, cidr)
    };
    util_common.translateParams(netData, map, netParams);

    // If uuid is empty, fall back to generating one
    if (!netParams.uuid) {
        delete netParams.uuid;
    }

    log.info(netParams, 'Creating initial nic tag / network "%s"', name);

    var createNet = true;

    return vasync.pipeline(
        {
            funcs: [
                function _initTag(_, cb) {
                    initNicTag(app, log, { name: name }, cb);
                },

                function _getNet(_, cb) {
                    var listOpts = {
                        app: app,
                        log: log,
                        params: { name: name }
                    };

                    mod_net.list(listOpts, function XXX(err, res) {
                        if (err) {
                            log.info(err, 'Error listing networks (%s)', name);
                            return cb(err);
                        }

                        if (res && res.length !== 0) {
                            createNet = false;
                        }
                        return cb();
                    });
                },
                function _createNet(_, cb) {
                    if (!createNet) {
                        log.info('Initial network "%s" already exists', name);
                        cb();
                        return;
                    }

                    var createOpts = {
                        app: app,
                        log: log,
                        params: netParams
                    };
                    mod_net.create(createOpts, function XXX(err, res) {
                        if (err) {
                            log.error(
                                err,
                                'Error creating initial network "%s"',
                                netParams.name
                            );
                            callback(err);
                            return;
                        }

                        if (res) {
                            log.info(
                                res.serialize(),
                                'Created initial network "%s"',
                                netParams.name
                            );
                        }

                        cb();
                        return;
                    });
                }
            ]
        },
        function XXX(err) {
            callback(err);
        }
    );
}

/**
 * Load initial data into NAPI:
 * - The overlay nic tag
 * - Any initial networks (admin, external) specified in the config file
 */
function loadInitialData(opts, callback) {
    var config = opts.config;
    var log = opts.log;

    if (!config.hasOwnProperty('initialNetworks')) {
        log.info('No initial networks specified in config file');
        callback();
        return;
    }

    var att = 1;
    var networks = Object.keys(config.initialNetworks);
    var timeout = null;
    log.info(
        { networks: networks },
        '%d initial networks specified in config file',
        networks.length
    );

    function createNetworkRetry() {
        log.debug(
            { attempt: att },
            'Creating initial networks from config file'
        );

        vasync.flat.pipeline(
            {},
            [
                function initOverlayTag(_, cb) {
                    var mtu;

                    if (!config.overlay.enabled) {
                        setImmediate(cb);
                        return;
                    }

                    /*
                     * The minimum nic tag MTU is 1500, as that's what most physical
                     * networks end up supporting. Therefore, if the overlay's MTU
                     * is say, 1400 (a common non-Jumbo frame configuration), we
                     * need to still create the nic tag at the minimum. Other
                     * software needs to always be explicit about what MTU it
                     * desires for the network (which has a much lower minimum MTU).
                     */
                    mtu = Math.max(
                        constants.OVERLAY_MTU,
                        constants.MTU_NICTAG_MIN
                    );
                    initNicTag(
                        opts.app,
                        log,
                        {
                            name: constants.OVERLAY_TAG,
                            mtu: mtu
                        },
                        function XXX(tagErr, tag) {
                            if (tagErr) {
                                cb(tagErr);
                                return;
                            }

                            if (tag) {
                                log.info(
                                    { tag: tag },
                                    'Created overlay nic tag'
                                );
                            }
                            cb();
                        }
                    );
                },
                function initNetworks(_, cb) {
                    vasync.forEachParallel(
                        {
                            inputs: networks,
                            func: function _createNetwork(name, cb2) {
                                initNetwork(
                                    opts.app,
                                    log,
                                    name,
                                    config.initialNetworks[name],
                                    cb2
                                );
                            }
                        },
                        function XXX(netErr) {
                            if (netErr) {
                                cb(netErr);
                                return;
                            }

                            log.info('Initial networks loaded successfully');
                            cb();
                        }
                    );
                }
            ],
            function XXX(err, res) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }

                if (err) {
                    if (res.operations[0].err) {
                        log.error(
                            { attempt: att, err: res.operations[0].err },
                            'Error creating overlay nic tag: retrying'
                        );
                    } else {
                        log.error(
                            { attempt: att, err: res.operations[1].err },
                            'Error loading initial networks: retrying'
                        );
                    }
                    att++;
                    timeout = setTimeout(createNetworkRetry, 10000);
                } else {
                    callback();
                }
            }
        );
    }

    createNetworkRetry();
}

module.exports = {
    loadInitialData: loadInitialData
};
