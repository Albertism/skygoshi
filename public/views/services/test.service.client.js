/**
 * Created by berti on 7/24/2017.
 */
(function () {
    angular
        .module("SkyGoshiWebsite")
        .service("testService", testService);

    function testService($http) {
        this.createEntity = createEntity;
        this.deleteEntity= deleteEntity;
        this.getEntities = getEntities;

        function getEntities() {
            var url="/api/test";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createEntity(entity) {
            var url= "/api/test";
            return $http.post(url, entity)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteEntity(entityId) {
            var url = "/api/test/" + entityId;

            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();