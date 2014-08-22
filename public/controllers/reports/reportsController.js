angular.module('clicks').controller('reportsController', function ($scope, $http, $location, $routeParams) {
    $scope.backLink = '/' + $routeParams.pageType;
    $scope.downloadLink = '/api/reports/' + $routeParams.pageType + '/' + $routeParams.id + '/download';
    $http.get('/api/reports/' + $routeParams.pageType + '/' + $routeParams.id)
        .success(function (data) {
            $scope.report = data;

            $scope.daysData = {
                "series" : ["clicks"],
                "data" : _.map($scope.report.clicksPerDay,function(dayData){
                    return {x:dayData["day"],y: dayData["count"]}
                })
            }
        });
    var config = {
        title: 'Tu Vieja',
        tooltips: true,
        labels: false,
        legend: {
            display: true,
            //could be 'left, right'
            position: 'left'
        }
    }

    $scope.daysConfig = config;
    $scope.daysChartType = 'bar';
});