angular.module('admin').controller('homeController', function ($scope, $http) {
    $scope.ranSuccessfully = false;
    $scope.run = function () {
        $scope.ranSuccessfully = false;
        $http.get('/api/run').success(function (data) {
            $scope.ranSuccessfully = true;
        });
    };
});
