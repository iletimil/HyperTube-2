const moviesCtrl = require('../controllers/video');

const express = require('express');
const movieArt = require('movie-art');
const router = new express.Router();
const mdb = require('moviedb')('f013ab8b2052b4a48d90ae4c2a58d615');


router.route('/')
	.get(moviesCtrl.getStream);

module.exports = router;