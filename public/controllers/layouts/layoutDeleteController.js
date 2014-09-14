angular.module('clicks').controller('layoutDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/layouts/' + $routeParams.id)
        .success(function (data, status) {
            $scope.layout = data;
        });

    $scope.delete = function () {
        $http.delete('/api/layouts/' + $routeParams.id)
            .success(function (data, status) {
                $location.path('layouts');
            });
    };
});