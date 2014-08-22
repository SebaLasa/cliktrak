angular.module('clicks').controller('layoutsDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/layouts/' + $routeParams.id)
        .success(function (data, status) {
            $scope.layout = data;
        });

    $scope.delete = function () {
        $http.delete('/api/layouts/' + $routeParams.id, $scope.layout)
            .success(function (data, status) {
                $location.path('layouts');
            });
    }
});