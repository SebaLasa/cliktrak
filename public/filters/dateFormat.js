angular.module('clicks').filter('dateFormat', function ($filter) {
    return function (date) {
        return $filter('date')(date, 'dd/MM/yyyy');
    }
});