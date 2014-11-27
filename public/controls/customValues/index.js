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
            $scope.customValues = _.map(_.range(1, 16), function (x) {
                return { value: 'param' + x, name: 'Parámetro ' + x };
            });
        }
    };
});
