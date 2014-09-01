angular.module('clicks').controller('campaignEditorController', function ($scope, $http, $location, $routeParams) {
    $scope.days = {};
    if ($routeParams.id) {
        $http.get('/api/campaigns/' + $routeParams.id)
            .success(function (data, status) {
                $scope.campaign = data;
            }).error(function (data, status) {
                $location.path('campaigns');
            });
    }

    $http.get('/api/pages').success(function (data, status) {
        $scope.pages = data;
    });
    $http.get('/api/customPages').success(function (data, status) {
        $scope.customPages = data;
    });
    $http.get('/api/contacts').success(function (data, status) {
        $scope.contacts = data;
    });

    function getDays() {
        var days = 0;
        if ($scope.days.sunday) {
            days += $scope.days.sunday * 64;
        }
        if ($scope.days.monday) {
            days += $scope.days.monday * 32;
        }
        if ($scope.days.tuesday) {
            days += $scope.days.tuesday * 16;
        }
        if ($scope.days.wednesday) {
            days += $scope.days.wednesday * 8;
        }
        if ($scope.days.thursday) {
            days += $scope.days.thursday * 4;
        }
        if ($scope.days.friday) {
            days += $scope.days.friday * 2;
        }
        if ($scope.days.saturday) {
            days += $scope.days.saturday;
        }
        return days;
    }

    function setDays(days) {
        if (days & 1) {
            $scope.days.saturday = true;
        }
        if (days & 2) {
            $scope.days.friday = true;
        }
        if (days & 4) {
            $scope.days.thursday = true;
        }
        if (days & 8) {
            $scope.days.wednesday = true;
        }
        if (days & 16) {
            $scope.days.tuesday = true;
        }
        if (days & 32) {
            $scope.days.monday = true;
        }
        if (days & 64) {
            $scope.days.sunday = true;
        }
    }

    $scope.save = function () {
        $scope.triggers.days = getDays();
        $scope.campaign.triggers = [$scope.trigger];
        if ($routeParams.id) {
            return $http.put('/api/campaigns/' + $routeParams.id, $scope.campaign)
                .success(function (data, status) {
                    $location.path('campaigns');
                });
        }
        $http.post('/api/campaigns/', $scope.campaign)
            .success(function (data, status) {
                $location.path('campaigns');
            });
    }
});
