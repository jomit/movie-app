﻿angular.module("movieApp")
    .controller("HomeController", function ($scope, $interval, omdbApi, PopularMovies) {
        var results = [];
        var idx = 0;

        var findMovie = function (id) {
            omdbApi.find(id)
                   .then(function (data) {
                       $scope.result = data;
                   });
        };

        //PopularMovies.get()
        //    .then(function (data) {
        var data = ["tt0076759", "tt0080684", "tt0086190"];  //temporary as PopularMovies.get is not implemented
                results = data;
                findMovie(results[0]);
                $interval(function () {
                    ++idx;
                    findMovie(results[idx % results.length]);
                }, 5000);
         //   });
    });