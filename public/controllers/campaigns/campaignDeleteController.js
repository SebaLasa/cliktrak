angular.module('clicks').controller('campaignDeleteController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/campaigns/' + $routeParams.id)
        .success(function (data, status) {
            $scope.campaign = data;
        });

    $scope.delete = function () {
        if ($routeParams.id) {
            return $http.delete('/api/campaigns/' + $routeParams.id, $scope.campaign)
                .success(function (data, status) {
                    $location.path('campaigns');
                });
        }
        $http.post('/api/campaigns/', $scope.campaign)
            .success(function (data, status) {
                $location.path('campaigns');
            });
    };
});