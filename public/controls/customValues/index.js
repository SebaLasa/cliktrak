angular.module('clicks').directive('customValues', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/controls/customValues/index.html',
        scope: {
            selected: '=',
            disabled: '='
        },
        controller: function ($scope) {
            $scope.customValues = _.map(_.range(15), function (x) {
                return { value: 'parameter' + x, name: 'Parámetro ' + (x + 1) };
            });
        }
    };
});
