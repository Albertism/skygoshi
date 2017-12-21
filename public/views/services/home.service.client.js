/**
 * Created by berti on 7/24/2017.
 */
(function () {
    angular
        .module("SkyGoshiWebsite")
        .service("homeService", homeService);

    function homeService($http) {
        this.parseCSV = parseCSV;
        this.runAlgorithm = runAlgorithm;

        function runAlgorithm(input, sliceTime, clusterTime, bearingDiff) {
            var url="/api/parse/tripAlgorithm?slice_time=" + sliceTime
                + "&cluster_time=" + clusterTime + "&bearing_diff=" + bearingDiff;

            return $http.post(url, input)
                .then(function(response) {
                    return response.data;
                });
        }

        function parseCSV(path, date) {
            var url = "/api/parse/trips" + "?csv_path="+path+"&entry_date="+date;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();