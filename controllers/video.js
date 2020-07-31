const ctrlMovies = require('../controllers/movies');
const torrentStream = require('torrent-stream');
const request = require('request');
const path = require('path');
const fs = require('fs');
const pump = require('pump');
//const sleep = require('sleep');
let wireSwarm = require('peer-wire-swarm');
let download = require('download-file');
const srt2vtt = require('srt-to-vtt');


const getStream = (req, res) => {
    const { id } = req.query;
    ctrlMovies.isUploaded(id) // Check if the movie is uploaded or not
        .then(arrUploaded => {
            if (arrUploaded[0] === 'err') // If movie not found
                res.send();
            else // Otherwise download it
                downloadMovie(arrUploaded[1], id, req, res);
        }).catch((err) => {
        if (err) throw err;
    })
}

const downloadMovie = (magnet, id, req, res) => {
    let movie_title = '';
    // console.log('on download movie');
    const engine = torrentStream(req.session.magnetURI);
    engine.on('ready', () => {
        // console.log('Engine ready');
        let fileSize = undefined;

        engine.files.forEach(function (file) {
            if (
                path.extname(file.name) !== '.mp4' &&
                path.extname(file.name) !== '.avi' &&
                path.extname(file.name) !== '.mkv' &&
                path.extname(file.name) !== '.ogg'
            ) {
                // console.log('filename deselect:', file.name);
                file.deselect();
                return;
            }
            movie_title = file.name;
            // console.log('filename:', file);
            const ext = path.extname(file.name)

            let total = file.length;
            fileSize = total;
            let start = 0;
            let end = total - 1;
            file.select();

            // console.log(req.headers.range)
            if (req.headers.range) {
                let range = req.headers.range;
                let parts = range.replace(/bytes=/, '').split('-');
                let newStart = parts[0];
                let newEnd = parts[1];
                start = parseInt(newStart, 10);

                if (!newEnd) {
                    end = start + 100000000 >= total ? total - 1 : start + 100000000;
                }
                else
                    end = parseInt(newEnd, 10);
                let chunksize = end - start + 1;
                let head = {
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/' + ext.replace('.', ''),
                    Connection: 'keep-alive'
                }
                // console.log(head)
                res.writeHead(206, head);

                let stream = file.createReadStream({
                    start: start,
                    end: end
                });
                pump(stream, res);
            }
            else {
                res.send('Wrong header');
            }
        });
       /* engine.on('download', () => {
            // console.log('\n\n\n\n\n\n\n\nUIBAIUDU NAD(N(ANCN AN ND)CNA)N)N');
            console.log(movie_title.slice(0, -4), Math.trunc(engine.swarm.downloaded / fileSize * 100) + '%');
        })
        engine.on('idle', () => { // When the movie is downloaded -> update filePath in db and uploaded to 1
            console.log('downloaded' + filePath);
            ctrlMovies.updateMoviePath(id, filePath);
        })*/
    })
}

module.exports = {
    getStream
}