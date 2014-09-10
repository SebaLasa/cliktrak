angular.module('clicks').controller('pageEditorController', function ($scope, $http, $location, $routeParams) {
    function registerWatchers() {
        $scope.$watch(function () {
            return $($scope.page.html).find('.staticBarcode').length;
        }, function (newValue) {
            $scope.page.urlConfiguration.barcodeGenerated = !!newValue;
        });
        $scope.$watch(function () {
            return $($scope.page.html).find('.staticQr').length;
        }, function (newValue) {
            $scope.page.urlConfiguration.qrGenerated = !!newValue;
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

    $http.get('/api/layouts/').success(function (data, status) {
        $scope.layouts = data;
    });
    if ($routeParams.id) {
        $http.get('/api/pages/' + $routeParams.id)
            .success(function (data, status) {
                if (!data.urlConfiguration) data.urlConfiguration = {};
                $scope.page = data;
                registerWatchers();
            }).error(function (data, status) {
                $location.path('pages');
            });
    } else {
        $scope.page = { };
        $scope.urlConfiguration = {};
        registerWatchers();
    }
    $scope.addBarcode = function () {
        if ($($scope.page.html).find('.staticBarcode').length) {
            return alert('A static Barcode has already added.');
        }
        $scope.page.html += '<img class="staticBarcode" src="/images/codes/bcS.gif"/>';
    };
    $scope.addQrCode = function () {
        if ($($scope.page.html).find('.staticQr').length) {
            return alert('A static QR code has already added.');
        }
        $scope.page.html += '<img class="staticQr" src="/images/codes/qrS.png"/>';
    };
    $scope.addDynamicBarcode = function () {
        var count = $($scope.page.html).find('.dynamicBarcode').length;
        if (count > 8) {
            return alert('Has reached the maximum quantity of dynamic barcodes.');
        }
        $scope.page.html += '<img class="dynamicBarcode dynamicBarcode' + count + '" src="/images/codes/bc' + count + '.gif"/>';
    };
    $scope.addDynamicQrCode = function () {
        var count = $($scope.page.html).find('.dynamicQr').length;
        if (count > 8) {
            return alert('Has reached the maximum quantity of dynamic QR codes.');
        }
        $scope.page.html += '<img class="dynamicQr dynamicQr' + count + '" src="/images/codes/qr' + count + '.png"/>';
    };
    $scope.save = function () {
        if ($routeParams.id) {
            return $http.put('/api/pages/' + $routeParams.id, $scope.page)
                .success(function (data, status) {
                    $location.path('pages');
                });
        }
        $http.post('/api/pages/', $scope.page)
            .success(function (data, status) {
                $location.path('pages');
            });
    };
});
