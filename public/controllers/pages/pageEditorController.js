angular.module('clicks').controller('pageEditorController', function ($scope, $http, $location, $routeParams, $window) {
    function registerWatchers() {
        $scope.$watch(function () {
            return $($scope.page.html).find('.staticBarcode').length;
        }, function (newValue) {
            $scope.page.barcodeGenerated = !!newValue;
        });
        $scope.$watch(function () {
            return $($scope.page.html).find('.staticQr').length;
        }, function (newValue) {
            $scope.page.qrGenerated = !!newValue;
        });
        $scope.$watch(function () {
            return $($scope.page.html).find('.dynamicQr').length;
        }, function (newValue, oldValue) {
            if (oldValue > newValue) {
                arrangeDynamicCodes('dynamicQr', 'qr');
            }
        });
        $scope.$watch(function () {
            return $($scope.page.html).find('.dynamicBarcode').length;
        }, function (newValue, oldValue) {
            if (oldValue > newValue) {
                arrangeDynamicCodes('dynamicBarcode', 'bc');
            }
        });
    }

    function arrangeDynamicCodes(cssClass, img) {
        var html = $('<div>' + $scope.page.html + '</div>');
        var dynamics = html.find('.' + cssClass);
        for (var i = 0; i < dynamics.length; i++) {
            var code = dynamics.find('.' + cssClass + i);
            if (!code.length) {
                dynamics.filter('.' + cssClass + (i + 1)).removeClass(cssClass + (i + 1)).addClass(cssClass + i)
                    .prop('src', '/images/codes/' + img + i + '.png');
            }
        }
        $scope.page.html = html.html();
    }

    $scope.host = $window.location.host;
    if ($routeParams.id) {
        $http.get('/api/pages/' + $routeParams.id)
            .success(function (data, status) {
                $scope.page = data;
                $scope.urlConfiguration = data.urlConfiguration || {};
                $scope.pageTitle = data.name;
                registerWatchers();
            }).error(function (data, status) {
                $location.path('pages');
            });
    } else {
        $scope.pageTitle = 'Nueva página';
        $scope.page = { forCustomPages: false, quantityDynamicBarcodes: 0, quantityDynamicQrCodes: 0 };
        $scope.urlConfiguration = {};
        registerWatchers();
    }
    $http.get('/api/layouts/').success(function (data, status) {
        if (!data.length) {
            alert('Debe dar de alta un diseño para poder crear una página.');
            return $location.path('layouts/new');
        }
        $scope.layouts = data;
        if (!$scope.page.layout) {
            $scope.page.layout = data[0]._id;
        }
    });
    $scope.addBarcode = function () {
        if ($($scope.page.html).find('.staticBarcode').length) {
            return alert('Un código de barras estático ya ha sido agregado.');
        }
        $scope.page.html += '<img class="staticBarcode" src="/images/codes/bcS.png"/>';
    };
    $scope.addQrCode = function () {
        if ($($scope.page.html).find('.staticQr').length) {
            return alert('Un código QR estático ya ha sido agregado.');
        }
        $scope.page.html += '<img class="staticQr" src="/images/codes/qrS.png"/>';
    };
    $scope.addDynamicBarcode = function () {
        $scope.page.quantityDynamicBarcodes = $($scope.page.html).find('.dynamicBarcode').length;
        if ($scope.page.quantityDynamicBarcodes > 8) {
            return alert('Ha alcanzado el número máximo de códigos de barras dinámicos.');
        }
        $scope.page.html += '<img class="dynamicBarcode dynamicBarcode' + $scope.page.quantityDynamicBarcodes + '" src="/images/codes/bc' + $scope.page.quantityDynamicBarcodes + '.png"/>';
        $scope.page.quantityDynamicBarcodes++;
    };
    $scope.addDynamicQrCode = function () {
        $scope.page.quantityDynamicQrCodes = $($scope.page.html).find('.dynamicQr').length;
        if ($scope.page.quantityDynamicQrCodes > 8) {
            return alert('Ha alcanzado el número máximo de códigos QR dinámicos.');
        }
        $scope.page.html += '<img class="dynamicQr dynamicQr' + $scope.page.quantityDynamicQrCodes + '" src="/images/codes/qr' + $scope.page.quantityDynamicQrCodes + '.png"/>';
        $scope.page.quantityDynamicQrCodes++;
    };
    $scope.setSubmitted = function (customize) {
        $scope.customize = customize;
        $scope.formSubmitted = true;
    };
    $scope.save = function () {
        var data = { page: $scope.page, urlConfiguration: $scope.urlConfiguration };
        if ($routeParams.id) {
            return $http.put('/api/pages/' + $routeParams.id, data)
                .success(function (data, status) {
                    if ($scope.customize) {
                        $location.path('/customPages/new/' + $routeParams.id);
                    } else {
                        $location.path('pages');
                    }
                });
        }
        $http.post('/api/pages/', data)
            .success(function (data, status) {
                if ($scope.customize) {
                    $location.path('/customPages/new/' + data.id);
                } else {
                    $location.path('pages');
                }
            });
    };
});
