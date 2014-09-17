angular.module('clicks').directive('gender', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/controls/gender/index.html',
        scope: {
            selected: '=',
            disabled: '='
        },
        controller: function ($scope) {
            $scope.genders = [
                { name: 'Masculino', value: 'male' },
                { name: 'Femenino', value: 'female' }
            ];
        }
    };
});
