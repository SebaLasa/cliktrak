angular.module('clicks').controller('campaignDeleteController', function ($scope, $http, $location, $routeParams) {
    
    $http.get('/api/campaigns/' + $routeParams.id)
            .success(function (data, status) {
                $scope.campaign = data.campaign;

                data.email.dateStart = data.email.dateStart.substr(0, 10);
                data.email.dateEnd = data.email.dateEnd.substr(0, 10);
                $scope.email = data.email;

            }).error(function (data, status) {
                $location.path('campaigns');
            });


      $scope.delete = function () {
        $http.delete('/api/campaigns/' + $routeParams.id)
            .success(function (data, status) {
                $location.path('campaigns');
            });
    };
});