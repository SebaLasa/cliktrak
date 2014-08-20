angular.module('clicks').controller('reportsController', function ($scope, $http, $location, $routeParams) {
    $http.get('/api/reports/' + $routeParams.pageType + '/' + $routeParams.id)
        .success(function (data) {
            $scope.report = data;
        });
});