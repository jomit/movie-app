angular.module("movieApp")
    .controller("HomeController", function ($scope, $interval, omdbApi, PopularMovies, $exceptionHandler, $log) {
        $log.log("standard log");
        $log.info("info log");
        $log.error("error log");
        $log.warn("warn log");
        $log.debug("some debug info");

        var results = [];
        var idx = 0;

        var findMovie = function (id) {
            omdbApi.find(id)
                   .then(function (data) {
                       $scope.result = data;
                   })
                   .catch(function (e) {
                       $exceptionHandler(e);
                   });
        };

        PopularMovies.get()
            .then(function (data) {
                //var data = ["tt0076759", "tt0080684", "tt0086190"];  //temporary as PopularMovies.get is not implemented
                results = data;
                findMovie(results[0]);
                $interval(function () {
                    ++idx;
                    findMovie(results[idx % results.length]);
                }, 5000);
        });
    });