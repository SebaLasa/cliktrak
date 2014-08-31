angular.module('clicks').controller('reportsController', function ($scope, $http, $location, $routeParams) {
    $scope.backLink = '/' + $routeParams.pageType;
    $scope.downloadLink = '/api/reports/' + $routeParams.pageType + '/' + $routeParams.id + '/download';
    $http.get('/api/reports/' + $routeParams.pageType + '/' + $routeParams.id)
        .success(function (data) {
            $scope.report = data;

            $scope.daysData = {
                series : ["clicks"],
                data : _.map($scope.report.clicksPerDay,function(dayData){
                    return {x:dayData.day,y: [dayData.count]}
                })
            }

            $scope.deviceData = {
                series : ["devices"],
                data : _.map($scope.report.devices,function(deviceData){
                    return {
                        x: deviceData.device,
                        y: [deviceData.count]
                    }
                })
            }
        });

    $scope.daysChartType = 'bar';
    $scope.daysConfig = {
        title: '',
        tooltips: true,
        labels: false,
        legend: {
            display: true,
            //could be 'left, right'
            position: 'right'
        },
        innerRadius: 0,
        lineLegend: "lineEnd"
    };

    $scope.deviceChartType = 'pie';
    $scope.deviceConfig = {
        title: '',
        tooltips: false,
        labels: true,
        legend: {
            display: true,
            //could be 'left, right'
            position: 'left'
        }
    };
});