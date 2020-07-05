const express = require('express');
var torrentStream = require('torrent-stream');
const movieArt = require('movie-art');
const router = express.Router();
const hypertube = require('./hypertube');
const mdb = require('moviedb')('f013ab8b2052b4a48d90ae4c2a58d615');
const image_url = "http://image.tmdb.org/t/p/original/";

router.post('/', function(req, res, next) {

    //on movie search display all movies matching query
    hypertube.searchMovies({query: req.body.searchText} , function(movies) {
        res.render("display_movies", {
            title:'Hypertube | Movies',
            movies: movies.results,
            image_url: image_url
        });
    });
});


router.get('/display', function(req, res, next) {
    var id = req.query.id;
    

    hypertube.getMovie({id: id}, function(movie){
	const range = req.headers.range	
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		var engine = torrentStream(req.query.magnetURI)
		engine.on('ready', function () {



			engine.files.forEach(function (file) {
				if (file.name.match(/mp4$/)) {
					const fileSize = file.length
					const start = parseInt(parts[0], 10)
					const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
					const chunksize = (end - start) + 1
					var stream = file.createReadStream({
						start,
						end
					});
					const head = {
						'Content-Range': `bytes ${start}-${end}/${fileSize}`,
						'Accept-Ranges': 'bytes',
						'Content-Length': chunksize,
						'Content-Type': 'video/mp4'
					}
					res.writeHead(206, head)
					stream.pipe(res)
				}
			});
		});
	} else {
		console.log("nope");
    }
	
	});
});

module.exports = router;