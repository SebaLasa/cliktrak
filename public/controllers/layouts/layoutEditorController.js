app.controller('layoutEditorController', function ($scope, $http, $location, $routeParams) {
        if ($routeParams.id) {
            $http.get('/api/layouts/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.customer = data;
                }).error(function (data, status) {
                    $location.path("layouts");
                });
        }

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/layouts/' + $routeParams.id, $scope)
                    .success(function (data, status) {
                        $location.path('layout');
                    });
            }
            $http.post('/api/layouts/', $scope)
                .success(function (data, status) {
                    $location.path('layout');
                });
        }
    }
);