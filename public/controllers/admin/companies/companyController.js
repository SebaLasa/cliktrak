angular.module('admin').controller('companyController', function ($scope, $http) {
    $http.get('/api/companies/')
        .success(function (data, status) {
            $scope.companies = data;
        });
    $scope.deletePage = function (id) {
        $http.delete('/api/companies/' + id)
            .success(function (data, status) {

            });
    };
});