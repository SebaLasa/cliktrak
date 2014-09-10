angular.module('admin').controller('companiesController', function ($scope, $http) {
    $http.get('/api/companies/')
        .success(function (data, status) {
            $scope.companies = data;
        });
    $scope.deleteCompany = function (id) {
        $http.delete('/api/companies/' + id)
            .success(function (data, status) {

            });
    };
});