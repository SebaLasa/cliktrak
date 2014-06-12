app.controller('customPageEditorController', function ($scope, $http, $location, $routeParams) {
        if ($routeParams.id) {
            $http.get('/api/campaigns/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.campaign = data;
                }).error(function (data, status) {
                    $location.path('campaigns');
                });
        }

        $scope.save = function () {
            if ($routeParams.id) {
                return $http.put('/api/campaigns/' + $routeParams.id, $scope.campaign)
                    .success(function (data, status) {
                        $location.path('campaigns');
                    });
            }
            $http.post('/api/campaigns/', $scope.campaign)
                .success(function (data, status) {
                    $location.path('campaigns');
                });
        }
    }
);