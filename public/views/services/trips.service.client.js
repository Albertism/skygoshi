/**
 * Created by berti on 7/24/2017.
 */
(function () {
    angular
        .module("SkyGoshiWebsite")
        .service("tripService", tripService);

    function tripService($http) {
        this.createTrip = createTrip;
        this.deleteTrip= deleteTripy;
        this.getTrips = getTrips;

        function getTrips() {
            var url="/api/test/trips";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createTrip(entity) {
            var url= "/api/test/trips";
            return $http.post(url, entity)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteTrip(entityId) {
            var url = "/api/test/trips" + entityId;

            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();