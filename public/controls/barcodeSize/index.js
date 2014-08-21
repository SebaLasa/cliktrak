angular.module('clicks').directive("barcodeSize", function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/controls/barcodeSize/index.html',
        scope: {
            selected: '=',
            disabled: '='
        },
        controller: function ($scope) {
            $scope.sizes = [
                { name: 'Little', value: 30 },
                { name: 'Small', value: 50 },
                { name: 'Medium', value: 70 },
                { name: 'Big', value: 90 }
            ];
        }
    };
});
