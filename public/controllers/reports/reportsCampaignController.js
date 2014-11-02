angular.module('clicks').controller('reportsCampaignController', function ($scope, $http, $location, $routeParams) {
    $scope.backLink = '/' + $routeParams.pageType;
    $scope.downloadLink = '/api/reports/campaigns';
    $http.get('/api/reports/campaign/'+$routeParams.id)
        .success(function (data) {
            $scope.attribute = data.attribute;

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