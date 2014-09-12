angular.module('admin').controller('userEditorController', function ($scope, $http, $location, $routeParams) {
        if ($routeParams.id) {
            $http.get('/api/users/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.user = data;
                });
        }

        $http.get('/api/companies/')
            .success(function (data, status) {
                $scope.companies = data;
            });

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/users/' + $routeParams.id, $scope.user)
                    .success(function (data, status) {
                        $location.path('users');
                    });
            }
            $http.post('/api/users/', $scope.user)
                .success(function (data, status) {
                    $location.path('user');
                });
        }
    }
);