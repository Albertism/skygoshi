/**
 * Created by berti on 7/24/2017.
 */
(function () {
    angular
        .module("SkyGoshiWebsite")
        .controller("homeController", homeController);

    function homeController($routeParams, homeService, $location, $route, NgTableParams) {
        var model = this;
        model.parseCSV = parseCSV;
        model.updateFile = updateFile;
        model.runAlgorithm = runAlgorithm;

        function init() {
        }
        init();

        function runAlgorithm() {
            var sliceTime = model.sliceTime;
            var clusterTime = model.clusterTime;
            var bearingDiff = model.bearingDiff;
            var data = model.actualData;

            var t0 = performance.now();

            homeService.runAlgorithm(data, sliceTime, clusterTime, bearingDiff)
                .then(function(data){
                    var t1 = performance.now();
                    var execTime = (t1-t0)/1000;
                    model.timeTaken = execTime.toFixed(2);
                    console.log("successfully retrieved took " + execTime.toFixed(2) + "seconds" );
                    console.log(data);
                    model.processedData = data;
                    model.presentData = new NgTableParams({}, {dataset: data.routes});
                    model.routeCount = countTotalTrips(data.routes);
                    model.aloneCount = countTotalTrips(data.alone);
                });
        }

        function updateFile() {
            model.fileLoaded= true;
        }

        function parseCSV() {
            var correctedPath = model.uploadedPath.replace('\\', "/");
            var date = model.pickedDate;
            homeService
                .parseCSV(correctedPath, date)
                .then(function(data) {
                    console.log("parsing complete");
                    model.actualData = data;
                    model.parsedData = new NgTableParams({}, {dataset: data});
                    model.dataCount = data.length;
                    console.log(data);
                });
        }

        function countTotalTrips(array) {
            var count = 0;
            for(var i = 0; i < array.length; i++) {
                count += array[i].clusters? array[i].clusters[0].trips.length : 1;
            }

            return count;
        }
    }
})();