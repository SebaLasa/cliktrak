angular.module('admin').controller('userDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/users/' + $routeParams.id)
        .success(function (data, status) {
            $scope.user = data;
        });

    $scope.delete = function () {
        $http.delete('/api/users/' + $routeParams.id, $scope.user)
            .success(function (data, status) {
                $location.path('users');
            });
    }
});