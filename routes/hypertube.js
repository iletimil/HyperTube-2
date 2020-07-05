var http = require("https");

class   Hypertube {
    constructor() {
        this.currentResult = null;
        this.currentPath = null;
    }

    searchTvShows(object, callback) {
        this.currentPath = "/3/search/tv?query=" + object.query + "&include_adult=false&page=1";
        this.display(function(tvShows){
            callback(tvShows);
        });
    }

    getTvShow(object, callback){
        this.currentPath = "/3/tv/" + object.id + "?";
        this.display(function(tvShow){
            callback(tvShow);
        });
    }

    searchMovies(object, callback) {
        this.currentPath = "/3/search/movie?query=" + object.query + "&include_adult=false&page=1";
        this.display(function(movies){
            callback(movies);
        });
    }

    getTrending(object, callback) {
        this.currentPath = "/3/trending/"+object.type+"/"+object.timeFrame+"?";
        this.display(function(movies){
            callback(movies);
        });
    }

    getMovie(object, callback) {
        if (object.video == false)
            this.currentPath = "/3/movie/"+ object.id +"?";
        else
            this.currentPath = "/3/movie/"+ object.id +"?";

        this.display(function(movie){
            callback(movie);
        });
    }

    getSeason(object, callback) {
        if (object.video == true)
            this.currentPath = "/3/tv/"+object.id+"/season/"+object.seasonNumber+"/videos?";
        else
            this.currentPath = "/3/tv/"+object.id+"/season/"+object.seasonNumber+"?";
        this.display(function(season){
            callback(season);
        });
    }

    getSimilarMovies(object, callback) {
        this.currentPath = "/3/movie/"+ object.id +"/similar?page=1";
        this.display(function(movies){
            callback(movies);
        });
    }

    getTvRecommendations(object, callback) {
        this.currentPath = "/3/tv/"+object.id+"/recommendations?";
        this.display(function(movies){
            callback(movies);
        });
    }

    discoverMovies(callback) {
        this.currentPath = "/3/discover/movie?page=1&include_video=true&include_adult=false&sort_by=popularity.desc";
        this.display(function(movies){
            callback(movies);
        });
    }

    getUpcoming(callback) {
        this.currentPath = "/3/movie/upcoming?page=1";
        this.display(function(movies){
            callback(movies);
        });
    }
	

    display(callback) {
        var movies;
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": encodeURI(this.currentPath + "&language=en-US&api_key=f013ab8b2052b4a48d90ae4c2a58d615"),
            "headers": {}
          };
    
    }
}

module.exports = new Hypertube;