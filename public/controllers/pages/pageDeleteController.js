angular.module('clicks').controller('pageDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/pages/' + $routeParams.id)
        .success(function (data, status) {
            $scope.page = data;
        });

    $scope.delete = function () {
        $http.delete('/api/pages/' + $routeParams.id)
            .success(function (data, status) {
                $location.path('pages');
            });
    };
});