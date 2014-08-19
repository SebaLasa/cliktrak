angular.module('clicks').controller('pagesController', function ($scope, $http) {
    $http.get('/api/pages/')
        .success(function (data, status) {
            $scope.pages = data;
        });
});