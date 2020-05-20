var fs = require('fs');
const express = require('express');
const movieTrailer = require('movie-trailer');
const movieArt = require('movie-art');
const router = express.Router();

const hypertube = require('./hypertube');
const yifysubtitles = require('yifysubtitles');
const query = require('yify-search');
var path = require('path');
var app = express();
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');
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
    var trailer;
	

    hypertube.getMovie({id: id}, function(movie){
        movieTrailer(movie.title).then(function (error, response) {
            if (error) {
				resolve("404")
				console.log("No matches on YTS for '" + mdb_res.title + "'");
            }
            else {
                trailer = response.replace('watch?v=', 'embed/');
                trailer = trailer + '?rel=0&vq=hd720&showinfo=0'; //youtube trailer options
            }

        }).then(function(){
			
			const range = req.headers.range
			if (range) {
				const parts = range.replace(/bytes=/, "").split("-")
				var engine = torrentStream(req.session.magnetURI)
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
								const head = {'Content-Range': `bytes ${start}-${end}/${fileSize}`,
								'Accept-Ranges': 'bytes',
								'Content-Length': chunksize,
								'Content-Type': 'video/mp4'
								}
								res.writeHead(206, head)
								stream.pipe(res)
								}
								});
								});
								}else {
									magnet_promise.then(function (value) {
										if (value == "404") {
											req.flash('error', 'Video Not Found');
											res.redirect('/home') //we need to do something when the YTS doesn't have the movie
											} else {
												req.session.magnetURI = value
												// console.log(value);
												res.render('video', {
													subtitles: subtitlesArr
													})
													}
													});
													}
    
        });
    });
});

module.exports = router;
