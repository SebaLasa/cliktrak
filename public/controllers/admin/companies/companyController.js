angular.module('admin').controller('companyController', function ($scope, $http) {
    $http.get('/api/layouts/')
        .success(function (data, status) {
            $scope.layouts = data;
        });
    $scope.deletePage = function (id) {
        $http.delete('/api/layouts/' + id)
            .success(function (data, status) {

            });
    };
});