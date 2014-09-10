angular.module('admin').controller('companyEditorController', function ($scope, $http, $location, $routeParams) {
        if ($routeParams.id) {
            $http.get('/api/companies/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.company = data;
                });
        }

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/companies/' + $routeParams.id, $scope.company)
                    .success(function (data, status) {
                        $location.path('companies');
                    });
            }
            $http.post('/api/companies/', $scope.company)
                .success(function (data, status) {
                    $location.path('companies');
                });
        }
    }
);