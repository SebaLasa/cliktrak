angular.module('clicks').controller('customPageDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/customPages/' + $routeParams.id)
        .success(function (data, status) {
            $scope.customPage = data;
        });

    $scope.delete = function () {
        return $http.delete('/api/customPages/' + $routeParams.id)
            .success(function (data, status) {
                $location.path('customPages');
            });
    };
});