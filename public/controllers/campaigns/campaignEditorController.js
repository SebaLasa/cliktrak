angular.module('clicks').controller('campaignEditorController', function ($scope, $http, $location, $routeParams) {
    $scope.tinymceOptions = {
        plugins: "textcolor link table",
        toolbar: "undo redo | styleselect | alignleft aligncenter alignright alignfull | bold italic underline | forecolor backcolor | link table"
    };

    $scope.allContacts = false;
    $scope.campaign = {};
    $scope.days = {};

    // TODO AN make this in one ajax call.
    $http.get('/api/pages/active').success(function (data, status) {
        $scope.pages = data;
        $http.get('/api/customPages').success(function (data, status) {
            $scope.customPages = data;
            $http.get('/api/contacts').success(function (data, status) {
                $scope.contacts = data;
                loadCampaign();
            });
        });
    });

    function loadCampaign() {
        if ($routeParams.id) {
            $http.get('/api/campaigns/' + $routeParams.id)
                .success(function (data, status) {
                    $scope.campaign = data.campaign;
                    $scope.pageTitle = data.campaign.name;
                    if (data.campaign.page) {
                        $scope.pageType = 'page';
                        $scope.page = _.find($scope.pages, {_id: data.campaign.page._id});
                    }
                    if (data.campaign.customPage) {
                        $scope.pageType = 'customPage';
                        $scope.page = _.find($scope.customPages, {_id: data.campaign.customPage._id});
                    }
                    data.email.dateStart = data.email.dateStart.substr(0, 10);
                    data.email.dateEnd = data.email.dateEnd.substr(0, 10);
                    $scope.email = data.email;

                    _.forEach($scope.contacts, function (contact) {
                        if (_.find(data.email.contacts, {'_id': contact._id})) {
                            contact.selected = true;
                        }
                    });

                    setDays(data.email.triggers[0].days);
                }).error(function (data, status) {
                    $location.path('campaigns');
                });
        } else {
            $scope.pageTitle = 'Nueva campaña';
            $scope.email = {message: ''};
        }
    }

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

    $scope.setSubmitted = function () {
        $scope.formSubmitted = true;
    };
    $scope.save = function () {
        if (!$scope.email.message) {
            return alert('El mail debe tener un mensaje para poder enviarse.');
        }
        if (!$scope.pageType || !$scope.page) {
            return alert('Por favor, seleccione una página para la campaña.');
        }
        $scope.campaign[$scope.pageType] = $scope.page._id;
        $scope.email.contacts = _($scope.contacts).filter(function (contact) {
            return contact.selected;
        }).pluck('_id').value();
        if (!$scope.email.contacts.length && $scope.pageType == 'page') {
            return alert('Por favor, seleccione al menos un contacto para la campaña.');
        }
        $scope.email.triggers = [
            {days: getDays()}
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
        _.forEach($scope.contacts, function (contact) {
            contact.selected = $scope.allContacts;
        });
    };

    $scope.addFieldToMessage = function (field) {
        if (!$scope.email.message) {
            $scope.email.message = '';
        }
        $scope.email.message += '##' + field + '##';
    };

    $scope.addCustomValue = function (customValue) {
        if (!$scope.email.message) {
            $scope.email.message = '';
        }
        $scope.email.message += '##' + customValue + '##';
    }
});
