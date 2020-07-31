
const Movies = require('../models/movies');
const request = require('request');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const pirateBay = require('thepiratebay')
const ptn = require('parse-torrent-name');
const mongoose = require('mongoose');
const oId = mongoose.Types.ObjectId;
const jwt = require('jsonwebtoken');

const isUploaded = (id) => {
    return new Promise((res, rej) => {
        hypertube.getMovie({ _id: id }, (err, doc) => {
                if (doc && doc[0]) {
                    console.log('Torrent not uploaded');
                    if (doc[0].uploaded === 0) {
                        if (doc[0].torrents[0].hash)
                            return res([false, 'magnet:?xt=urn:btih:' + doc[0].torrents[0].hash]);
                        else
                            return res([false, 'magnet:?xt=urn:btih:' + doc[0].torrents[0][1]]);
                    }
                    else
                        return res([true, doc[0].file_path]);

                }
                else
                    return res(['err', 'Movie not found']);
            });
    })
}

module.exports = {isUploaded}