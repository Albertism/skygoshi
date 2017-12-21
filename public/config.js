(function () {
    angular
        .module("SkyGoshiWebsite")
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {
        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        $routeProvider
            .when("/", {
                templateUrl: "views/templates/index.view.client.html",
                controller: "homeController",
                controllerAs: "model"
            });
    }
})();
