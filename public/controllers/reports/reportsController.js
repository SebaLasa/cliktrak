angular.module('clicks').controller('reportsController', function ($scope, $http, $location, $routeParams) {
    $scope.backLink = '/' + $routeParams.pageType;
    $scope.downloadLink = '/api/reports/' + $routeParams.pageType + '/' + $routeParams.id + '/download';
    $http.get('/api/reports/' + $routeParams.pageType + '/' + $routeParams.id)
        .success(function (data) {
            $scope.report = data;
        });
});