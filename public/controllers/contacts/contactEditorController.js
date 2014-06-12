app.controller('contactEditorController', function ($scope, $http, $location, $routeParams) {
        if ($routeParams.id) {
            $http.get('/api/contacts/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.contact = data;
                }).error(function (data, status) {
                    $location.path('contacts');
                });
        }

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/contacts/' + $routeParams.id, $scope.contact)
                    .success(function (data, status) {
                        $location.path('contacts');
                    });
            }
            $http.post('/api/contacts/', $scope.contact)
                .success(function (data, status) {
                    $location.path('contacts');
                });
        }
    }
);