describe("Results Controller", function () {
    var results = {
        "Search": [
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
        ]
    };

    var $scope;
    var $q;
    var $controller;
    var $location;
    var $rootScope;
    var $exceptionHandler;
    var omdbApi;
    

    beforeEach(module("omdb"));

    beforeEach(module(function ($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode("log");  //  'rethrow' or 'log' mode
    }));

    beforeEach(module("movieApp"));

    //beforeEach(inject(function (_$controller_,
    //    _$q_, _$rootScope_, _omdbApi_, _$location_) {
    //    $controller = _$controller_;
    //    $scope = {};
    //    $q = _$q_;
    //    $rootScope = _$rootScope_;
    //    omdbApi = _omdbApi_;
    //    $location = _$location_;
    //}));

    beforeEach(inject(function ($injector) {
        $controller = $injector.get("$controller");
        $scope = {};
        $q = $injector.get("$q");
        $rootScope = $injector.get("$rootScope");
        omdbApi = $injector.get("omdbApi");
        $location = $injector.get("$location");
        $exceptionHandler = $injector.get("$exceptionHandler");
    }));

    it("should load search results", function () {

        //jasmine mocking function to create a fake function call for omdbApi.search function
        spyOn(omdbApi, "search").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(results);
            return deferred.promise;
        });

        $location.search("q", "star wars");
        $controller("ResultsController", { $scope: $scope });

        //Resolve all pending "promises" to resolve so that we can get the results
        $rootScope.$apply();  

        expect($scope.results[0].Title).toBe(results.Search[0].Title);
        expect($scope.results[1].Title).toBe(results.Search[1].Title);
        expect($scope.results[2].Title).toBe(results.Search[2].Title);

        //Make sure that teh search function is called with a specific parameter value
        expect(omdbApi.search).toHaveBeenCalledWith("star wars");
    });

    it("should set result status to error", function () {
        spyOn(omdbApi, "search").and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject("Something went wrong!");
            return deferred.promise;
        });

        $location.search("q", "star wars");

        $controller("ResultsController", { $scope: $scope });
        $rootScope.$apply();
        //expect($scope.errorMessage).toBe("Something went wrong!");
        //console.log(angular.mock.dump($exceptionHandler.errors[0]));
        expect($exceptionHandler.errors).toEqual(['Something went wrong!']);

        //expect(function () {
        //    $controller("ResultsController", { $scope: $scope });
        //    $rootScope.$apply();
        //}).toThrow();
    });
});