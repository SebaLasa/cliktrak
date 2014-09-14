angular.module('clicks').controller('campaignEditorController', function ($scope, $http, $location, $routeParams) {
    $scope.allContacts = false;
    $scope.campaign = {};
    $scope.days = {};
    if ($routeParams.id) {
        $http.get('/api/campaigns/' + $routeParams.id)
            .success(function (data, status) {
                $scope.campaign = data;
            }).error(function (data, status) {
                $location.path('campaigns');
            });
    }

    // TODO AN make this in one ajax call.
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
        if (!$scope.pageType || !$scope.page) {
            return alert('Please, select a page for the campaign.');
        }
        $scope.campaign[$scope.pageType] = $scope.page._id;
        $scope.email.contacts = _($scope.contacts).filter(function (contact) {
            return contact.selected;
        }).pluck('_id').value();
        if (!$scope.email.contacts.length) {
            return alert('Plase, select a contact for the campaign.');
        }
        $scope.email.triggers = [
            { days: getDays() }
        ];
        var data = {campaign: $scope.campaign, email: $scope.email};
        if ($routeParams.id) {
            return $http.put('/api/campaigns/' + $routeParams.id, data)
                .success(function (data, status) {
                    $location.path('campaigns');
                });
        }
        $http.post('/api/campaigns/', data)
            .success(function (data, status) {
                $location.path('campaigns');
            });
    };

    $scope.selectAllContacts = function () {
        _.each($scope.contacts, function (contact) {
            contact.selected = $scope.allContacts;
        });
    };

    $scope.addFieldToMessage = function (field) {
        $scope.email.message += '##' + field + '##';
    }
});
