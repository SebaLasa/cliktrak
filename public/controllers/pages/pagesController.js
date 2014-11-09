angular.module('clicks').controller('pagesController', function ($scope, $http, $window) {
    $scope.host = $window.location.host;
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
    $scope.getDisplayPageLink = function (page) {
        var url = 'http://';
        if (!page.forCustomPages) {
            url += page.urlConfiguration.subdomain + '.';
        }
        return url + $scope.host + '/p/' + page.company + '.' + page._id + '/testing';
    }
});