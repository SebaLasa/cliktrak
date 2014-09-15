angular.module('clicks').controller('customPagesController', function ($scope, $http) {
    $http.get('/api/customPages/')
        .success(function (data, status) {
            $scope.customPages = data;
        });

    $scope.clearSend = function () {
        $scope.csv = $scope.customPage = null;
    };
    $scope.sendValues = function () {
        $('form').submit();
        $scope.clearSend();
    };
});