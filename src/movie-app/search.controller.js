angular.module("movieApp")
    .controller("SearchController", function ($location,$timeout) {
        var searchController = this;
        var timeout;
        searchController.search = function () {
            $timeout.cancel(timeout);
            if (searchController.query) {
                $location.path("/results").search("q", searchController.query);
            }
        };

        searchController.keyup = function () {
            timeout = $timeout(searchController.search(), 1000);
        };

        searchController.keydown = function () {
            $timeout.cancel(timeout);
        };
    }); 