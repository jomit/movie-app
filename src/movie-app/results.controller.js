angular.module("movieApp")
    .controller("ResultsController", function ($scope, $location, omdbApi, $exceptionHandler) {
        var query = $location.search().q;
        omdbApi.search(query)
               .then(function (data) {
                   $scope.results = data.Search;
               })
               .catch(function (e) {
                   //$scope.errorMessage = "Something went wrong!";
                   //throw "Something went wrong!";
                   $exceptionHandler(e);
               });

        $scope.expand = function expand(index, id) {
            omdbApi.find(id)
                .then(function (data) {
                    $scope.results[index].data = data;
                    $scope.results[index].open = true;
                });
        };

    });