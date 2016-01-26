describe("Home Controller", function () {
    var results = [
	      {
	          "Title": "Star Wars: Episode IV - A New Hope",
	          "Year": "1977",
	          "imdbID": "tt0076759",
	          "Type": "movie"
	      },
	      {
	          "Title": "Star Wars: Episode V - The Empire Strikes Back",
	          "Year": "1980",
	          "imdbID": "tt0080684",
	          "Type": "movie"
	      },
	      {
	          "Title": "Star Wars: Episode VI - Return of the Jedi",
	          "Year": "1983",
	          "imdbID": "tt0086190",
	          "Type": "movie"
	      }
    ];
    var $scope;
    var $interval;
    var $q;
    var $controller;
    var $rootScope;
    var omdbApi;
    var PopularMovies;
    var $exceptionHandler;
    var $log;

    beforeEach(module("movieApp"));

    //beforeEach(inject(function (_$q_, _PopularMovies_) {
    //    spyOn(_PopularMovies_, "get").and.callFake(function () {
    //        var deferred = _$q_.defer();
    //        deferred.resolve(["tt0076759", "tt0080684", "tt0086190"]);
    //        return deferred.promise;
    //    });
    //}));

    beforeEach(module(function ($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode("log");
    }));

    beforeEach(module(function ($logProvider) {
        $logProvider.debugEnabled(true);
    }));

    beforeEach(inject(function (_$q_, _omdbApi_) {
        spyOn(_omdbApi_, "find").and.callFake(function () {
            var deferred = _$q_.defer();
            var args = _omdbApi_.find.calls.mostRecent().args[0];
            if (args === "tt0076759") {
                deferred.resolve(results[0]);
            } else if (args === "tt0080684") {
                deferred.resolve(results[1]);
            } else if (args === "tt0086190") {
                deferred.resolve(results[2]);
            } else if (args === "ttError") {
                deferred.reject("error finding movie");
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
        });
    }));

    beforeEach(inject(function (_$controller_, _$q_, _$interval_,
        _$rootScope_, _omdbApi_, _PopularMovies_, _$exceptionHandler_,
        _$log_) {
        $scope = {};
        $interval = _$interval_;
        $q = _$q_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        omdbApi = _omdbApi_;
        PopularMovies = _PopularMovies_;
        $exceptionHandler = _$exceptionHandler_;
        $log = _$log_;
    }));

    it("should rotate movies every 5 seconds", function () {

        spyOn(PopularMovies, "query").and.callFake(function (callback) {
            //var deferred = $q.defer();
            //deferred.resolve(["tt0076759", "tt0080684", "tt0086190"]);
            //return deferred.promise;
            callback(["tt0076759", "tt0080684", "tt0086190"]);
        });

        $controller("HomeController", {
            $scope: $scope,
            $interval: $interval,
            omdbApi: omdbApi,
            PopularMovies: PopularMovies
        });
        $rootScope.$apply(); //this is needed as we are using promises

        expect($scope.result.Title).toBe(results[0].Title);
        $interval.flush(5000);
        expect($scope.result.Title).toBe(results[1].Title);
        $interval.flush(5000);
        expect($scope.result.Title).toBe(results[2].Title);
        $interval.flush(5000);
        expect($scope.result.Title).toBe(results[0].Title);

        //$log.reset();
        //$log.assertEmpty();  //this will throw exception if any of the log level have value

        expect($log.log.logs[0]).toEqual(["standard log"]);

        console.log(angular.mock.dump($log.log.logs));
        console.log(angular.mock.dump($log.info.logs));
        console.log(angular.mock.dump($log.error.logs));
        console.log(angular.mock.dump($log.warn.logs));
        console.log(angular.mock.dump($log.debug.logs));

    });

    it("should handle error", function () {

        spyOn(PopularMovies, "query").and.callFake(function (callback) {
            //var deferred = $q.defer();
            //deferred.resolve(["tt0076759", "tt0080684", "tt0086190","ttError"]);
            //return deferred.promise;
            callback(["tt0076759", "tt0080684", "tt0086190", "ttError"]);
        });

        $controller("HomeController", {
            $scope: $scope,
            $interval: $interval,
            omdbApi: omdbApi,
            PopularMovies: PopularMovies
        });
        $rootScope.$apply(); //this is needed as we are using promises

        expect($scope.result.Title).toBe(results[0].Title);
        $interval.flush(5000);
        expect($scope.result.Title).toBe(results[1].Title);
        $interval.flush(5000);
        expect($scope.result.Title).toBe(results[2].Title);
        $interval.flush(5000);
        //expect($scope.result.Title).toBe(results[0].Title);

        expect($exceptionHandler.errors).toEqual(["error finding movie"]);
    });
});