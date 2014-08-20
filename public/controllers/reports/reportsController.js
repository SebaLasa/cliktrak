angular.module('clicks').controller('reportsController', function ($scope, $http, $location, $routeParams) {
    $scope.backLink = '/' + $routeParams.pageType + '/' + $routeParams.id;
    $http.get('/api/reports' + $scope.backLink)
        .success(function (data) {
            $scope.report = data;
        });
});