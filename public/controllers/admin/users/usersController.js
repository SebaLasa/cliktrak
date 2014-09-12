angular.module('admin').controller('usersController', function ($scope, $http) {
    $http.get('/api/users/')
        .success(function (data, status) {
            $scope.users = data;
        });
    $scope.deleteUser = function (id) {
        $http.delete('/api/users/' + id)
            .success(function (data, status) {

            });
    };
});