angular.module('clicks').controller('pagesController', function ($scope, $http) {
    function loadPages() {
        $http.get('/api/pages/')
            .success(function (data, status) {
                $scope.pages = data;
            });
    }

    $scope.enable = function (page, enabled) {
        $http.post('/api/pages/enable/' + page._id, { enabled: enabled })
            .success(function (data, status) {
                loadPages();
            });
    };
    loadPages();
});