app.controller('pageEditorController', function ($scope, $http, $location, $routeParams) {
        $http.get('/api/layouts/').success(function (data, status) {
            $scope.layouts = data;
        });
        if ($routeParams.id) {
            $http.get('/api/pages/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.page = data;
                }).error(function (data, status) {
                    $location.path('pages');
                });
        }

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/pages/' + $routeParams.id, $scope.page)
                    .success(function (data, status) {
                        $location.path('pages');
                    });
            }
            $http.post('/api/pages/', $scope.page)
                .success(function (data, status) {
                    $location.path('pages');
                });
        }
    }
);