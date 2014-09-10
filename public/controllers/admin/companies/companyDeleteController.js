angular.module('admin').controller('companyDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/companies/' + $routeParams.id)
        .success(function (data, status) {
            $scope.company = data;
        });

    $scope.delete = function () {
        $http.delete('/api/companies/' + $routeParams.id, $scope.company)
            .success(function (data, status) {
                $location.path('companies');
            });
    }
});