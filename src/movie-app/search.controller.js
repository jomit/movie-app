angular.module("movieApp")
    .controller("SearchController", function ($location) {
        var searchController = this;
        searchController.search = function () {
            if (searchController.query) {
                $location.path("/results").search("q", searchController.query);
            }
        }
    });