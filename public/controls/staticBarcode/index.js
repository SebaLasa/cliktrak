angular.module('clicks').directive('staticBarcode', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/controls/staticBarcode/index.html',
        scope: { },
        controller: function ($scope) {

        }
    };
});
