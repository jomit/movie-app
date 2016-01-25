describe("Search Controller", function () {
    var $this;
    var $location;
    var $controller;

    beforeEach(module("movieApp"));

    beforeEach(inject(function (_$controller_,_$location_,_$timeout_) {
        $location = _$location_;
        $controller = _$controller_;
        $timeout = _$timeout_;
    }));

    it("should redirect to the query results page for non-empty query", function () {
        $this = $controller("SearchController", { $location: $location }, { query : "star wars"});
        $this.search();

        expect($location.url()).toBe("/results?q=star%20wars");
    });

    it("should not redirect to query results page for empty query", function () {
        $this = $controller("SearchController", { $location: $location }, { query: "" });
        $this.search();

        expect($location.url()).toBe("");
    });

    it("should redirect after 1 second of keyboard inactivity", function () {
        $this = $controller("SearchController", { $location: $location, $timeout: $timeout }, { query: "star wars" });
        $this.keyup();
        $timeout.flush();
        expect($timeout.verifyNoPendingTasks).not.toThrow();
        expect($location.url()).toBe("/results?q=star%20wars");
    });

    it("should cancel timout in keydown", function () {
        $this = $controller("SearchController", { $location: $location, $timeout: $timeout }, { query: "star wars" });
        $this.keyup();
        $this.keydown();
        //$timeout.flush();
        expect($timeout.verifyNoPendingTasks).not.toThrow();
    });

    it("should cancel timout on search", function () {
        $this = $controller("SearchController", { $location: $location, $timeout: $timeout }, { query: "star wars" });
        $this.keyup();
        $this.search();
        
        expect($timeout.verifyNoPendingTasks).not.toThrow();
    });
});