angular.module('clicks').controller('pagesController', function ($scope, $http) {
    function loadPages(){
        $http.get('/api/pages/')
            .success(function (data, status) {
                $scope.pages = data;
            });
    }

    $scope.deletePage = function (id) {
        $http.delete('/api/pages/' + id)
            .success(function (data, status) {
                loadPages();
            });
    };
    $scope.enable = function(page, enabled){
        page.enabled = enabled;
        $http.put('/api/pages/' + page._id, page)
            .success(function (data, status) {
                loadPages();
            });
    };

    loadPages();
});