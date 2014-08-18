angular.module('clicks').controller('campaignsController', function ($scope, $http) {
    $http.get('/api/customPages/')
        .success(function (data, status) {
            $scope.campaigns = data;
        });
});