angular.module('clicks').controller('campaignsController', function ($scope, $http) {
    $http.get('/api/campaigns/')
        .success(function (data, status) {
            $scope.campaigns = data;
        });
});