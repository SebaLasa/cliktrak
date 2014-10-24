angular.module('clicks').controller('campaignsController', function ($scope, $http) {
   

    function loadCampaigns() {

         $http.get('/api/campaigns/')
            .success(function (data, status) {
                $scope.campaigns = data;
            });
    }

    $scope.enable = function (campaign, enabled) {
        $http.post('/api/campaigns/enable/' + campaign._id, { enabled: enabled })
            .success(function (data, status) {
                loadCampaigns();
            });
    };
    loadCampaigns();
});