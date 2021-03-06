(function () {
    angular
        .module("skyGoshiDirectives", [])
        .directive("fileModel", ['$parse', fileModel])
        .directive("watchElement", watchElement);

    function fileModel($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }

    function watchElement() {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                homeAjax();
            }
        }
    }

})();