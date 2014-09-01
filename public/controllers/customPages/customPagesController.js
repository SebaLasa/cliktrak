angular.module('clicks').controller('customPagesController', function ($scope, $http) {
    $http.get('/api/customPages/')
        .success(function (data, status) {
            $scope.customPages = data;
        });
      
});